import { useEffect, useState } from 'react'
import { Map } from './Map'
import { LocationInput } from './LocationInput'
import { RegionsInput } from './RegionsInput'

// TODO: Generate based on user location?
const DEFAULT_REGION_AREAS = ['Canada', 'US West', 'US East']

export function Latency() {
  const [regions, setRegions] = useState([])
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
        <div className="container flex items-center justify-center font-bold uppercase shadow-md grow text-slate-400">
          Table
        </div>
      </div>
    </div>
  )
}

/**
 * @typedef {Object} location
 * @property {string} latitude
 * @property {string} longitude
 */
