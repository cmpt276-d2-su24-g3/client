import { useEffect, useState } from 'react'
import { Map } from './Map'
import { LocationInput, LocationType } from './LocationInput'
import { RegionsInput } from './RegionsInput'
import LatencyTable from './LatencyTable'
import { memoize } from '@/lib/utils'
import { NavBar } from '@/components/NavBar'
import regionsJs from '@/lib/regionsJs'

// TODO: Generate based on user location?
const DEFAULT_REGION_AREAS = ['Americas']

export function Latency({ R2RUrl, R2CUrl }) {
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
        await getRegionRegionLatencies(location.code, latencies, setLatencies);
      } else if (location.type === LocationType.Website && location.url) {
        console.log('Location URL:', location.url);
        await getRegionClientLatencies(location.url, setLatencies);
      }
    })();
  }, [location, regions, loading, error]);
  
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
async function getRegionRegionLatencies(origin, latencies, setLatencies) {
  // Set all latencies to Infinity initially
  let updatedLatencies = latencies.map((l) => ({ ...l, latency: Infinity }));
  setLatencies(updatedLatencies);

  try {
    // Get the region-to-region latency data from the API Gateway
    const data = await getRegionRegionDataCached(origin);

    // Filter the data to only include latencies where the origin matches the selected origin
    const filteredData = data.filter((item) => item.origin === origin);

    // Create a new latencies array to update the state
    const newLatencies = updatedLatencies.map((latency, i) => {
      if (latency.region === origin) return latency;  // Skip the origin region itself
      const newLatency = filteredData.find((l) => l.destination === latency.region);
      if (newLatency) {
        return { ...latency, latency: newLatency.latency };  // Update the latency if found
      }
      return latency;
    });

    // Update the latencies state with the new data
    setLatencies(newLatencies);
  } catch (error) {
    console.error("Error fetching region-to-region latencies:", error);
  }
}


// Fetch data from API Gateway for Region-to-Region Latencies
async function getRegionRegionData(origin) {
  try {
    // Make a request to your API Gateway, passing the origin as a query parameter
    const response = await fetch(
      `${import.meta.env.VITE_AWS_API_URL}?origin=${origin}`
    );

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error('Failed to fetch region-to-region latencies');
    }

    // Parse the response as JSON
    const json = await response.json();

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
// Map of regions to Lambda function URLs
const regionToUrlMap = {
  'us-east-1': import.meta.env.VITE_AWS_R2C_URL_US_EAST_1,
  'us-east-2': import.meta.env.VITE_AWS_R2C_URL_US_EAST_2,
  'us-west-1': import.meta.env.VITE_AWS_R2C_URL_US_WEST_1,
  'us-west-2': import.meta.env.VITE_AWS_R2C_URL_US_WEST_2,
  'af-south-1': import.meta.env.VITE_AWS_R2C_URL_AF_SOUTH_1,
  'ap-east-1': import.meta.env.VITE_AWS_R2C_URL_AP_EAST_1,
  'ap-south-2': import.meta.env.VITE_AWS_R2C_URL_AP_SOUTH_2,
  'ap-southeast-3': import.meta.env.VITE_AWS_R2C_URL_AP_SOUTHEAST_3,
  'ap-southeast-4': import.meta.env.VITE_AWS_R2C_URL_AP_SOUTHEAST_4,
  'ap-south-1': import.meta.env.VITE_AWS_R2C_URL_AP_SOUTH_1,
  'ap-northeast-3': import.meta.env.VITE_AWS_R2C_URL_AP_NORTHEAST_3,
  'ap-northeast-2': import.meta.env.VITE_AWS_R2C_URL_AP_NORTHEAST_2,
  'ap-southeast-1': import.meta.env.VITE_AWS_R2C_URL_AP_SOUTHEAST_1,
  'ap-southeast-2': import.meta.env.VITE_AWS_R2C_URL_AP_SOUTHEAST_2,
  'ap-northeast-1': import.meta.env.VITE_AWS_R2C_URL_AP_NORTHEAST_1,
  'ca-central-1': import.meta.env.VITE_AWS_R2C_URL_CA_CENTRAL_1,
  'ca-west-1': import.meta.env.VITE_AWS_R2C_URL_CA_WEST_1,
  'eu-central-1': import.meta.env.VITE_AWS_R2C_URL_EU_CENTRAL_1,
  'eu-west-1': import.meta.env.VITE_AWS_R2C_URL_EU_WEST_1,
  'eu-west-2': import.meta.env.VITE_AWS_R2C_URL_EU_WEST_2,
  'eu-south-1': import.meta.env.VITE_AWS_R2C_URL_EU_SOUTH_1,
  'eu-west-3': import.meta.env.VITE_AWS_R2C_URL_EU_WEST_3,
  'eu-south-2': import.meta.env.VITE_AWS_R2C_URL_EU_SOUTH_2,
  'eu-north-1': import.meta.env.VITE_AWS_R2C_URL_EU_NORTH_1,
  'eu-central-2': import.meta.env.VITE_AWS_R2C_URL_EU_CENTRAL_2,
  'me-south-1': import.meta.env.VITE_AWS_R2C_URL_ME_SOUTH_1,
  'me-central-1': import.meta.env.VITE_AWS_R2C_URL_ME_CENTRAL_1,
  'il-central-1': import.meta.env.VITE_AWS_R2C_URL_IL_CENTRAL_1,
  'sa-east-2': import.meta.env.VITE_AWS_R2C_URL_SA_EAST_2
};


async function getRegionClientLatencies(host, setLatencies) {
  const filteredRegions = Object.keys(regionToUrlMap);

  for (const region of filteredRegions) {
    try {
      const response = await fetch(regionToUrlMap[region], {
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


