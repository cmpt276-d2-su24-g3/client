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
import regions from "./regions.json" 

export function RegionInput(regions_json) {
    const [area_selected, setAreaSelected] = useState("Select an area")
    const [regions_checked, setRegionsChecked] = useState({})

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
                            {[...new Set(regions.map(region => region.area))].map(area =>
                                <DropdownMenuItem onClick={() => {
                                    setAreaSelected(area)
                                    setRegionsChecked({})
                                }} key={area}>{area}</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px"}}>
                    {regions.map(region => (
                        region.area == area_selected &&
                        <div key={region.code} style={{ whiteSpace: "nowrap", fontSize: "0.9rem", opacity: "0.6" }}>
                            <Checkbox
                                checked={regions_checked[region.code]}
                                onClick={() => setRegionsChecked(current_regions_checked => ({
                                    ...current_regions_checked,
                                    [region.code]: !current_regions_checked[region.code]
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