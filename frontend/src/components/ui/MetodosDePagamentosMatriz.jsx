"use client";

import { Pie, PieChart, Cell } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
  valor: { label: "Valor" },

  Pix: { label: "Pix", color: "#F8FAFC" },
  Crédito: { label: "Crédito", color: "#CBD5E1" },
  Débito: { label: "Débito", color: "#94A3B8" },
};

export function MetodosDePagamentosMatriz({ metodoPgto }) {
  return (
    <Card className="flex flex-col bg-[#003049] border-none text-white">
      <CardHeader className="items-center">
        <CardTitle className="text-white p-0 m-0 text-lg">Formas de Pagamento</CardTitle>
        <CardDescription className="text-gray-200">
          Metodos de pagamentos mais usados
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pt-0 mt-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Pie
              data={metodoPgto}
              dataKey="valor"
              nameKey="tipo"
              stroke="0"
              innerRadius={0}       // 🔥 tira o buraco
              outerRadius={110}  
            >
              {metodoPgto.map((entry, index) => (
                <Cell key={index} fill={chartConfig[entry.tipo].color} />
              ))}
            </Pie>

            <ChartLegend
              content={<ChartLegendContent nameKey="tipo" />}
              className="-translate-y-1 flex-wrap gap-2 *:basis-1/4 *:justify-center text-white"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
