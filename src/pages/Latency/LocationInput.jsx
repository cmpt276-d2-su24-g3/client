import { useState } from 'react'
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

export function LocationInput({ regions }) {
  const [isUserLocation, setIsUserLocation] = useState(true)
  const [isRegion, setIsRegion] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
        <CardDescription>Select where to get the latency from.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 align-middle">
          {isRegion ? (
            <RegionCombobox regions={regions} disabled={isUserLocation} />
          ) : (
            <Input disabled placeholder="Regions" className="w-fit" />
          )}
          <Button
            onClick={() => setIsRegion(!isRegion)}
            variant="outline"
            size="icon"
            className="aspect-square"
            disabled={isUserLocation}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
          {isRegion ? (
            <Input disabled placeholder="Regions" className="w-fit" />
          ) : (
            <Input
              placeholder="URL or IP"
              className="w-fit"
              disabled={isUserLocation}
            />
          )}
          <div className="flex items-center gap-2 pl-4">
            <Checkbox
              id="user-location-checkbox"
              checked={isUserLocation}
              onClick={() => setIsUserLocation(!isUserLocation)}
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
}
