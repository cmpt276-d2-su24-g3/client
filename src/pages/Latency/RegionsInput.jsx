import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export function RegionsInput({ regions, setRegions }) {
  const [area, setArea] = useState(null)

  const areas = [...new Set(regions.map((region) => region.area))]

  useEffect(() => {
    if (area) return
    setArea(areas[0])
  }, [regions])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Regions</CardTitle>
            <CardDescription>
              Select which AWS regions to get the latency to.
            </CardDescription>
          </div>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a region area" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2">
        {regions
          .filter((region) => region.area === area)
          .map((region) => (
            <div className="flex items-center gap-2 pl-4" key={region.code}>
              <Checkbox
                id={region.code}
                checked={
                  regions.find(({ code }) => code === region.code).selected
                }
                onClick={() =>
                  setRegions((regions) =>
                    regions.map((r) =>
                      r.code === region.code
                        ? { ...r, selected: !r.selected }
                        : r,
                    ),
                  )
                }
              />
              <label htmlFor={region.code}>{region.name}</label>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
RegionsInput.propTypes = {
  regions: PropTypes.array.isRequired,
  setRegions: PropTypes.func.isRequired,
}
