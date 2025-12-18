"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PackageX } from "lucide-react";

export default function TabelaVendasFiliais() {
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    const [idBusca, setIdBusca] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");


    useEffect(() => {
        async function buscarVendas() {
            try {
                const res = await fetch("http://localhost:8080/vendas/geral", {
                    cache: "no-store",
                    credentials: "include",
                });

                await new Promise((resolve) => setTimeout(resolve, 1200));
                const data = await res.json();
                setVendas(data || []);
            } catch (error) {
                console.error("Erro ao carregar vendas:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscarVendas();
    }, []);

    useEffect(() => {
        setPaginaAtual(1);
    }, [idBusca, dataInicio, dataFim]);

    const vendasFiltradas = useMemo(() => {
        return vendas.filter((v) => {
            const dataVenda = new Date(v.data_venda);

            if (idBusca.trim() !== "") {
                if (!v.id_venda.toString().includes(idBusca.trim())) return false;
            }
            if (dataInicio) {
                const inicio = new Date(`${dataInicio}T00:00:00`);
                if (dataVenda < inicio) return false;
            }

            if (dataFim) {
                const fim = new Date(`${dataFim}T23:59:59`);
                if (dataVenda > fim) return false;
            }

            return true;
        });
    }, [vendas, idBusca, dataInicio, dataFim]);

    const totalPaginas = Math.ceil(vendasFiltradas.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;

    const vendasPagina = useMemo(() => {
        return vendasFiltradas.slice(inicio, inicio + itensPorPagina);
    }, [vendasFiltradas, paginaAtual]);

    function formatarData(data) {
        if (!data) return "-";
        return new Date(data).toLocaleString("pt-BR");
    }

    function formatarMoeda(valor) {
        return Number(valor).toFixed(2).replace(".", ",");
    }

    if (carregando) {
        return (
            <div className="space-y-4 my-6">
                <div className="h-7 w-64 bg-[#00263a] rounded-md animate-pulse"></div>
                <div className="h-4 w-80 bg-[#00263a] rounded-md animate-pulse"></div>

                <div className="bg-[#003049] rounded-xl border border-zinc-800 text-white w-full">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-[#00263a]">
                                <tr>
                                    {["ID Venda", "Filial", "Funcionário", "Pagamento", "Valor Total", "Data"].map((_, i) => (
                                        <th key={i} className="p-4">
                                            <div className="h-3 w-24 bg-[#012f54] rounded animate-pulse"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <tr key={index} className="border-b border-zinc-800">
                                        <td className="pl-10 p-4">
                                            <div className="h-4 w-12 bg-[#012f54] rounded animate-pulse"></div>
                                        </td>

                                        <td className="p-4">
                                            <div className="h-4 w-40 bg-[#012f54] rounded animate-pulse"></div>
                                        </td>

                                        <td className="p-4">
                                            <div className="h-4 w-48 bg-[#012f54] rounded animate-pulse"></div>
                                        </td>

                                        <td className="p-4">
                                            <div className="h-6 w-24 bg-[#00263a] rounded-full animate-pulse"></div>
                                        </td>

                                        <td className="p-4">
                                            <div className="h-4 w-24 bg-[#012f54] rounded animate-pulse"></div>
                                        </td>

                                        <td className="p-4">
                                            <div className="h-4 w-32 bg-[#012f54] rounded animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">


            <div>
                <h1 className="text-4xl font-bold text-[#003049]">Vendas Filiais</h1>
                <h2 className="text-lg mt-1 text-[#94a3b8]">
                    Acompanhe todas as vendas realizadas pelas filiais
                </h2>
            </div>

            <div className="bg-[#003049] border border-zinc-800 p-5 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 text-white">

                {/* Buscar por ID */}
                <div className="flex flex-col">
                    <label className="text-sm text-white/70 mb-1">Buscar por ID</label>
                    <input
                        type="number"
                        value={idBusca}
                        placeholder="Ex: 1204"
                        onChange={(e) => setIdBusca(e.target.value)}
                        className="p-2 rounded bg-[#00263a] border border-zinc-700 text-white"
                    />
                </div>


                <div className="flex flex-col">
                    <label className="text-sm text-white/70 mb-1">Data Inicial</label>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="p-2 rounded bg-[#00263a] border border-zinc-700 text-white"
                    />
                </div>

  
                <div className="flex flex-col">
                    <label className="text-sm text-white/70 mb-1">Data Final</label>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="p-2 rounded bg-[#00263a] border border-zinc-700 text-white"
                    />
                </div>

            
                <div className="flex items-end">
                    <Button
                        className="w-full bg-[#00263a] hover:bg-[#001d2c] text-white"
                        onClick={() => {
                            setIdBusca("");
                            setDataInicio("");
                            setDataFim("");
                        }}
                    >
                        Limpar filtros
                    </Button>
                </div>

            </div>

     
            <div className="bg-[#003049] rounded-xl border border-zinc-800 text-white w-full overflow-x-auto mt-4">
                <table className="w-full min-w-[900px]">

                    <thead className="bg-[#00263a]">
                        <tr>
                            <th className="pl-10 p-4 text-left uppercase text-xs font-bold">ID Venda</th>
                            <th className="p-4 text-left uppercase text-xs font-bold">Filial</th>
                            <th className="p-4 text-left uppercase text-xs font-bold">Funcionário</th>
                            <th className="p-4 text-left uppercase text-xs font-bold">Pagamento</th>
                            <th className="p-4 text-left uppercase text-xs font-bold">Valor Total</th>
                            <th className="p-4 text-left uppercase text-xs font-bold">Data</th>
                        </tr>
                    </thead>

                    <tbody>
                        {vendasPagina.length ? (
                            vendasPagina.map((v, index) => (
                                <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                    <td className="pl-10 pr-3 py-3">{v.id_venda}</td>
                                    <td className="p-3 font-semibold">{v.franquia || "—"}</td>
                                    <td className="p-3 font-semibold">{v.funcionario || "—"}</td>
                                    <td className="p-3">
                                        <span className="px-3 py-2 rounded bg-[#00263a] text-xs capitalize">
                                            {v.pagamento}
                                        </span>
                                    </td>
                                    <td className="p-3 font-bold text-white">R$ {formatarMoeda(v.valor_total)}</td>
                                    <td className="p-3 font-bold text-zinc-200">{formatarData(v.data_venda)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">
                                    <div className="flex flex-col items-center justify-center h-[40vh] text-center w-full">
                                        <PackageX className="w-16 h-16 text-white mb-4" />
                                        <p className="text-xl text-white font-semibold">Nenhuma venda encontrada.</p>
                                        <p className="text-sm text-zinc-500 mt-1">Ajuste os filtros e tente novamente.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <Button
                    onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                    className="bg-[#003049] text-white border border-[#00263a] hover:bg-[#00263a] disabled:opacity-40"
                >
                    Anterior
                </Button>

                <Button
                    onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                    className="bg-[#003049] text-white border border-[#00263a] hover:bg-[#00263a] disabled:opacity-40"
                >
                    Próxima
                </Button>
            </div>

        </div>
    );
}
