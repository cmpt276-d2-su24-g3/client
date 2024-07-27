import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

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
      <span className="text-gray-400">{type}</span>
      <span className="text-2xl text-gray-700">{latency}</span>
    </div>
  )
}

export function History() {
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState('')
  const [tableIndex, setTableIndex] = useState(1)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_API_URL + '/data/regions.json',
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

  return (
    <div>
      <NavBar page="Latency History" />
      <div className="flex justify-center min-h-screen py-8 bg-sky-100">
        <div className="flex flex-col w-10/12">
          <span className="text-2xl font-bold">
            Historical Latency - Worldwide
          </span>
          <span className="text-gray-400">
            View historical latency from location to AWS data centers worldwide
          </span>
          <div className="flex my-4 bg-white rounded-lg">
            <div className="w-3/5">
              <LinearChart />
            </div>
            <div className="grid flex-1 grid-cols-2 grid-rows-2">
              <InfoBlock type="16:00 PST" latency="84 ms" />
              <InfoBlock type="Live" latency="104 ms" />
              <InfoBlock type="P50" latency="95 ms" />
              <InfoBlock type="P90" latency="93 ms" />
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col w-2/5 p-4 mr-2 bg-white rounded-lg justify-evenly">
              <div className="flex flex-col">
                <span className="text-gray-400">Starting location:</span>
                <span className="text-2xl text-gray-700">Location</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="text-gray-400">Destination:</span>
                <span className="text-2xl text-gray-700">Location</span>
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
                    e.key == 'Enter' && setSearched(e.target.value)
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
                      (region.name.toUpperCase() == searched.toUpperCase() ||
                        (searched == '' &&
                          index >= tableIndex * 3 - 2 &&
                          index <= tableIndex * 3)) && (
                        <TableRow key={region.code}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>{' '}
                          {/* Should this be a button instead? */}
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
