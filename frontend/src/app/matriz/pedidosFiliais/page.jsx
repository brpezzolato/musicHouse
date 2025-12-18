"use client"; // Para garantir que o código seja executado no lado do cliente

import { useState, useMemo, useEffect } from "react";
// Assumindo que Card, CardContent, CardTitle são componentes estilizados,
// mas vamos focar na estilização Tailwind aqui.
import { Button } from '@/components/ui/button';
import { PackageX, Tag, Search, CornerDownRight, RefreshCw, AlertTriangle } from "lucide-react"; // Adicionado AlertTriangle para Prioridade
import DialogAceitarPedidoFilial from '@/components/EstoqueMatriz/DialogAceitarPedidoFIlial.jsx'
import DialogRecusarPedidoFilial from '@/components/EstoqueMatriz/DialogRecusarPedidoFilial.jsx'
import Select from "react-select";


const selectStyle = {
    control: (base, state) => ({
        ...base,
        borderRadius: '99999px',
        borderColor: state.isFocused ? '#5a6870' : '#5a6870',
        padding: '2px',
        minHeight: '40px',
        boxShadow: state.isFocused ? '0 0 0 1px #403a3f' : 'none',
        '&:hover': { borderColor: '#fdf0d5' },
        backgroundColor: '#00263a',
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#697b85',
    }),
    placeholder: (base) => ({
        ...base,
        color: '#b5b5b5',
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isFocused
            ? '#C1121F'
            : isSelected
                ? '#003049'
                : 'white',
        color: isFocused || isSelected ? 'white' : '#003049',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: '#003049',
            color: 'white',
        },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '6px',
        overflow: 'hidden',
    }),
};


// --- Configuração e Estilos Tailwind Helpers ---
const itensPorPagina = 10;
const todosStatus = ['Todos', 'Pendente', 'Aprovado', 'Recusado']; // Status comuns
// NOVO: Opções de Prioridade
const todosGrauPrioridade = ['Todos', 'Baixa', 'Média', 'Alta'];

const statusOptions = todosStatus.map(s => ({ value: s, label: s }));
const prioridadeOptions = todosGrauPrioridade.map(p => ({ value: p, label: p }));

// Estilização simples para o status (usando as cores da sua paleta ou neutras)
const getStatusClasses = (status) => {
    switch (status) {
        case 'Aprovado':
            return 'bg-green-100 text-green-700 font-bold';
        case 'Pendente':
            return 'bg-yellow-100 text-yellow-700 font-bold';
        case 'Recusado':
            return 'bg-red-100 text-red-700 font-bold';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export default function PedidosFiliais() {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    // --- ESTADOS DE FILTRO ---
    const [searchTerm, setSearchTerm] = useState(''); // Busca por Produto/ID/SKU
    const [statusFilter, setStatusFilter] = useState('Todos'); // Filtro por Status
    const [prioridadeFilter, setPrioridadeFilter] = useState('Todos'); // NOVO: Filtro por Prioridade

    // 1. Fetch de Dados (Inalterado, apenas a URL)
    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/estoque/pedidosMatriz");
            await new Promise((resolve) => setTimeout(resolve, 1200));
            const data = await response.json();


            const pedidosArray = Array.isArray(data) ? data : data.pedidos || [];

            setPedidos(pedidosArray);
        } catch (error) {
            console.error("Erro ao buscar os pedidos da matriz", error);
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);


    const filteredPedidos = useMemo(() => {
        let result = pedidos;
        const lowerSearchTerm = searchTerm.toLowerCase();

   
        if (statusFilter !== 'Todos') {
            result = result.filter(pedido => pedido.status === statusFilter);
        }

   
        if (prioridadeFilter !== 'Todos') {
            result = result.filter(pedido => pedido.prioridade === prioridadeFilter);
        }

      
        if (lowerSearchTerm) {
            result = result.filter(pedido => {
                const idMatch = String(pedido.id_pedido).toLowerCase().includes(lowerSearchTerm);
                const produtoMatch = pedido.produto?.nome?.toLowerCase().includes(lowerSearchTerm);
                const skuMatch = pedido.produto?.sku?.toLowerCase().includes(lowerSearchTerm);

                return idMatch || produtoMatch || skuMatch;
            });
        }

        return result;
    }, [pedidos, searchTerm, statusFilter, prioridadeFilter]); 

 
    useEffect(() => {
        setPaginaAtual(1);
    }, [searchTerm, statusFilter, prioridadeFilter]); 


    const totalPaginas = Math.ceil(filteredPedidos.length / itensPorPagina);

    const itensPagina = useMemo(() => {
        const inicio = (paginaAtual - 1) * itensPorPagina;
        return filteredPedidos.slice(inicio, inicio + itensPorPagina);
    }, [paginaAtual, filteredPedidos]);


    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('Todos');
        setPrioridadeFilter('Todos'); 
        setPaginaAtual(1);
    };



    return (
        <div className="p-4 min-h-screen">
            <h1 className="text-4xl font-extrabold text-[#003049]"> Pedidos de Estoque Matriz</h1>
            <p className="text-lg text-gray-600 mt-1 mb-6">
                Gerencie os pedidos de reabastecimento das filiais.
            </p>

            <div className="bg-[#003049] p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border text-zinc-400 border-gray-200">
                <div className="md:col-span-3 w-full">
                    <label htmlFor="search" className="block text-sm font-medium mb-1">
                        Buscar (ID, Produto ou SKU)
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por ID, Nome ou SKU..."
                            className="p-2 pl-10 w-full rounded bg-[#00263A] border border-[#5a6870] text-zinc-200 focus:border-[#fdf0d5] focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <div className="md:col-span-1 w-full">
                    <label className="block text-sm font-medium mb-1">Filtrar Prioridade</label>
                    <Select
                        styles={selectStyle}
                        options={prioridadeOptions}
                        value={prioridadeOptions.find(o => o.value === prioridadeFilter)}
                        onChange={(e) => setPrioridadeFilter(e.value)}
                        placeholder="Selecione..."
                    />
                </div>

            </div>



            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 animate-pulse">

                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#fdfdfd] border-t-4 border-[#003049] shadow-xl rounded-lg p-5"
                        >

                            <div className="h-6 w-40 bg-zinc-300/60 rounded mb-4"></div>


                            <div className="mb-4">
                                <div className="h-4 w-20 bg-zinc-300/50 rounded mb-1"></div>
                                <div className="h-5 w-52 bg-zinc-300/50 rounded"></div>
                            </div>

                            <div className="space-y-3 border-t border-zinc-300/40 pt-4">

                                <div className="h-4 w-32 bg-zinc-300/50 rounded"></div>
                                <div className="h-4 w-40 bg-zinc-300/40 rounded"></div>

                                <div className="h-4 w-28 bg-zinc-300/50 rounded"></div>
                                <div className="h-4 w-20 bg-zinc-300/40 rounded"></div>

                                <div className="h-4 w-48 bg-zinc-300/40 rounded"></div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-zinc-300/40">
                                <div className="h-10 w-24 bg-zinc-300/60 rounded"></div>
                                <div className="h-10 w-24 bg-zinc-300/40 rounded"></div>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (

                <>

                    <p className="text-sm text-gray-600 mb-4">
                        {filteredPedidos.length} pedidos encontrados
                    </p>


                    <div className="mt-6">
                        {itensPagina.length === 0 ? (

                            <div className="flex w-full min-h-[60vh] items-center justify-center">
                                <div className="flex flex-col items-center text-center">
                                    <PackageX className="w-16 h-16 text-[#003049] mb-4" />

                                    <p className="text-xl text-[#003049] font-medium">
                                        Nenhum pedido encontrado.
                                    </p>

                                    <p className="text-sm text-zinc-600 mt-1">
                                        Não há registros disponíveis no momento.
                                    </p>
                                </div>
                            </div>
                        ) : (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {itensPagina.map((pedido) => (
                                    <div
                                        key={pedido.id_pedido}
                                        className="bg-white border-t-4 border-[#003049] shadow-xl rounded-lg overflow-hidden transition duration-300 hover:shadow-2xl"
                                    >
                                        <div className="p-5">


                                            <div className="flex justify-between items-start mb-3 border-b pb-2">
                                                <h3 className="text-xl font-bold text-[#003049]">
                                                    Pedido #{pedido.id_pedido}
                                                </h3>
                                            </div>


                                            <div className="mb-3">
                                                <p className="text-sm text-gray-500">Filial:</p>
                                                <p className="font-semibold text-lg text-gray-800">
                                                    {pedido.franquia?.rua || "Endereço N/A"},{" "}
                                                    {pedido.franquia?.cidade || "Cidade N/A"}
                                                </p>
                                            </div>


                                            <div className="text-sm space-y-1 border-t pt-3">
                                                <p>
                                                    Produto:{" "}
                                                    <strong className="text-gray-900">
                                                        {pedido.produto?.nome || "N/A"}
                                                    </strong>
                                                </p>

                                                <p className="flex items-center">
                                                    <Tag className="w-4 h-4 mr-1 text-gray-400" /> Categoria:{" "}
                                                    <strong>{pedido.produto?.categoria || "N/A"}</strong>
                                                </p>

                                                <p>
                                                    <CornerDownRight className="w-4 h-4 mr-1 text-gray-400 inline-block" />{" "}
                                                    SKU:{" "}
                                                    <strong className="text-[#003049]">
                                                        {pedido.produto?.sku || "N/A"}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Quantidade:{" "}
                                                    <strong className="text-red-600">{pedido.quantidade}</strong>
                                                </p>

                                                <p className="flex items-center">
                                                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />
                                                    Prioridade: <strong className="ml-1">{pedido.prioridade}</strong>
                                                </p>

                                                <p>
                                                    Observação:{" "}
                                                    <span className="text-gray-500 italic">
                                                        {pedido.observacao || "Nenhuma observação"}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="flex gap-2 mt-4 pt-4 border-t">
                                                <DialogAceitarPedidoFilial
                                                    onAtualizado={fetchPedidos}
                                                    id_pedido={pedido.id_pedido}
                                                    id_estoque={pedido.id_estoque}
                                                    franquia={pedido.franquia?.rua}
                                                    quantidade={pedido.quantidade}
                                                />

                                                <DialogRecusarPedidoFilial
                                                    onRecusado={fetchPedidos}
                                                    id_pedido={pedido.id_pedido}
                                                    franquia={pedido.franquia?.rua}
                                                    quantidade={pedido.quantidade}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Controles de navegação de página */}
                    <div className="flex justify-center gap-3 mt-8">
                        <Button
                            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                            disabled={paginaAtual === 1}
                            className="bg-[#003049] hover:bg-[#002437] disabled:opacity-40"
                        >
                            Anterior
                        </Button>
                        <span className="px-4 py-2 text-gray-700">Página {paginaAtual} de {totalPaginas}</span>
                        <Button
                            onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                            disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                            className="bg-[#003049] hover:bg-[#002437] disabled:opacity-40"
                        >
                            Próxima
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}