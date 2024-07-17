import { useEffect, useState } from 'react'
import { Map } from './Map'
import { LocationInput, LocationType } from './LocationInput'
import { RegionsInput } from './RegionsInput'
import LatencyTable from './LatencyTable'

// TODO: Generate based on user location?
const DEFAULT_REGION_AREAS = ['Canada', 'US West', 'US East']

export function Latency() {
  const [regions, setRegions] = useState([])
  const [latencies, setLatencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_API_URL + '/data/regions.json',
        )
        if (!res.ok) throw new Error('Failed to fetch regions')
        const regions = (await res.json()).map((region) => ({
          ...region,
          selected: DEFAULT_REGION_AREAS.includes(region.area),
        }))
        setRegions(regions)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (latencies.length === regions.length) return

    setLatencies(
      regions.map((region) => ({
        region: region.code,
        latency: region.latency,
      })),
    )
  }, [regions])

  useEffect(() => {
    ;(async () => {
      if (loading || error || regions.length === 0) return
      if (location.type === LocationType.User)
        await getClientRegionLatencies(regions, setLatencies)
    })()
  }, [location, regions, loading, error])

  return (
    <div className="flex flex-row gap-4 p-4 h-dvh">
      <div className="flex flex-col grow">
        <h1 className="text-3xl">Latency</h1>
        <h2 className="xl">
          Get live latencies to AWS data centers worldwide.
        </h2>
        <div className="h-full">
          <Map regions={regions} location={location} />
        </div>
      </div>
      <div className="flex flex-col gap-2 basis-2/5">
        <LocationInput regions={regions} setLocation={setLocation} />
        <RegionsInput regions={regions} setRegions={setRegions} />
        <LatencyTable regions={regions} latencies={latencies} />
      </div>
    </div>
  )
}

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
  const url = `https://dynamodb.${region.code}.amazonaws.com`
  const now = performance.now()
  await fetch(url)
  const latency = performance.now() - now
  return latency
}

/**
 * @typedef {Object} location
 * @property {string} latitude
 * @property {string} longitude
 */
