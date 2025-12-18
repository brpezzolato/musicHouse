"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

export const description = "Estoque Crítico - Gráfico Horizontal de Barras";

// Dados simulados para os 5 itens mais críticos em estoque
const chartData = [
  { product: "Guitar", stock: 5 },        // Estoque crítico
  { product: "Piano", stock: 7 },         // Estoque baixo
  { product: "Drum Kit", stock: 2 },      // Estoque crítico
  { product: "Violin", stock: 3 },        // Estoque baixo
  { product: "Saxophone", stock: 6 },     // Estoque baixo
];

const chartConfig = {
  stock: {
    label: "Estoque",
    color: "white",
  },
};

// ---- TICK CUSTOMIZADO PARA TEXTO BRANCO ----
function CustomYAxisTick(props) {
  const { x, y, payload } = props;
  return (
    <text
      x={x - 10}
      y={y + 5}
      className="text-white"
      fill="#ffffff"
      fontSize={14}
      textAnchor="end"
    >
      {String(payload.value).slice(0, 10)} {/* Exibe o nome do item */}
    </text>
  );
}

export function GraficoBaixoEstoqueFilial() {
  return (

  <Card className="bg-black text-white">
    <CardContent className="text-white -mt-3">
        <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Baixo Estoque</h3>
          </div>
      <ChartContainer className="text-white" config={chartConfig}>
        <BarChart
          data={chartData}
          layout="vertical"
          className="text-white"
          margin={{
            left: 20,
            right: 20,
            top: 1,
          }}
        >
          {/* Eixo X (estoque) */}
          <XAxis className="text-white" type="number" dataKey="stock" hide />

          {/* Eixo Y (nomes dos itens) */}
          <YAxis
            className="text-white"
            dataKey="product"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={CustomYAxisTick}
          />

          {/* Tooltip */}
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          {/* Barras */}
          <Bar dataKey="stock" fill="white" />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
  );
}
