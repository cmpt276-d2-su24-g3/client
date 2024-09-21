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
    <div className="flex flex-col items-center justify-center border h-full p-4">
      <div className="items-left">
      <span className="text-normal text-customLavender">{type}</span>
      <div className="flex items-center mt-4 space-x-4"> 
        <span className="text-4xl text-sky-900">{latency}</span>
      </div>
    </div>
    </div>
  );
};


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
    setDestination('ca-central-1')
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
    <div className="px-0 mt-16"></div>
    <NavBar page="Latency History" />
    <div className="flex justify-center min-h-screen py-10 bg-customBg">
      <div className="flex flex-col w-full ml-8 mr-5">
      <div className="flex flex-row">
      <Link to="/latency" className="mt-2 -ml-3 mr-4 bg-white p-2 text-sky-950 rounded-full"><ArrowLeft /></Link>   
        <span className="text-3xl font-bold pt-2 text-sky-900">
          Historical Latency - Worldwide
        </span></div>
        <span className="text-customLavender px-11 mt-0">
          View historical latency from location to AWS data centers worldwide
        </span>
      
        <div className="flex my-4 bg-white h-auto rounded-lg">
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
            <div className="flex flex-col justify-center items-start pl-5">
              <span className="text-customLavender text-sm font-semibold">starting location:</span>
              <span className="text-2xl text-customText">{startingLocation}</span>
          
            </div>
            <Separator />
            <div className="flex flex-col w-2/5 p-4 mr-2 bg-white rounded-lg justify-evenly">
              <span className="text-customLavender text-sm font-semibold">Destination:</span>
              <span className="text-2xl text-customText">{destination}</span>
            
            </div>
          </div>
          <div className="flex-1 pt-5 ml-2 bg-white rounded-lg ">
            <div className="flex justify-between pb-4 pt-4">
              <div className="flex flex-row">
                <span className="text-2xl pl-8 pt-1 font-semibold text-sky-900 pb-2">
                  Region Performance{' '}
                </span>
                <span className="text-xs text-customLavender pl-4 pt-4">
                  Select a final destination to view historical latency
                </span>
              </div>
              <Input
                className="w-fit mr-5"
                placeholder="search.."
                onKeyPress={(e) =>
                  e.key === 'Enter' && setSearched(e.target.value)
                }
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                  <div className="pl-5">Select</div>
                    </TableHead>
                  <TableHead>
                      Region
                    </TableHead>
                  <TableHead>Region Code</TableHead>
                  <TableHead>Latency (ms)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-normal text-customPurple">
                {regions?.map(
                  (region, index) =>
                    (region.name.toUpperCase() === searched.toUpperCase() ||
                      (searched === '' &&
                        index >= tableIndex * 3 - 2 &&
                        index <= tableIndex * 3)) && (
                      <TableRow key={region.code}>
                        <TableCell>
                          <div className="pl-5">
                          <Checkbox variant="outline" onClick={() => {setDestination(region.code)}}></Checkbox>
                          </div>
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
              className="aspect-square bg-white border-none text-customMauve ml-6 mb-4"
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
              className="aspect-square bg-white border-none text-customMauve ml-0 mb-4"
              onClick={() => {
                tableIndex < regions.length / 3 &&
                  setTableIndex(tableIndex + 1)
                setSearched('')
              }}
            >
              
              <ArrowDown />
              <div className="font-semibold"> ....</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
