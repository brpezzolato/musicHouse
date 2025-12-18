"use client";

import { useEffect, useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  ChartContainer, ChartLegend, ChartLegendContent,
  ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

const chartConfig = {
  total: { label: "Faturamento", color: "#FFFFFF" }
};

export function FaturamentoConsolidado() {
  const [timeRange, setTimeRange] = useState("daily");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:8080/dashboardMatriz/faturamento-consolidado");
      const json = await res.json();
      const selected =
        timeRange === "daily" ? json.daily :
        timeRange === "monthly" ? json.monthly : json.annual;

      const formatted = selected.map(item => ({
        ...item,
        total: Number(item.total),
        label:
          item.data
            ? new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
            : item.mes
      }));

      setData(formatted);
    }

    load();
  }, [timeRange]);

  return (
    <Card className="pt-0 bg-[#003049] text-white shadow-lg rounded-lg">
      <CardHeader className="flex justify-between items-center border-b py-5">
        <div>
          <CardTitle className="text-2xl">Faturamento Consolidado</CardTitle>
          <CardDescription className="text-white/70">Total por período</CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px] bg-white text-black rounded-lg">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">7 dias</SelectItem>
            <SelectItem value="monthly">30 dias</SelectItem>
            <SelectItem value="annual">12 meses</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="pt-6">
        <ChartContainer config={chartConfig} className="w-full h-[300px] [&_text]:!fill-white">
       
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fatFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="white" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="white" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="white" strokeOpacity={0.1} />

              <XAxis
                dataKey="label"
                tick={{ fill: "white" }}
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <Area
                dataKey="total"
                type="monotone"
                fill="url(#fatFill)"
                stroke="white"
                strokeWidth={2}
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
     
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
