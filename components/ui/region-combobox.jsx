import { useEffect, useState } from 'react'
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
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function RegionCombobox({ regions, setRegion, disabled, hidden }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    setRegion(regions.find((region) => region.value === value)?.code ?? null)
  }, [regions, setRegion, value])

  regions = regions.map((region) => ({
    value: (region.name + ' ' + region.code + ' ' + region.area).toLowerCase(),
    label: region.name,
    code: region.code,
    area: region.area,
  }))

  const groupedRegions = Object.entries(
    Object.groupBy(regions, (region) => region.area),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={'w-[200px] justify-between' + (hidden ? ' hidden' : '')}
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
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            {groupedRegions.map(([area, regions]) => (
              <CommandGroup key={area} heading={area.toUpperCase()}>
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
                    {region.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
RegionCombobox.propTypes = {
  regions: PropTypes.array.isRequired,
  setRegion: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
}
