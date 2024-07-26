import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRightLeft } from 'lucide-react'
import { RegionCombobox } from '@/components/ui/region-combobox'
import { isIp, resolveHostIp, resolveIpLocation } from '@/lib/geolocate'
import { memoize } from '@/lib/utils'

const resolveHostIpCached = memoize(resolveHostIp)
const resolveIpLocationCached = memoize(resolveIpLocation)

export const LocationType = Object.freeze({
  User: 'user',
  Region: 'region',
  Host: 'host',
  Website: 'website', // Added LocationType for Website
})

export function LocationInput({ regions, setLocation }) {
  const [locationType, setLocationType] = useState(LocationType.User)
  const [regionCode, setRegionCode] = useState(null)
  const [host, setHost] = useState(null)
  const [url, setUrl] = useState('') // Added state for URL

  const prevBinaryLocationType = useRef(
    locationType !== LocationType.User ? locationType : LocationType.Region,
  )

  useEffect(() => {
    ;(async () => {
      switch (locationType) {
        case LocationType.User:
          setLocation({
            type: LocationType.User,
          })
          break
        case LocationType.Region:
          setLocation({
            ...regions.find((region) => region.code === regionCode),
            type: LocationType.Region,
          })
          break
        case LocationType.Host: {
          if (host) {
            try {
              let ip = host
              if (!isIp(ip)) ip = await resolveHostIpCached(host)
              if (!isIp(ip)) return
              const location = await resolveIpLocationCached(ip)
              setLocation({
                ...location,
                type: LocationType.Host,
              })
            } catch (error) {
              setLocation(null)
            }
          }
          break
        }
        case LocationType.Website: {
          if (url) {
            setLocation({
              type: LocationType.Website,
              url: url, // Set URL in location
            })
          }
          break
        }
      }
    })()
  }, [locationType, regionCode, host, url])

  function handleSwap() {
    const newLocationType =
      locationType === LocationType.Region
        ? LocationType.Host
        : locationType === LocationType.Host
        ? LocationType.Website
        : LocationType.Region
    setLocationType(newLocationType)
    prevBinaryLocationType.current = newLocationType
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
        <CardDescription>Select where to get the latency from.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 align-middle">
          <RegionCombobox
            regions={regions}
            setRegion={setRegionCode}
            disabled={locationType !== LocationType.Region}
            hidden={prevBinaryLocationType.current !== LocationType.Region}
          />
          {prevBinaryLocationType.current !== LocationType.Region && (
            <Input disabled placeholder="Regions" className="w-fit" />
          )}
          <Button
            onClick={handleSwap}
            variant="outline"
            size="icon"
            className="aspect-square"
            disabled={locationType === LocationType.User}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
          {prevBinaryLocationType.current !== LocationType.Host && (
            <Input disabled placeholder="Regions" className="w-fit" />
          )}
          <Input
            placeholder="URL or IP"
            className={
              'w-fit' +
              (prevBinaryLocationType.current !== LocationType.Host
                ? ' hidden'
                : '')
            }
            disabled={locationType === LocationType.User}
            onBlur={(e) => setHost(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setHost(e.target.value)}
          />
          {prevBinaryLocationType.current !== LocationType.Website && (
            <Input disabled placeholder="URL" className="w-fit" />
          )}
          <Input
            placeholder="Website URL"
            className={
              'w-fit' +
              (prevBinaryLocationType.current !== LocationType.Website
                ? ' hidden'
                : '')
            }
            disabled={locationType === LocationType.User}
            onBlur={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setUrl(e.target.value)}
          />

          <div className="flex items-center gap-2 pl-4">
            <Checkbox
              id="user-location-checkbox"
              checked={locationType === LocationType.User}
              onClick={() =>
                setLocationType(
                  locationType === LocationType.User
                    ? prevBinaryLocationType.current
                    : LocationType.User,
                )
              }
            />
            <label
              htmlFor="user-location-checkbox"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Use my location
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

LocationInput.propTypes = {
  regions: PropTypes.array.isRequired,
  setLocation: PropTypes.func.isRequired,
}