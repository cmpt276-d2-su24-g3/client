import React, { useEffect, useState, useContext } from 'react';
import { Map } from './Map'
import { LocationInput, LocationType } from './LocationInput'
import { RegionsInput } from './RegionsInput'
import LatencyTable from './LatencyTable'
import { memoize } from '@/lib/utils'
import { NavBar } from '@/components/NavBar'
import regionsJs from '@/lib/regionsJs'
import { ConfigContext } from '@/src/App'

// TODO: Generate based on user location?
const DEFAULT_REGION_AREAS = ['Americas']

export function Latency() {
  const config = useContext(ConfigContext);
  const { R2RApiUrl, R2CUrls } = config;

  const [regions, setRegions] = useState([])
  const [latencies, setLatencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    ;(async () => {
      const regions = regionsJs.map((region) => ({
        ...region,
        selected: DEFAULT_REGION_AREAS.includes(region.area),
      }))
      setRegions(regions)
    })()
  }, [])

  useEffect(() => {
    if (latencies.length === regions.length) return

    setLatencies(
      regions.map((region) => ({
        region: region.code,
        latency: Infinity,
      })),
    )
  }, [regions])

  useEffect(() => {
    ;(async () => {
      if (loading || error || regions.length === 0 || !location) return;
      if (location.type === LocationType.User) {
        await getClientRegionLatencies(regions, setLatencies);
      } else if (location.type === LocationType.Region && location.code) {
        await getRegionRegionLatencies(location.code, latencies, setLatencies, R2RApiUrl);
      } else if (location.type === LocationType.Website && location.url) {
        console.log('Location URL:', location.url);
        await getRegionClientLatencies(location.url, setLatencies, R2CUrls);
      }
    })();
  }, [location, regions, loading, error, R2RApiUrl, R2CUrls]);
  
  return (
    <>
    <NavBar />
    <div className="flex flex-row gap-4 pl-7 pt-5 mt-16 h-dvh">
      <div className="flex flex-col grow">
        <h1 className="text-3xl text-sky-950 font-semibold pt-5">Active Data Centers - Worldwide</h1>
        <h2 className="text-lg text-slate-500">
          View live latency from location to AWS data centers worldwide
        </h2>
        <div className="h-4/5 w-11/12">
          <Map regions={regions} latencies={latencies} location={location} />
        </div>
      </div>
      <div className="flex flex-col gap-3 basis-5/12 mr-6">
        <LocationInput regions={regions} setLocation={setLocation} />
        <RegionsInput regions={regions} latencies={latencies} setRegions={setRegions} />
        <LatencyTable regions={regions} latencies={latencies} />
      </div>
    </div>
    </>
  )
}

// Fetch Region-to-Region Latency Data
// Fetch Region-to-Region Latency Data
async function getRegionRegionLatencies(origin, latencies, setLatencies, R2RApiUrl) {
  // Set all latencies to Infinity initially
  let updatedLatencies = latencies.map((l) => ({ ...l, latency: Infinity }));
  setLatencies(updatedLatencies);

  try {
    // Get the region-to-region latency data from the API Gateway
    const data = await getRegionRegionDataCached(R2RApiUrl);

    const latestDataMap = {};
    data.forEach((item) => {
      if (item.origin === origin) {
        const existingEntry = latestDataMap[item.destination];
        // If no entry exists or the current item's timestamp is newer, update the map
        if (!existingEntry || item.timestamp > existingEntry.timestamp) {
          latestDataMap[item.destination] = item;
        }
      }
    });

    const newLatencies = updatedLatencies.map((latency) => {
      if (latency.region === origin) return latency; // Skip origin region itself
      const latestLatencyEntry = latestDataMap[latency.region];
      if (latestLatencyEntry) {
        return { ...latency, latency: latestLatencyEntry.latency };
      }
      return latency; // Retain Infinity if no data found
    });

    // Update the latencies state with the new data
    setLatencies(newLatencies);
  } catch (error) {
    console.error("Error fetching region-to-region latencies:", error);
  }
}


// Fetch data from API Gateway for Region-to-Region Latencies
async function getRegionRegionData(R2RApiUrl) {
  try {
    // Make a request to your API Gateway, passing the origin as a query parameter
    const response = await fetch(
      `${R2RApiUrl}fetch-ping`
    );

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error('Failed to fetch region-to-region latencies');
    }

    // Parse the response as JSON
    const json = await response.json();
    console.log(json)

    // Return the latency data
    return json.map((item) => ({
      origin: item.origin,
      destination: item.destination,
      latency: parseFloat(item.latency),
      timestamp: new Date(item.timestamp).getTime(),
    }));
  } catch (error) {
    console.error('Error fetching region-to-region data:', error);
    return [];
  }
}

// Memoized version of getRegionRegionData to cache the results
const getRegionRegionDataCached = memoize(getRegionRegionData);


//Client-to-Region
async function getClientRegionLatencies(regions, setLatencies) {
  await Promise.all(
    regions
      .filter((region) => region.selected)
      .map(async (region) => {
        const latency = await getClientRegionLatency(region)
        setLatencies((latencies) =>
          latencies.map((l) =>
            l.region === region.code ? { ...l, latency } : l,
          ),
        )
      }),
  )
}

async function getClientRegionLatency(region) {
  console.log(region.code)
  const url = `https://dynamodb.${region.code}.amazonaws.com`
  await fetch(url)
  const now = performance.now()
  await fetch(url)
  const latency = performance.now() - now
  return latency
}


//Region-to-Client
async function getRegionClientLatencies(host, setLatencies, R2C_Urls) {
  const filteredRegions = Object.keys(R2C_Urls);

  for (const region of filteredRegions) {
    try {
      const response = await fetch(`${R2C_Urls[region]}url-ping`, {
        method: 'POST',
        body: JSON.stringify({ region, host }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseBody = await response.json();
      console.log(`Response from region ${region}:`, responseBody); // Log response to inspect it

      const latency = parseFloat(responseBody.latency);

      if (isNaN(latency)) {
        console.error(`Invalid latency for region ${region}:`, responseBody);
        continue;
      }

      setLatencies((latencies) =>
        latencies.map((l) =>
          l.region === region ? { ...l, latency } : l
        )
      );
    } catch (error) {
      console.error(`Error fetching latencies for region ${region}:`, error);
      setLatencies((latencies) =>
        latencies.map((l) =>
          l.region === region ? { ...l, latency: Infinity } : l
        )
      );
    }
  }
}


