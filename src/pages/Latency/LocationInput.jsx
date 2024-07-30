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

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYmhhdmppdGNoYXVoYW4iLCJhIjoiY2x5MG95ejEzMGhuMDJtb2tvb3RpZHMyMiJ9.fJafGFJkITooEewonltjGw'

export const LocationType = Object.freeze({
  User: 'user',
  Region: 'region',
  Host: 'host',
  Website: 'website',
})

export function LocationInput({ regions, setLocation }) {
  const [locationType, setLocationType] = useState(LocationType.User)
  const [regionCode, setRegionCode] = useState(null)
  const [url, setUrl] = useState('') // state for URL
  const [userLocation, setUserLocation] = useState(null) // state for user location
  const [selectedRegion, setSelectedRegion] = useState(null) // state for selected region
  const [websiteUrl, setWebsiteUrl] = useState('') // state for website URL

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
          const region = regions.find((region) => region.code === regionCode)
          setLocation({
            ...region,
            type: LocationType.Region,
          })
          setSelectedRegion(region ? region.name : null)
          break
        case LocationType.Host: {
          // Handle Host case
          break
        }
        case LocationType.Website: {
          if (url) {
            setLocation({
              type: LocationType.Website,
              url: url, // URL in location
            })
            setWebsiteUrl(url)
          }
          break
        }
      }
    })()
  }, [locationType, regionCode, url])

  useEffect(() => {
    if (locationType === LocationType.User) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`)
            const data = await response.json()
            const location = data.features[0]?.place_name || 'Unknown location'
            setUserLocation(location)
          } catch (error) {
            console.error('Error getting location:', error)
            setUserLocation('Unable to retrieve location')
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          setUserLocation('Unable to retrieve location')
        }
      )
    }
  }, [locationType])

  function handleSwap() {
    const newLocationType =
      locationType === LocationType.Region
        ? LocationType.Website
        : LocationType.Region
    setLocationType(newLocationType)
    prevBinaryLocationType.current = newLocationType
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Location</CardDescription>
        {locationType === LocationType.User && (
          <CardTitle>
            {userLocation || 'Fetching...'}
          </CardTitle>
        )}
        {locationType === LocationType.Region && selectedRegion && (
          <CardTitle>
            {selectedRegion}
          </CardTitle>
        )}
        {locationType === LocationType.Website && websiteUrl && (
          <CardTitle>
            {websiteUrl}
          </CardTitle>
        )}
        <div class="border-b-2 pt-3 border-dotted border-gray-300"></div>
        <div class="font-semibold text-customPurple pt-1 text-lg"> 
          Choose Location
        </div>

      </CardHeader>
      <CardContent>
      <div className="flex gap-2 align-middle">
          <RegionCombobox
            regions={regions}
            setRegion={setRegionCode}
            disabled={locationType !== LocationType.Region}
            hidden={locationType !== LocationType.Region}
          />
          {locationType !== LocationType.Region && (
            <Input disabled placeholder={locationType === LocationType.User ? "Regions" : "AWS Region"} className="w-fit" />
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
          <Input
            placeholder={locationType === LocationType.Website ? "Website URL" : "AWS regions"}
            className="w-fit"
            disabled={locationType !== LocationType.Website}
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
