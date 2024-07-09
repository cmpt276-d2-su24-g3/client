import * as React from 'react'
import PropTypes from 'prop-types'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function RegionCombobox({ regions, disabled }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  regions = regions.map((region) => ({
    value: (region.name + ' ' + region.code).toLowerCase(),
    label: region.name,
  }))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          {value
            ? regions.find((region) => region.value === value)?.label
            : 'Select region...'}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search region..." />
          <CommandEmpty>No region found.</CommandEmpty>
          <CommandGroup>
            {regions.map((region) => (
              <CommandItem
                key={region.value}
                value={region.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === region.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {region.label ?? 'test'}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
RegionCombobox.propTypes = {
  regions: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
}
