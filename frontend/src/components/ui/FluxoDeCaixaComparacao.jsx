"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";

const chartConfig = {
  entradas: { label: "Entradas", color: "#FFFFFF" },
  saidas: { label: "Saídas", color: "#D3D3D3" }
};

export function FluxoDeCaixaComparacao() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:8080/dashboardMatriz/fluxo-caixa");
      const json = await res.json();

      const meses = new Set([
        ...json.entradas.map(e => e.mes),
        ...json.saidas.map(s => s.mes)
      ]);

      const merged = [...meses].map(mes => {
        const ent = json.entradas.find(e => e.mes === mes);
        const sai = json.saidas.find(s => s.mes === mes);

        return {
          mes,
          entradas: ent ? Number(ent.entradas) : 0,
          saidas: sai ? Number(sai.saidas) : 0
        };
      });

      setData(merged);
    }

    load();
  }, []);

  return (
    <Card className="bg-[#003049] text-white rounded-lg">
      <CardHeader>
        <CardTitle className="text-white">Entradas x Saídas</CardTitle>
        <CardDescription className="text-white">
          Evolução do Fluxo de Caixa — Matriz
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[260px] text-white">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="#FFFFFF30" />

              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "white", fontSize: 13 }}
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <Line dataKey="entradas" stroke="white" strokeWidth={3} dot={false} />
              <Line dataKey="saidas" stroke="#D3D3D3" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
