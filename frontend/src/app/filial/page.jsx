"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Wallet, Users, Boxes, PackageX, QrCode } from "lucide-react";
import { GraficoFaturamentodaSemanaFilial } from "@/components/ui/GraficoFaturamentodaSemanaFilial.jsx";
import { GraficoVendasDiariasFilial } from "@/components/ui/GraficoVendasDiariasFilial";
import InstrumentosMaisVendidos from '@/components/DashboardFilial/InstrumentosMaisVendidos'

export default function Dashboard() {
  const [lucroDia, setLucroDia] = useState(0);
  const [caixasAbertos, setCaixasAbertos] = useState(0);
  const [funcionariosAtivos, setFuncionariosAtivos] = useState(0);
  const [produtosEstoque, setProdutosEstoque] = useState(0);
  const [date, setDate] = useState(new Date());
  const [funcionarioDestaque, setFuncionarioDestaque] = useState(null);
  // ESTADO: Armazenar as últimas movimentações
  const [ultimasMovimentacoes, setUltimasMovimentacoes] = useState([]);

  // --- Funções de Fetch Existentes (Omitidas para brevidade, mas elas permanecem no seu código) ---

  // Fetch para lucro diário
  useEffect(() => {
    async function fetchLucro() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardFilial/vendasDiarias", {
          cache: 'no-store',
          credentials: 'include',
        }
        );
        const data = await res.json();
        const lucro = Number(data.totalLucro ?? 0);
        setLucroDia(lucro);
      } catch (err) {
        console.error("Erro ao buscar lucro diário:", err);
      }
    }

    fetchLucro();
  }, []);

  // Fetch para funcionários ativos
  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardFilial/funcionariosAtivos", {
          cache: 'no-store',
          credentials: 'include',
        }
        );
        const data = await res.json();
        if (data.funcionarios_ativos !== undefined) {
          setFuncionariosAtivos(data.funcionarios_ativos);
        } else if (
          Array.isArray(data) &&
          data[0]?.funcionarios_ativos !== undefined
        ) {
          setFuncionariosAtivos(data[0].funcionarios_ativos);
        }
      } catch (err) {
        console.error("Erro ao buscar funcionários ativos:", err);
      }
    }

    fetchFuncionarios();
  }, []);

  // Fetch para produtos em estoque
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardFilial/produtosEstoque", {
          cache: 'no-store',
          credentials: 'include',
        }
        );
        const data = await res.json();
        if (data.produtosEstoque !== undefined) {
          setProdutosEstoque(data.produtosEstoque);
        } else if (
          Array.isArray(data) &&
          data[0]?.produtosEstoque !== undefined
        ) {
          setProdutosEstoque(data[0].produtosEstoque);
        }
      } catch (err) {
        console.error("Erro ao buscar produtos no estoque:", err);
      }
    }

    fetchProdutos();
  }, []);

  // Fetch para funcionário do mês
  useEffect(() => {
    async function fetchFuncionarioDestaque() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardFilial/funcionarioDestaque", {
          cache: 'no-store',
          credentials: 'include',
        }
        );
        const data = await res.json();
        setFuncionarioDestaque(data);
      } catch (err) {
        console.error("Erro ao buscar funcionário do mês:", err);
      }
    }

    fetchFuncionarioDestaque();
  }, []);

  // Fetch para caixas abertos
  useEffect(() => {
    async function fetchCaixas() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardFilial/caixasAbertos", {
          cache: 'no-store',
          credentials: 'include',
        }
        );
        const data = await res.json();
        setCaixasAbertos(Number(data.caixas_abertos ?? 0));
      } catch (err) {
        console.error("Erro ao buscar caixas abertos:", err);
      }
    }

    fetchCaixas();
  }, []);


  useEffect(() => {
    async function fetchMovimentacoesEstoque() {
      try {
        const res = await fetch(
          "http://localhost:8080/dashboardFilial/movimentacoesEstoque",
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const data = await res.json();

  
        const movimentacoes = Array.isArray(data) ? data : [];

        
        const sortedData = movimentacoes.sort(
          (a, b) => new Date(b.data) - new Date(a.data)
        );

        setUltimasMovimentacoes(sortedData);
      } catch (err) {
        console.error("Erro ao buscar movimentações de estoque:", err);
        setUltimasMovimentacoes([]);
      }
    }

    fetchMovimentacoesEstoque();
  }, []);


  const formatarData = (dataString) => {
    // A API retorna a data no formato ISO (com 'Z'), o que o new Date() interpreta corretamente.
    const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };


  return (
    <div className="min-h-screen text-gray-900 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-black text-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center text-center">
          <TrendingUp className="w-8 h-8 text-white mb-3" />
          <p className="opacity-80 text-white text-sm mb-1">
            Lucro total do dia
          </p>
          <h2 className="text-3xl text-white font-bold">
            R$ {lucroDia.toLocaleString('pt-BR')}
          </h2>
        </div>

        <div className="bg-black rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center text-center">
          <Wallet className="w-8 h-8 text-white mb-3" />
          <p className="text-white text-sm mb-1">Caixas abertos</p>
          <h2 className="text-3xl text-white font-bold">{caixasAbertos}</h2>
        </div>

        <div className="bg-black rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center text-center">
          <Boxes className="w-8 h-8 text-white mb-3" />
          <p className="text-white text-sm mb-1">Produtos no estoque</p>
          <h2 className="text-3xl text-white font-bold">{produtosEstoque}</h2>
        </div>

        <div className="bg-black text-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center text-center">
          <Users className="w-8 h-8 text-white mb-3" />
          <p className="text-white text-sm mb-1">Funcionários Ativos</p>
          <h2 className="text-3xl text-white font-bold">
            {funcionariosAtivos}
          </h2>
        </div>
      </div>

      <GraficoVendasDiariasFilial />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        <GraficoFaturamentodaSemanaFilial />
        <InstrumentosMaisVendidos />
      </div>


      <div className="border-2 border-zinc-800 bg-zinc-900 rounded-xl p-8 shadow-md mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-lg">Últimas 5 Movimentações no Estoque</h2>
          <QrCode className="w-6 h-6 text-white" />
        </div>


        <div className="grid grid-cols-5 text-zinc-400 text-xs font-semibold uppercase mb-2 border-b border-zinc-700 pb-1">
          <span className="col-span-2">Produto</span>
          <span className="text-center">Tipo</span>
          <span className="text-center">Qtd.</span>
          <span className="text-right">Data/Hora</span>
        </div>

        {/* LISTA DE MOVIMENTAÇÕES */}
        {ultimasMovimentacoes.slice(0, 5).map((mov, index) => {
          // O tipo vem em minúsculas (ex: "saida"), tratamos para aplicar o estilo
          const tipoUpperCase = mov.tipo.toUpperCase();
          const isEntrada = tipoUpperCase === 'ENTRADA';
          const bgColor = isEntrada ? 'bg-green-900/20' : 'bg-red-900/20';
          const borderColor = isEntrada ? 'border-green-700/40' : 'border-red-700/40';
          const textColor = isEntrada ? 'text-green-400' : 'text-red-400';
          const quantityColor = isEntrada ? 'text-green-300' : 'text-red-300';

          return (
            <div
              key={mov.id_movimentacao} // Usamos o ID único como key
              className={`grid grid-cols-5 items-center ${bgColor} border ${borderColor} p-4 rounded-lg mb-2`}
            >
              {/* Produto */}
              <span className="col-span-2 text-white font-medium text-sm truncate pr-2">
                {mov.produto}
              </span>

              {/* Tipo */}
              <span className={`text-center font-semibold text-xs ${textColor}`}>
                {tipoUpperCase}
              </span>

              {/* Quantidade */}
              <span className={`text-center font-bold text-base ${quantityColor}`}>
                {mov.quantidade}
              </span>

              {/* Data/Hora */}
              <span className="text-right text-zinc-400 text-xs">
                {formatarData(mov.data)}
              </span>
            </div>
          );
        })}

        {ultimasMovimentacoes.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-10 text-zinc-400">
            <PackageX className="w-12 h-12 mb-3 text-zinc-600" />
            <p className="text-lg font-medium">Nenhuma movimentação recente encontrada.</p>
            <p className="text-sm text-zinc-500 mt-1">
              Não há entradas ou saídas registradas no momento.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}