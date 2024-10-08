import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export const columns = [
  
  {
    accessorKey: 'regionName',
    header: 'Region',
  },
  
  {
    accessorKey: 'latency',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="float-right text-customPurple"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Latency
          <ArrowUpDown className="w-4 h-4 ml-2 -mr-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const latency = row.getValue('latency')

      if (latency === Infinity)
        return <div className="font-medium text-customPurple text-right">-</div>

      const formatted =
        latency.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + ' ms'

      return <div className="font-medium text-right text-gray-700">{formatted}</div>
    },
  },
]
