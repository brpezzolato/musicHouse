"use client";

import { useEffect, useState } from "react";
import { TrendingUp, PackageX } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import "./graficos.css";

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

export const description = "A bar chart showing sales for the last 7 days";

export function GraficoFaturamentodaSemanaFilial() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para pegar os dados da API
  const fetchFaturamentoUltimos7Dias = async () => {
    try {
      const response = await fetch("http://localhost:8080/dashboardFilial/faturamento/ultimos-7-dias", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        const formattedData = data.map((item) => ({
          date: item.dia_semana,
          sales: item.faturamento,
        }));

        setChartData(formattedData);
      } else {
        setError("Erro ao carregar os dados");
      }
    } catch (error) {
      setError("Erro ao buscar dados da API");
      console.error("Erro ao buscar faturamento:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaturamentoUltimos7Dias();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Carregando...</div>;
  }


  if (chartData.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center py-10 text-zinc-400">
        <PackageX className="w-12 h-12 mb-3 text-zinc-600" />
        <p className="text-lg font-medium">Nenhum dado semanal encontrado.</p>
        <p className="text-sm text-zinc-500 mt-1">
          Não foram registrados valores de faturamento nos últimos 7 dias.
        </p>
      </div>


    );
  }

  const chartConfig = {
    sales: {
      label: "R$",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className="bg-black text-white">
      <CardHeader>
        <CardTitle>Faturamento da Semana</CardTitle>
        <CardDescription className="text-gray-600">
          Vendas dos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="#444444" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="sales" fill="#f5f5f5" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
