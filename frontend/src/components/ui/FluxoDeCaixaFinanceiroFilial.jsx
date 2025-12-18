// "use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive line chart for Fluxo de Caixa Diário"

const chartData = [
  { date: "2024-06-01", entradas: 1000, saidas: 300 },
  { date: "2024-06-02", entradas: 1200, saidas: 500 },
  { date: "2024-06-03", entradas: 1500, saidas: 400 },
  { date: "2024-06-04", entradas: 800, saidas: 200 },
  { date: "2024-06-05", entradas: 1300, saidas: 600 },
  { date: "2024-06-06", entradas: 1600, saidas: 500 },
  { date: "2024-06-07", entradas: 1100, saidas: 700 },
  { date: "2024-06-08", entradas: 1400, saidas: 300 },
  { date: "2024-06-09", entradas: 900, saidas: 600 },
  { date: "2024-06-10", entradas: 1300, saidas: 400 },
]

const chartConfig = {
  entradas: {
    label: "Entradas",
    color: "var(--chart-1)",
  },
  saidas: {
    label: "Saídas",
    color: "var(--chart-2)",
  },
}

export function FluxoDeCaixaFinanceiroFilial() {
  const [activeChart, setActiveChart] = React.useState("entradas")

  const total = React.useMemo(
    () => ({
      entradas: chartData.reduce((acc, curr) => acc + curr.entradas, 0),
      saidas: chartData.reduce((acc, curr) => acc + curr.saidas, 0),
    }),
    []
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Fluxo de Caixa Diário</CardTitle>
          <CardDescription>
            Comparação entre entradas e saídas por dia
          </CardDescription>
        </div>
        <div className="flex">
          {["entradas", "saidas"].map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
