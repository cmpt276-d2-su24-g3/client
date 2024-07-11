import { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Check } from 'lucide-react'
  
export function RegionInput(regions) {
    const [area_selected, setAreaSelected] = useState("Select an area")
    const [area, setArea] = useState([])

    function handleSetArea(area_regions, area_name) {
        setAreaSelected(area_name)
        setArea(area_regions.map(region =>
            <div key={region.code}>
                <Checkbox/> {region.name} ({region.code})<br></br>ping
            </div>))
    }
    
    return (
        <div>
            <div>AWS Regions</div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>{area_selected}</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSetArea("US West")}>US West</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetArea("US East")}>US East</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetArea("Canada")}>Canada</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetArea("South America")}>South America</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetArea([{ code: "eu-central-1", area: "Europe", name: "Frankfurt"},
                                                                        { code: "eu-west-1", area: "Europe", name: "Ireland"},
                                                                        { code: "eu-west-2", area: "Europe", name: "London"}],
                                                                        "Europe")}>Europe</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetArea([{ code: "ap-southeast-1", area: "Asia Pacific", name: "Singapore"},
                                                                        { code: "ap-southeast-2", area: "Asia Pacific", name: "Sydney"},
                                                                        { code: "ap-northeast-1", area: "Asia Pacific", name: "Tokyo"}],
                                                                        "Asia Pacific")}>Asia Pacific</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetArea("Africa")}>Africa</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetArea("Middle East")}>Middle East</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetArea("Israel")}>Israel</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                {area}
            </div>
        </div>
    )
}