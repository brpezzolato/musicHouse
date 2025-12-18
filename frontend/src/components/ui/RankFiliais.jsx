"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Spinner } from "@/components/ui/spinner"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Ranking das Filiais (Faturamento do Mês)";

const chartConfig = {
  valor: {
    label: "Faturamento R$",
    color: "#FFFFFF",
  },
};

export function RankFiliais({ rankFilial }) {
  return (
    <Card
      className="p-7"
      style={{ backgroundColor: "#003049", color: "white" }}
    >
      <CardHeader>
        <CardTitle className="text-white">
          Ranking das Filiais — Faturamento do Mês
        </CardTitle>
        <CardDescription className="text-gray-200">
          Comparativo entre unidades • mês atual
        </CardDescription>
      </CardHeader>

      <CardContent>
        {rankFilial === [] ? <Spinner /> :
          <ChartContainer
            config={chartConfig}
            className="h-[230px] [&_text]:!fill-white [&_text]:!text-white"
          >
            <BarChart accessibilityLayer data={rankFilial} layout="vertical">
              <XAxis type="number" dataKey="valor" hide />
              <YAxis
                dataKey="filial"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#FFFFFF" }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="text-black"
                  />
                }
              />

              <Bar dataKey="valor" fill="#FFFFFF" radius={5} />
            </BarChart>
          </ChartContainer>}
      </CardContent>
    </Card>
  );
}
