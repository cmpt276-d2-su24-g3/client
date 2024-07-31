"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  latency: {
    label: "Latency",
    color: "hsl(var(--chart-1))",
  },
}

export function Component({ pings, startingLocation, start, destination }) {
  return (
    <Card>
      <CardHeader>
        
          <div className="text-2xl font-semibold text-customPurple pl-1">
          Latency
          </div>
         
        <div className="text-sm font-normal text-customMauve pl-1">
          {startingLocation + " to " + destination}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={pings}
            margin={{
              left: -25,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="latency"
              type="linear"
              fill="hsl(39, 100%, 50%)"
              fillOpacity={0.6}
              stroke="hsl(30, 100%, 65%)"
              strokeWidth="3"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}