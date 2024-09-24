"use client"

import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Separator } from '@/components/ui/separator'

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
  const [timeFrame, setTimeFrame] = useState("1 hour")
  
  return (
    <Card>
      <CardHeader>
        <div className="text-2xl font-semibold text-customPurple pl-1 mb-2">
          Latency History
        </div>
        <Separator/>
        <div className='flex justify-evenly p-4'>
          <button onClick={() => setTimeFrame("1 hour")}>
            <span>1 hour</span>
            {timeFrame === "1 hour" && <div className="py-0.5 bg-gray-500"></div>}
          </button>
          <button onClick={() => setTimeFrame("24 hours")}>
            <span>24 hours</span>
            {timeFrame === "24 hours" && <div className="py-0.5 bg-gray-500"></div>}
          </button>
          <button onClick={() => setTimeFrame("7 days")}>
            <span>7 days</span>
            {timeFrame === "7 days" && <div className="py-0.5 bg-gray-500"></div>}
          </button>
          <button onClick={() => setTimeFrame("30 days")}>
            <span>30 days</span>
            {timeFrame === "30 days" && <div className="py-0.5 bg-gray-500"></div>}
          </button>
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