"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TabelaMovimentacoesEstoque() {
    const [movs, setMovs] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;


    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [skuBusca, setSkuBusca] = useState("");
    const [franquiaBusca, setFranquiaBusca] = useState("");

    useEffect(() => {
        async function carregar() {
            try {
                const res = await fetch("http://localhost:8080/estoque/movimentacoeEstoque", {
                    cache: "no-store",
                    credentials: "include",
                });

                if (!res.ok) {
                    setErro("Erro ao carregar movimentações.");
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, 1200));
                const data = await res.json();
                setMovs(data || []);
            } catch (error) {
                console.error(error);
                setErro("Erro ao conectar ao servidor.");
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, []);


    useEffect(() => {
        setPaginaAtual(1);
    }, [dataInicio, dataFim, skuBusca, franquiaBusca]);


    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const ordenar = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };


    const movFiltrados = useMemo(() => {
        return movs.filter((m) => {
            const dataMov = new Date(m.data);

      
            if (skuBusca.trim() !== "") {
                if (!m.sku.toLowerCase().includes(skuBusca.toLowerCase().trim()))
                    return false;
            }

      
            if (franquiaBusca.trim() !== "") {
                if (!m.franquia.toLowerCase().includes(franquiaBusca.toLowerCase().trim()))
                    return false;
            }

        
            if (dataInicio) {
                const inicio = new Date(`${dataInicio}T00:00:00`);
                if (dataMov < inicio) return false;
            }

            if (dataFim) {
                const fim = new Date(`${dataFim}T23:59:59`);
                if (dataMov > fim) return false;
            }

            return true;
        });
    }, [movs, dataInicio, dataFim, skuBusca, franquiaBusca]);


    const movsOrdenadas = useMemo(() => {
        if (!sortConfig.key) return movFiltrados;

        return [...movFiltrados].sort((a, b) => {
            const v1 = a[sortConfig.key];
            const v2 = b[sortConfig.key];

            if (v1 < v2) return sortConfig.direction === "asc" ? -1 : 1;
            if (v1 > v2) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [movFiltrados, sortConfig]);

    const totalPaginas = Math.ceil(movsOrdenadas.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;

    const movsPagina = useMemo(() => {
        return movsOrdenadas.slice(inicio, inicio + itensPorPagina);
    }, [movsOrdenadas, paginaAtual]);

   
    if (carregando) {
        return (
            <div className="space-y-4 my-4">
                <div className="h-7 w-64 bg-[#00263a] rounded-md animate-pulse" />
                <div className="h-4 w-80 bg-[#00263a] rounded-md animate-pulse" />
            </div>
        );
    }

    if (erro) {
        return (
            <div className="text-red-400 flex items-center gap-2 py-4">
                <AlertTriangle /> {erro}
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-10">

            <div>
                <h1 className="text-4xl font-bold text-[#003049]">Movimentações de Estoque</h1>
                <h2 className="text-lg text-[#94a3b8]">Histórico completo das franquias</h2>
            </div>

            
            <div className="bg-[#003049] border border-zinc-800 p-5 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
       
                <div className="flex flex-col">
                    <label className="text-sm mb-1 text-white/80">Buscar por SKU</label>
                    <input
                        type="text"
                        placeholder="Ex: 142693"
                        value={skuBusca}
                        onChange={(e) => setSkuBusca(e.target.value)}
                        className="p-2 rounded bg-[#00263a] border border-zinc-700 text-white"
                    />
                </div>

          
                <div className="flex flex-col">
                    <label className="text-sm mb-1 text-white/80">Buscar por Franquia</label>
                    <input
                        type="text"
                        placeholder="Ex: Matriz / Centro"
                        value={franquiaBusca}
                        onChange={(e) => setFranquiaBusca(e.target.value)}
                        className="p-2 rounded bg-[#00263a] border border-zinc-700 text-white"
                    />
                </div>

          
                <div className="flex flex-col">
                    <label className="text-sm mb-1 text-white/80">Data Inicial</label>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="p-2 rounded bg-[#00263a] border border-zinc-700 text-white"
                    />
                </div>

      
                <div className="flex flex-col">
                    <label className="text-sm mb-1 text-white/80">Data Final</label>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="p-2 rounded bg-[#00263a] border border-zinc-700 text-white"
                    />
                </div>

       
                <div className="md:col-span-4 flex justify-end">
                    <Button
                        onClick={() => {
                            setSkuBusca("");
                            setFranquiaBusca("");
                            setDataInicio("");
                            setDataFim("");
                        }}
                        className="bg-[#00263a] hover:bg-[#001d2c] text-white mt-2"
                    >
                        Limpar filtros
                    </Button>
                </div>
            </div>

    
            <div className="bg-[#003049] rounded-xl border border-zinc-800 text-white w-full overflow-x-auto mt-4">
                <table className="w-full min-w-[1000px]">

                    <thead className="bg-[#00263a]">
                        <tr>
                            {[
                                { label: "Código", key: "id_movimentacao" },
                                { label: "Franquia", key: "franquia" },
                                { label: "SKU", key: "sku" },
                                { label: "Produto", key: "produto" },
                                { label: "Tipo", key: "tipo" },
                                { label: "Qtd", key: "quantidade" },
                                { label: "Data", key: "data" },
                            ].map((col, index) => (
                                <th
                                    key={col.key}
                                    onClick={() => ordenar(col.key)}
                                    className={`${index === 0 ? "pl-10" : "p-4"} 
                                        text-left uppercase text-xs font-bold cursor-pointer`}
                                >
                                    {col.label}
                                    {sortConfig.key === col.key && (
                                        <span className="ml-1">{sortConfig.direction === "asc" ? "▴" : "▾"}</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {movsPagina.length ? (
                            movsPagina.map((mov) => (
                                <tr
                                    key={mov.id_movimentacao}
                                    className="border-b border-zinc-800 hover:bg-zinc-800/50"
                                >
                                    <td className="pl-10">{mov.id_movimentacao}</td>
                                    <td className="p-4">{mov.franquia}</td>
                                    <td className="p-4">{mov.sku}</td>
                                    <td className="p-4">{mov.produto}</td>

                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-2 rounded text-xs font-semibold border ${
                                                mov.tipo === "entrada"
                                                    ? "bg-green-900/40 text-green-300 border-green-700"
                                                    : "bg-red-900/40 text-red-300 border-red-700"
                                            }`}
                                        >
                                            {mov.tipo.toUpperCase()}
                                        </span>
                                    </td>

                                    <td className="p-4 font-bold">{mov.quantidade}</td>

                                    <td className="p-4 font-bold text-zinc-200">
                                        {new Date(mov.data).toLocaleString("pt-BR")}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">
                                    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                                        <Package className="w-16 h-16 text-white mb-4" />
                                        <p className="text-xl text-white font-semibold">
                                            Nenhuma movimentação encontrada.
                                        </p>
                                        <p className="text-sm text-zinc-400 mt-1">
                                            Ajuste os filtros e tente novamente.
                                        </p>
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
                    className="bg-[#003049] text-white hover:bg-[#002437] disabled:opacity-40"
                >
                    Anterior
                </Button>

                <Button
                    onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                    className="bg-[#003049] text-white hover:bg-[#002437] disabled:opacity-40"
                >
                    Próxima
                </Button>
            </div>

        </div>
    );
}
