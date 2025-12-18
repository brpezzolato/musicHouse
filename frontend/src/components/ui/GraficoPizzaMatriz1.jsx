"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function GraficoPizzaMatriz1() {
  const data = [
    { name: "Debito", value: 63, color: "gray" },
    { name: "PIX", value: 25, color: "#3a3a3a" },
    { name: "Crédito", value: 12, color: "#1a1a1a" },
  ];

  return (
    <Card className="bg-white text-black w-[460px] rounded-2xl p-5 flex flex-col">
      
      {/* TÍTULO */}
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-base font-semibold">Pagamentos mais usados</CardTitle>
        <CardDescription className="text-xs text-gray-400">
          Durante os ultimos 3 meses.
        </CardDescription>
      </CardHeader>

      {/* GRÁFICO — PIZZA */}
      <CardContent className="flex justify-center items-center h-30 mb-4">
        <PieChart width={200} height={200}>
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]} 
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "12px",
              padding: "6px 10px",
            }}
          />

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={75}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </CardContent>

      {/* LEGENDA */}
      <div className="flex justify-center gap-6 mt-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-sm text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>

    </Card>
  );
}
