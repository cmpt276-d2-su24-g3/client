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
import RedPing from '../../assets/red-ping.svg';
import OrangePing from '../../assets/orange-ping.svg';
import GreenPing from '../../assets/green-ping.svg';

export function RegionsInput({ regions, setRegions, latencies }) {
  const [area, setArea] = useState(null)

  const areas = [...new Set(regions.map((region) => region.area))]

  useEffect(() => {
    if (area) return
    setArea(areas[0])
  }, [regions])

  // Function to get latency for a specific region
  const getLatency = (regionCode) => {
    const latencyObj = latencies.find((latency) => latency.region === regionCode)
    return latencyObj ? latencyObj.latency : null
  }

  // Function to select the appropriate ping image based on latency
  const getPingImage = (latency) => {
    if (latency === null) return null; // Handle null latency case
    
    // Define thresholds
    const thresholds = {
      green: 50,  // Example threshold for green ping
      orange: 150 // Example threshold for orange ping
    };

    if (latency <= thresholds.green) return GreenPing;
    if (latency <= thresholds.orange) return OrangePing;
    return RedPing;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between pt-3">
          <div>
            <CardTitle>Regions</CardTitle>
            <CardDescription>
              Select AWS regions to get view latency across regions.
            </CardDescription>
          </div>
          
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="w-[190px]">
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
      <CardContent className="grid grid-cols-2 pl-3">
        {regions
          .filter((region) => region.area === area)
          .map((region) => {
            const latency = getLatency(region.code);
            const pingImage = getPingImage(latency);

            return (
              <div className="flex flex-col items-start gap-2 pl-4" key={region.code}>
                <div className="flex items-center gap-2 text-customPurple">
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
                  <label htmlFor={region.code}>
                    {region.name} ({region.code})
                  </label>
                </div>
                {latency !== null && (
                  <div className="flex items-center text-sm gap-3 -mt-2 mb-3 text-customMauve ">
                    <img
                      src={pingImage}
                      alt="Ping Indicator"
                      className="mt-0.5 w-4 h-3 md:w-4 md:h-3 lg:w-4 lg:h-3 object-cover"
                    />
                    <span>
                      Ping: {latency.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ms
                    </span>
                  </div>
                )}
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}

RegionsInput.propTypes = {
  regions: PropTypes.array.isRequired,
  setRegions: PropTypes.func.isRequired,
  latencies: PropTypes.array.isRequired,
}
