import { useState } from 'react'
import PropTypes from 'prop-types'
import { columns } from './columns'
import { DataTable } from './data-table'
import { useEffect } from 'react'

export default function LatencyTable({ regions, latencies }) {
  const [data, setData] = useState([])
  useEffect(() => {
    if (regions.length === 0 || latencies.length === 0) return

    setData(
      latencies
        .filter(
          (latency) =>
            regions.find((region) => region.code === latency.region)?.selected,
        )
        .map((latency) => ({
          regionName: regions.find((region) => region.code === latency.region)
            ?.name,
          latency: latency.latency,
        })),
    )
  }, [regions, latencies])

  return <DataTable columns={columns} data={data} />
}
LatencyTable.propTypes = {
  regions: PropTypes.array.isRequired,
  latencies: PropTypes.array.isRequired,
}
