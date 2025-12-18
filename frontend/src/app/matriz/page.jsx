"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Wallet, Users, Boxes, CreditCard, Store, DollarSign, Package, AlertTriangle, MapPin, Clock } from "lucide-react";
import { FaturamentoConsolidado } from "@/components/ui/FaturamentoConsolidado";
import { RankFiliais } from "@/components/ui/RankFiliais";
import { ProdutosMaisVendidos } from "@/components/ui/ProdutosMaisVendidos";
import { FluxoDeCaixaComparacao } from "@/components/ui/FluxoDeCaixaComparacao";
import { MetodosDePagamentosMatriz } from "@/components/ui/MetodosDePagamentosMatriz";
import GraficoCrescimentoMatriz from "@/components/ui/GraficoCrescimentoMatriz";
import { Spinner } from "@/components/ui/spinner"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [faturamentoMensal, setFaturamentoMensal] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [rankFilial, setRankFilial] = useState([])
  const [metodoPgto, setMetodoPgto] = useState([])
  const [rankProdutos, setRankProdutos] = useState([])
  const [pedidosEstoque, setPedidosEstoque] = useState(0)
  const [estoqueMatriz, setEstoqueMatriz] = useState(0);
  const [funcionariosAtivos, setFuncionariosAtivos] = useState(0);
  const [filiaisAtivas, setFiliaisAtivas] = useState(0);


  useEffect(() => {
    async function fetchLucro() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/faturamentoGlobal"
        );
        const data = await res.json();
        setFaturamentoMensal(Number(data));
      } catch (err) {
        console.error("Erro ao buscar faturamento mensal:", err);
      }
    }

    fetchLucro();
  }, []);

  // Fetch para funcionários ativos
  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/funcionariosGlobal"
        );
        const data = await res.json();

        if (res.ok) {
          setFuncionariosAtivos(data.FuncionariosGlobal);
        } else {
          console.log('Erro ao resgatar todos os funcionarios ativos')
        }

      } catch (err) {
        console.error("Erro ao buscar funcionários ativos:", err);
      }
    }

    fetchFuncionarios();
  }, []);

  // Fetch para as despesas em aberto
  useEffect(() => {
    async function fetchDespesas() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/despesasGlobal"
        );
        const data = await res.json();

        if (res.ok) {
          setDespesas(data);
        } else {
          console.log('Erro ao pegar todas as despesas')
        }

      } catch (err) {
        console.error('Erro ao pegar todas as despesas', err);
      }
    }

    fetchDespesas();
  }, []);

  // Fetch para rank Filial
  useEffect(() => {
    async function fetchRank() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/rankGlobal"
        );
        const data = await res.json();
        if (res.ok) {
          setRankFilial(data)
        } else {
          console.log("Erro ao buscar rank das filiais");
        }
      } catch (err) {
        console.error("Erro ao buscar rank das filiais:", err);
      }
    }

    fetchRank();
  }, []);

  // Fetch para pedidos de estoque
  useEffect(() => {
    async function fetchPedidosEstoque() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/pedidosEstoqueGlobal"
        );
        const data = await res.json();
        if (res.ok) {
          setPedidosEstoque(data)
        } else {
          console.log('Erro ao buscar pedidos de estoque')
        }
      } catch (err) {
        console.error("Erro ao buscar pedidos de estoque:", err);
      }
    }

    fetchPedidosEstoque();
  }, []);

  // Fetch para estoque da matriz
  useEffect(() => {
    async function fetchEstoqueMatriz() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/estoqueMatriz"
        );
        const data = await res.json();

        if (res.ok) {
          setEstoqueMatriz(data);
        } else {
          console.log('Erro ao buscar estoque da matriz')
        }
      } catch (err) {
        console.error("Erro ao buscar estoque da matriz:", err);
      }
    }

    fetchEstoqueMatriz();
  }, []);

  // Fetch para filiais ativas
  useEffect(() => {
    async function fetchFiliaisAtivas() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/filiaisAtivas"
        );
        const data = await res.json();

        if (res.ok) {
          setFiliaisAtivas(data);
        } else {
          console.log('Erro ao buscar filiais ativas')
        }
      } catch (err) {
        console.error("Erro ao buscar filiais ativas:", err);
      }
    }

    fetchFiliaisAtivas();
  }, []);

  // Fetch para filiais ativas
  useEffect(() => {
    async function fetchDataMetodoPgto() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/metodosGlobal"
        );
        const data = await res.json();

        if (res.ok) {
          setMetodoPgto(data);
        } else {
          console.log('Erro ao buscar metodos pgto')
        }
      } catch (err) {
        console.error("Erro ao buscar metodos pgto:", err);
      }
    }

    fetchDataMetodoPgto();
  }, []);

  // Fetch para rank de produtos
  useEffect(() => {
    async function fetchsRankProdutos() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardMatriz/rankProdutosGlobal"
        );
        const data = await res.json();

        if (res.ok) {
          setRankProdutos(data);
        } else {
          console.log('Erro ao buscar Rank Produtos')
        }
      } catch (err) {
        console.error("Erro ao buscar Rank Produtos:", err);
      }
    }

    fetchsRankProdutos();
  }, []);

  return (
    <div className="min-h-screen text-gray-900 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border">
          <div className="flex items-center space-x-4">
            <Store className="text-3xl text-gray-900" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Funcionários Ativos
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Total de funcionários ativos
              </p>
            </div>
          </div>
          <div className="mt-5 text-2xl font-bold text-gray-900 flex items-center gap-2">{funcionariosAtivos != 0 ? funcionariosAtivos : <Spinner />} Funcionários</div>
        </div>
  
        <div className="bg-[#003049] text-white rounded-xl p-6 shadow-md">
          <div className="flex items-center space-x-4">
            <DollarSign className="text-3xl" />
            <div>
              <h2 className="text-xl font-semibold">Faturamento Mensal</h2>
              <p className="opacity-90 mt-1 text-sm">
                Total de faturamento Bruto.
              </p>
            </div>
          </div>
          <div className="mt-5 text-2xl font-bold flex items-center gap-2">{faturamentoMensal != 0 ?
            faturamentoMensal.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }) : <>R$ <Spinner /></>}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border">
          <div className="flex items-center space-x-4">
            <Wallet className="text-3xl text-gray-900" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Despesas a Pagar
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Despesas que precisam ser pagas</p>
            </div>
          </div>
          <div className="mt-5 text-2xl font-bold text-gray-900 flex items-center gap-2">{despesas != 0 ? despesas : <Spinner />} Despesas</div>
        </div>
      </div>

      <div className="mt-5">
        <FaturamentoConsolidado />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        <div className="">
          <RankFiliais rankFilial={rankFilial || []} />
        </div>
        <div className="">
          <ProdutosMaisVendidos rankProdutos={rankProdutos} />
        </div>
      </div>


      <div className="cards3 pt-5">
        <div className="bg-[#003049] rounded-xl flex space-x-4">
          {/* Card 1 - Pedidos Pendentes */}
          <div className="text-white p-6 rounded-lg flex flex-col justify-between w-1/3">
            <div className="flex items-center space-x-2">
              <Clock className="text-white" /> {/* Ícone para Pedidos Pendentes */}
              <h3 className="text-lg font-semibold">Pedidos Pendentes</h3>
            </div>
            <p className="text-sm text-gray-400">Total de pedidos pendentes para as filiais.</p>
            <div className="text-2xl font-bold mt-4">{pedidosEstoque != 0 ? pedidosEstoque : <Spinner />}</div>
          </div>

          {/* Card 2 - Estoque Total */}
          <div className="text-white p-6 rounded-lg flex flex-col justify-between w-1/3">
            <div className="flex items-center space-x-2">
              <Package className="text-white" /> {/* Ícone para Estoque Total */}
              <h3 className="text-lg font-semibold">Estoque Total</h3>
            </div>
            <p className="text-sm text-gray-400">Total de instrumentos disponíveis no estoque.</p>
            <div className="text-2xl font-bold mt-4">{estoqueMatriz != 0 ? estoqueMatriz : <Spinner />}</div>
          </div>

          {/* Card 3 - Filiais Ativas */}
          <div className="text-white p-6 rounded-lg flex flex-col justify-between w-1/3">
            <div className="flex items-center space-x-2">
              <MapPin className="text-white" /> {/* Ícone para Filiais Ativas */}
              <h3 className="text-lg font-semibold">Filiais Ativas</h3>
            </div>
            <p className="text-sm text-gray-400">Total de filiais operando no momento.</p>
            <div className="text-2xl font-bold mt-4">{filiaisAtivas != 0 ? filiaisAtivas : <Spinner />}</div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        <div className="">
          < FluxoDeCaixaComparacao />
        </div>
        <div className="">
          < MetodosDePagamentosMatriz metodoPgto={metodoPgto} />
        </div>
      </div>

      
      <div className="mt-5">
        <GraficoCrescimentoMatriz />
      </div>
    </div>
  );
}
