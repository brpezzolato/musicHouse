"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  vendas: {
    label: "Vendas",
    color: "#FFFFFF",
  },
};

export function ProdutosMaisVendidos({ rankProdutos }) {
  return (
    <Card className="bg-[#003049] border-none text-white">
      <CardHeader>
        <CardTitle className="text-white">Produtos Mais Vendidos (Sku)</CardTitle>
        <CardDescription className="text-white/70">
          Top 5 - Consolidado Geral
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[240px] [&_text]:!fill-white [&_text]:!text-white"
        >
          <BarChart accessibilityLayer data={rankProdutos}>
            <CartesianGrid vertical={false} stroke="#ffffff22" />

            <XAxis
              dataKey="produto"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 12 }}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar
              dataKey="vendas"
              fill="#FFFFFF"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
