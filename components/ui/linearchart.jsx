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
const chartData = [
  { time: "9:30 am", latency: 95 },
  { time: "10:00 am", latency: 110 },
  { time: "10:30 am", latency: 100 },
  { time: "11:00 am", latency: 120 },
  { time: "11:30 am", latency: 115 },
  { time: "12:00 pm", latency: 100 },
  { time: "12:30 pm", latency: 90 },
  { time: "1:00 pm", latency: 95 },
]

const chartConfig = {
  latency: {
    label: "Latency",
    color: "hsl(var(--chart-1))",
  },
}

export function Component() {
  return (
    <div>
      <CardHeader>
        <CardTitle>Latency</CardTitle>
        <CardDescription>
          Tokyo (ap-northeast-1)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,  
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
              fill="hsl(24, 100%, 50%)"
              fillOpacity={0.4}
              stroke="hsl(24, 100%, 50%)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
