"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";

export default function GraficoCrescimentoMatriz() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:8080/dashboardMatriz/crescimento");
      const json = await res.json();

      const formatted = json.map(item => ({
        value: Number(item.value),
        label: new Date(item.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short"
        })
      }));

      setData(formatted);
      setTotal(formatted.reduce((a, b) => a + b.value, 0));
    }

    load();
  }, []);

  return (
    <Card className="bg-[#002A42] text-white rounded-2xl p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <CardTitle>Indicador de Crescimento</CardTitle>
          <CardDescription className="text-gray-300">
            Evolução diária consolidada
          </CardDescription>
        </div>

        <div className="text-right">
          <p className="text-gray-300 text-sm">Crescimento Total</p>
          <p className="text-4xl font-bold">{total}</p>
        </div>
      </div>

      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="label"
              stroke="#FFF"
              tick={{ fill: "#FFF" }}
              interval={0}
            />

            <YAxis hide />

            <Tooltip
              contentStyle={{
                background: "#003653",
                border: "none",
                borderRadius: "10px"
              }}
              labelStyle={{ color: "#FFF" }}
              itemStyle={{ color: "#FFF" }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="white"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
