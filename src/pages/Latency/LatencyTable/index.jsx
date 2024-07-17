import { useState } from 'react'
import PropTypes from 'prop-types'
import { columns } from './columns'
import { DataTable } from './data-table'
import { useEffect } from 'react'

export default function LatencyTable({ regions }) {
  const [data, setData] = useState([])
  useEffect(() => {
    console.log('regions', regions)
    setData(
      regions?.map((region) => ({
        regionName: region.name,
        latency: region.latency ?? Math.random() * 100,
      })),
    )
  }, [regions])

  return <DataTable columns={columns} data={data} />
}
LatencyTable.propTypes = {
  regions: PropTypes.array.isRequired,
}
