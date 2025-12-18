"use client";

import { useEffect, useState, useMemo } from "react";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TabelaVendas() {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // 🔥 NOVO FILTRO POR ID
  const [idBusca, setIdBusca] = useState("");

  useEffect(() => {
    async function fetchVendas() {
      try {
        const res = await fetch("http://localhost:8080/vendas", {
          cache: "no-store",
          credentials: "include",
        });

        const data = await res.json();
        setVendas(data);
      } catch (error) {
        console.error("Erro ao carregar vendas:", error);
      } finally {
        setCarregando(false);
      }
    }

    fetchVendas();
  }, []);

  // Quando mudar os filtros → volta pra página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [dataInicio, dataFim, idBusca]);

  // 🔎 FILTRAGEM COMPLETA
  const vendasFiltradas = useMemo(() => {
    return vendas.filter((v) => {
      const dataVenda = new Date(v.data_venda);

      // FILTRO POR ID
      if (idBusca.trim() !== "") {
        if (!v.id_venda.toString().includes(idBusca.trim())) return false;
      }

      // FILTRO POR DATA INICIAL
      if (dataInicio) {
        const inicio = new Date(dataInicio + "T00:00:00");
        if (dataVenda < inicio) return false;
      }

      // FILTRO POR DATA FINAL
      if (dataFim) {
        const fim = new Date(dataFim + "T23:59:59");
        if (dataVenda > fim) return false;
      }

      return true;
    });
  }, [vendas, dataInicio, dataFim, idBusca]);

  const totalPaginas = Math.ceil(vendasFiltradas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const paginaVendas = vendasFiltradas.slice(inicio, inicio + itensPorPagina);

  function formatarDataBR(data) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  return (
    <div className="space-y-4">

      <div>
        <h1 className="text-4xl font-bold text-black">Vendas</h1>
        <h2 className="text-lg text-gray-600 mt-1">
          Visualize todas as vendas realizadas nessa franquia.
        </h2>
      </div>

      {/* 🔎 FILTROS */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 text-white">

        {/* FILTRO ID */}
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar por ID</label>
          <input
            type="number"
            value={idBusca}
            onChange={(e) => setIdBusca(e.target.value)}
            placeholder="Ex: 1024"
            className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
          />
        </div>

        {/* DATA INICIAL */}
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Data Inicial</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
          />
        </div>

        {/* DATA FINAL */}
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Data Final</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
          />
        </div>

        {/* LIMPAR */}
        <div className="flex items-end">
          <Button
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
            onClick={() => {
              setDataInicio("");
              setDataFim("");
              setIdBusca("");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 text-white w-full overflow-x-auto">
        <table className="w-full min-w-[900px]">

          <thead className="bg-zinc-800">
            <tr>
              {["ID", "Funcionário", "Pagamento", "Valor", "Status", "Data"].map((label, index) => (
                <th
                  key={label}
                  className={`${index === 0 ? "pl-10" : "p-4"} text-left uppercase text-xs font-bold`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {carregando ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-zinc-800 animate-pulse">
                    <td className="pl-10 py-4">
                      <div className="h-4 w-10 bg-zinc-700/40 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-48 bg-zinc-700/40 rounded mb-2"></div>
                      <div className="h-4 w-32 bg-zinc-700/20 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-6 w-24 bg-zinc-700/40 rounded-full"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-20 bg-zinc-700/40 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-20 bg-zinc-700/40 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-24 bg-zinc-700/40 rounded"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : paginaVendas.length === 0 ? (

              <tr>
                <td colSpan="10">
                  <div className="flex flex-col items-center justify-center h-[40vh] text-center w-full">
                    <PackageX className="w-16 h-16 text-zinc-700 mb-4" />
                    <p className="text-xl text-zinc-300 font-semibold">
                      Nenhuma venda encontrada.
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Ajuste os filtros e tente novamente.
                    </p>
                  </div>
                </td>
              </tr>

            ) : (
              paginaVendas.map((v) => (
                <tr key={v.id_venda} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="pl-10 pr-3 py-3">{v.id_venda}</td>
                  <td className="p-3 font-semibold">{v.funcionario}</td>
                  <td className="p-3">
                    <span className="px-3 py-2 rounded bg-zinc-800 text-xs">{v.pagamento}</span>
                  </td>
                  <td className="p-3 font-bold text-white">
                    R$ {Number(v.valor_total).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-3 font-bold text-zinc-200">{v.status}</td>
                  <td className="p-3 font-bold text-zinc-200">{formatarDataBR(v.data_venda)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex justify-end gap-3 mt-4">
        <Button
          onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
          disabled={paginaAtual === 1}
          className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
        >
          Anterior
        </Button>

        <Button
          onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaAtual === totalPaginas}
          className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
