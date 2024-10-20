import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowDown, ArrowUp, ArrowUpRight } from 'lucide-react'
import { ConfigContext } from '@/src/App'

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

import regionsJs from '@/lib/regionsJs'

const InfoBlock = ({ type, latency }) => {
  return (
    <div className="flex flex-col items-center justify-center border h-full w-1/3 p-4">
      <div className="items-left">
        <div className="flex items-center mt-4 space-x-4"> 
          <span className="text-4xl text-sky-900">{latency}</span>
        </div>
        <span className="text-normal text-customLavender">{type}</span>
      </div>
    </div>
  );
};


export function History({ startFromLatency, destinationFromLatency }) {
  const config = useContext(ConfigContext);
  const { R2RApiUrl } = config;

  const [regions, setRegions] = useState([])
  const [searched, setSearched] = useState('')
  const [tableIndex, setTableIndex] = useState(1)
  const [pings, setPings] = useState([])
  // If a user acceses the page by clicking on the latency history page at the top (So not clicking isoline) then use these destinations
  // Otherwise, use the locations from the isoline
  const [startingLocation, setStartingLocation] = useState(startFromLatency || 'us-west-2')
  const [destination, setDestination] = useState(destinationFromLatency || 'ca-central-1')

  useEffect(() => {
    ;(async () => {
      const regions = regionsJs
      setRegions(regions)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          R2RApiUrl
        )
        if (!res.ok) throw new Error('Failed to fetch pings')
        const data = await res.json()
        console.log(data)

        const filteredData = data
          .filter(item => 
            item.origin === startingLocation &&
            item.destination === destination
          )
          .map(item => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            latency: parseFloat(item.latency),
          }))

        setPings(filteredData)
      } catch (error) {
      }
    })()
  }, [startingLocation, destination]) //TODO pings is empty

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
    console.log(pings)
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
          <div className="w-3/5">
            <LinearChart pings={pings} startingLocation={startingLocation} destination={destination}/>
          </div>
          <div className='flex-1'>
            <div className='flex'>
              <InfoBlock type="Live" latency={getLiveLatency()} />
              <InfoBlock type="P50" latency={getPercentileLatency(50)} />
              <InfoBlock type="P90" latency={getPercentileLatency(90)} />
            </div>
            <div className='flex'>
              <div className='flex flex-col m-10'>
                <span className='font-semibold text-sky-900 mb-6'>Details</span>
                <span className='my-2 text-gray-500'>Total # of requests</span>
                <span className='my-2 text-gray-500'>Distinct IPs</span>
                <span className='my-2 text-gray-500'>Distinct variable combinations</span>
                <span className='my-2 text-gray-500'>Distinct headers combinations</span>
                <span className='my-2 text-gray-500'>Distinct response body values</span>
                <span className='my-2 text-gray-500'>Other distinct request parts</span>
              </div>
              <div className='flex flex-col m-10'>
                <span className='my-2 mt-14'>Placeholder</span>
                <span className='my-2'>Placeholder</span>
                <span className='my-2'>Placeholder</span>
                <span className='my-2'>Placeholder</span>
                <span className='my-2'>Placeholder</span>
                <span className='my-2'>Placeholder</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col w-2/5 p-8 mr-2 bg-white rounded-lg">
            <span className="mb-4 text-2xl font-medium text-sky-900">
              Services Offered
            </span>
            <Separator />
            <div className='mt-4 grid grid-cols-2 gap-y-2'>
              <div className='flex'>
                <Link className="text-gray-500" to="/latency">AWS LakeFormation</Link>
                <ArrowUpRight />
              </div>
            </div>
          </div>
          <div className="flex-1 pt-5 ml-2 bg-white rounded-lg ">
            <div className="flex justify-between pb-4 pt-4">
              <div className="flex flex-row">
                <span className="text-2xl pl-8 font-medium text-sky-900 pb-2">
                  Region Selection{' '}
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
