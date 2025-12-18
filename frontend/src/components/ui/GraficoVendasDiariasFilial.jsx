"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GraficoVendasDiariasFilial() {
  const [timeRange, setTimeRange] = React.useState("daily");
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    async function load() {
      const res = await fetch(
        `http://localhost:8080/dashboardFilial/faturamento-consolidado`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      const json = await res.json();

      const selected =
        timeRange === "daily"
          ? json.daily
          : timeRange === "monthly"
          ? json.monthly
          : json.annual;

      const formatted = selected.map((item) => ({
        date: item.data ? item.data : item.mes,
        total: Number(item.total),
      }));

      setData(formatted);
    }

    load();
  }, [timeRange]);

  const noData = data.length === 0;

  return (
    <Card className="pt-0 bg-zinc-900 text-white">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="mt-1">Faturamento Consolidado</CardTitle>
          <CardDescription className="text-zinc-400">
            Exibição do total de vendas para o período selecionado.
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex bg-white text-black"
            aria-label="Período"
          >
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem
              value="daily"
              className="rounded-lg data-[highlighted]:bg-[#003049] data-[highlighted]:text-white"
            >
              7 dias
            </SelectItem>
            <SelectItem
              value="monthly"
              className="rounded-lg data-[highlighted]:bg-[#003049] data-[highlighted]:text-white"
            >
              30 dias
            </SelectItem>
            <SelectItem
              value="annual"
              className="rounded-lg data-[highlighted]:bg-[#003049] data-[highlighted]:text-white"
            >
              12 meses
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">

        {/* 🔥 SE NÃO HOUVER DADOS → MOSTRAR AVISO */}
        {noData ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-zinc-400">
            <AlertCircle className="w-10 h-10 text-zinc-500 mb-2" />
            <p className="text-lg font-medium">Nenhum dado disponível</p>
            <p className="text-sm text-zinc-500">
              Não há registros para o período selecionado.
            </p>
          </div>
        ) : (
          // 🔥 SE HÁ DADOS → MOSTRAR GRÁFICO NORMAL
          <ChartContainer
            className="aspect-auto h-[250px] w-full"
            config={{
              total: { label: "Faturamento", color: "#6C6C6C" },
            }}
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C6C6C" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6C6C6C" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#444444" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  if (!value.includes("-")) return value;
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  });
                }}
                tick={{ fill: "#FFFFFF" }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      if (!value.includes("-")) return value;
                      return new Date(value).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                stroke="#6C6C6C"
                strokeWidth={2}
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
