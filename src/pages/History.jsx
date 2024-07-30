import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowDown, ArrowUp } from 'lucide-react'

import { NavBar } from '@/components/NavBar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Component as LinearChart } from '@/components/ui/linearchart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const InfoBlock = ({ type, latency }) => {
  return (
    <div className="flex flex-col items-center justify-center border">
      <span className="text-2xl text-gray-400">{type}</span>
      <span className="text-4xl text-gray-700">{latency}</span>
    </div>
  )
}

export function History({ startFromLatency, destinationFromLatency }) {
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState('')
  const [tableIndex, setTableIndex] = useState(1)
  const [pings, setPings] = useState([])
  const [startingLocation, setStartingLocation] = useState(startFromLatency)
  const [destination, setDestination] = useState(destinationFromLatency)
  // If a user acceses the page by clicking on the latency history page at the top (So not clicking isoline) then use these destinations
  // Otherwise, use the locations from the isoline
  if (!startingLocation && !destination) {
    setStartingLocation('us-west-2')
    setDestination('af-south-1')
  }

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_API_URL + '/data/regions.json'
        )
        if (!res.ok) throw new Error('Failed to fetch regions')
        const regions = await res.json()
        setRegions(regions)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          'https://ncst1bngw1.execute-api.us-west-2.amazonaws.com/dev/pingdata'
        )
        if (!res.ok) throw new Error('Failed to fetch pings')
        const data = await res.json()

        const filteredData = data.Items
          .filter(item => 
            item.origin.S === startingLocation &&
            item.destination.S === destination
          )
          .map(item => ({
            time: new Date(item.timestamp.S).toLocaleTimeString(),
            latency: parseFloat(item.latency.N),
          }))

        setPings(filteredData)
      } catch (error) {
        setError(error)
      }
    })()
  }, [startingLocation, destination])

  const getLatencyAt = (hour) => {
    const targetHour = hour.toString().padStart(2, '0')
    const filteredPings = pings.filter(ping => {
      const [time, period] = ping.time.split(' ')
      const [hours, minutes, seconds] = time.split(':').map(Number)
      const parsedHour = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours)
      const pingHour = parsedHour.toString().padStart(2, '0')
      return pingHour === targetHour
    })
    if (filteredPings.length === 0) return 'N/A'
    const averageLatency = filteredPings.reduce((sum, ping) => sum + parseFloat(ping.latency), 0) / filteredPings.length
    return Math.round(averageLatency) + ' ms'
  }
  
  const getLiveLatency = () => {
    const lastPing = pings[pings.length - 1]
    return lastPing ? Math.round(lastPing.latency) + ' ms' : 'N/A'
  }

  const getPercentileLatency = (percentile) => {
    if (pings.length === 0) return 'N/A'
    const sortedLatencies = pings.map(ping => ping.latency).sort((a, b) => a - b)
    const index = Math.floor((percentile / 100) * sortedLatencies.length)
    return Math.round(sortedLatencies[index]) + ' ms'
  }

  return (
    <div>
      <NavBar page="Latency History" />
      <div className="flex justify-center min-h-screen py-8 bg-sky-100">
        <div className="flex flex-col w-11/12">
          <Link to="/latency" className="m-2"><ArrowLeft /></Link>
          <span className="text-2xl font-bold">
            Historical Latency - Worldwide
          </span>
          <span className="text-gray-400">
            View historical latency from location to AWS data centers worldwide
          </span>
          <div className="flex my-4 bg-white rounded-lg">
            <div className="w-1/2">
              <LinearChart pings={pings} startingLocation={startingLocation} destination={destination}/>
            </div>
            <div className="grid flex-1 grid-cols-2 grid-rows-2">
              <InfoBlock type="16:00 PST" latency={getLatencyAt(16)} />
              <InfoBlock type="Live" latency={getLiveLatency()} />
              <InfoBlock type="P50" latency={getPercentileLatency(50)} />
              <InfoBlock type="P90" latency={getPercentileLatency(90)} />
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col w-2/5 p-4 mr-2 bg-white rounded-lg justify-evenly">
              <div className="flex flex-col">
                <span className="text-gray-400">Starting location:</span>
                <span className="text-2xl text-gray-700">{startingLocation}</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="text-gray-400">Destination:</span>
                <span className="text-2xl text-gray-700">{destination}</span>
              </div>
            </div>
            <div className="flex-1 p-4 ml-2 bg-white rounded-lg">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">
                    Region Performance{' '}
                  </span>
                  <span className="text-xs text-gray-400">
                    Select a final destination to view historical latency
                  </span>
                </div>
                <Input
                  className="w-fit"
                  placeholder="Search data center"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && setSearched(e.target.value)
                  }
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Region Code</TableHead>
                    <TableHead>Latency (ms)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {regions?.map(
                    (region, index) =>
                      (region.name.toUpperCase() === searched.toUpperCase() ||
                        (searched === '' &&
                          index >= tableIndex * 3 - 2 &&
                          index <= tableIndex * 3)) && (
                        <TableRow key={region.code}>
                          <TableCell>
                            <Button variant="outline" onClick={() => {setDestination(region.code)}}>Select</Button>
                            {/* <Checkbox /> */}
                          </TableCell>{' '}
                          <TableCell>
                            {region.name} ({region.area})
                          </TableCell>
                          <TableCell>{region.code}</TableCell>
                          <TableCell>100 ms</TableCell>
                        </TableRow>
                      ),
                  )}
                </TableBody>
              </Table>
              <Button
                variant="outline"
                size="icon"
                className="aspect-square"
                onClick={() => {
                  tableIndex > 1 && setTableIndex(tableIndex - 1)
                  setSearched('')
                }}
              >
                <ArrowUp />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="ml-2 aspect-square"
                onClick={() => {
                  tableIndex < regions.length / 3 &&
                    setTableIndex(tableIndex + 1)
                  setSearched('')
                }}
              >
                <ArrowDown />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
