import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"  
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
  
export function RegionInput(regions) {
    const [area_selected, setAreaSelected] = useState("Select an area")
    const [regions_in_area, setRegionsInArea] = useState([])
    const [regions_checked, setRegionsChecked] = useState({})

    function handleSetArea(_regions_in_area, area_name) {
        setAreaSelected(area_name)
        setRegionsInArea(_regions_in_area)
        setRegionsChecked({})
    }

    return (
        <Card>
            <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <CardTitle>AWS Regions</CardTitle>
                        <CardDescription>Select regions to view on world map</CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{area_selected}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleSetArea("US West")}>US West</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetArea("US East")}>US East</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetArea("Canada")}>Canada</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetArea("South America")}>South America</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetArea([{ code: "eu-central-1", area: "Europe", name: "Frankfurt"},
                                                                            { code: "eu-west-1", area: "Europe", name: "Ireland"},
                                                                            { code: "eu-west-2", area: "Europe", name: "London"}],
                                                                            "Europe")}>Europe</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetArea([{ code: "ap-east-1", area: "Asia Pacific", name: "Hong Kong"},
                                                                            { code: "ap-south-2", area: "Asia Pacific", name: "Hyderabad"},
                                                                            { code: "ap-southeast-3", area: "Asia Pacific", name: "Jakarta"},
                                                                            { code: "ap-southeast-4", area: "Asia Pacific", name: "Melbourne"},
                                                                            { code: "ap-south-1", area: "Asia Pacific", name: "Mumbai"},
                                                                            { code: "ap-northeast-3", area: "Asia Pacific", name: "Osaka"},
                                                                            { code: "ap-northeast-2", area: "Asia Pacific", name: "Seoul"},
                                                                            { code: "ap-southeast-1", area: "Asia Pacific", name: "Singapore"},
                                                                            { code: "ap-southeast-2", area: "Asia Pacific", name: "Sydney"},
                                                                            { code: "ap-northeast-1", area: "Asia Pacific", name: "Tokyo"},],
                                                                            "Asia Pacific")}>Asia Pacific</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetArea("Africa")}>Africa</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetArea("Middle East")}>Middle East</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetArea("Israel")}>Israel</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px"}}>
                    {regions_in_area.map(region => (
                        <div key={region.code} style={{ whiteSpace: "nowrap", fontSize: "0.9rem", opacity: "0.6" }}>
                            <Checkbox
                                checked={regions_checked[region.code]}
                                onClick={() => setRegionsChecked(current_checked_regions => ({
                                    ...current_checked_regions,
                                    [region.code]: !current_checked_regions[region.code]
                                }))}
                            />&nbsp;{region.name} 100ms
                            {/* {regions_checked[region.code] && <div>Isoline</div>} */}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}