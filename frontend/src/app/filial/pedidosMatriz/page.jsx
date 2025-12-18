"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Hash, Calendar, RefreshCw, Box, PackageX } from 'lucide-react';
import Select from "react-select";

const selectStyle = {
    control: (base, state) => ({
        ...base,
        borderRadius: '99999px',
        borderColor: state.isFocused ? '#403a3f' : '#403a3f',
        padding: '2px',
        minHeight: '40px',
        boxShadow: state.isFocused ? '0 0 0 1px #403a3f' : 'none',
        '&:hover': { borderColor: '#403a3f' },
        backgroundColor: '#27272a',
    }),

    valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
    }),

    singleValue: (base) => ({
        ...base,
        color: '#fff',
    }),

    placeholder: (base) => ({
        ...base,
        color: '#a7a7a7bb',
        fontSize: '14px',
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

const ITEMS_PER_PAGE = 8;
const todosStatus = ['Todos', 'Aprovado', 'Pendente', 'Negado'];

const getStatusClasses = (status) => {
    switch (status) {
        case 'Aprovado':
        case 'Pendente':
        case 'Negado':
            return 'bg-gray-200 text-gray-800 border border-gray-400';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export default function PaginaListarPedidosFornecedor() {
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [skuSearchTerm, setSkuSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPedidos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/estoque/pedidosFilial', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                credentials: 'include',
            });
            await new Promise((resolve) => setTimeout(resolve, 1200));

            const data = await response.json();

            
            if (!Array.isArray(data)) {
                console.log("API NÃO RETORNOU ARRAY:", data);
                setPedidos([]);
                return;
            }

            const mappedData = data.map(item => ({
                id: item.id_pedido,
                produto: item.produto,
                sku: item.sku,
                data_pedido: item.data_pedido ? new Date(item.data_pedido).toLocaleDateString('pt-BR') : 'N/A',
                status: item.status || 'Pendente',
                quantidade: item.quantidade,
            }));

            setPedidos(mappedData);

        } catch (err) {
            console.error("Falha ao buscar pedidos:", err);
            setError(`Falha ao conectar à API (${err.message}). Verifique a API.`);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchPedidos();
    }, []);

    const filteredPedidos = useMemo(() => {
        let result = pedidos;

        if (statusFilter !== 'Todos') {
            result = result.filter(pedido => pedido.status === statusFilter);
        }

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(pedido =>
                String(pedido.id).toLowerCase().includes(lowerSearchTerm) ||
                String(pedido.produto).toLowerCase().includes(lowerSearchTerm)
            );
        }

        if (skuSearchTerm) {
            const lowerSkuSearchTerm = skuSearchTerm.toLowerCase();
            result = result.filter(pedido =>
                String(pedido.sku).toLowerCase().includes(lowerSkuSearchTerm)
            );
        }

        return result;
    }, [pedidos, statusFilter, searchTerm, skuSearchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, searchTerm, skuSearchTerm]);

    const totalPages = Math.ceil(filteredPedidos.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredPedidos.slice(startIndex, endIndex);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    return (
        <div className="min-h-screen text-white mt-5">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">Gerenciamento de Pedidos Filial</h1>
            <p className="text-zinc-500 mb-6">Visualize todos os pedidos realizados a matriz.</p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Atenção!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

            <div className="bg-[#18181b] p-4 sm:p-6 rounded-xl shadow-inner mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-end border border-gray-200">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-zinc-400 mb-1">Buscar (ID/Produto)</label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ex: Camiseta, 003"
                        className="w-full p-3 bg-[#27272a] border-gray-400 rounded-lg focus:ring-gray-600 focus:border-gray-600 transition duration-150 text-white"
                    />
                </div>

                <div>
                    <label htmlFor="skuSearch" className="block text-sm font-medium text-zinc-400 mb-1">Buscar por SKU</label>
                    <input
                        type="text"
                        id="skuSearch"
                        value={skuSearchTerm}
                        onChange={(e) => setSkuSearchTerm(e.target.value)}
                        placeholder="Ex: SKU-1234"
                        className="w-full p-3 bg-[#27272a] rounded-lg focus:ring-gray-600 focus:border-gray-600 transition duration-150 text-white"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-zinc-400 mb-1">Filtrar por Status</label>
                    <Select
                        id="status"
                        value={{ label: statusFilter, value: statusFilter }}
                        onChange={(selected) => setStatusFilter(selected.value)}
                        options={todosStatus.map(s => ({ label: s, value: s }))}
                        styles={selectStyle}
                        placeholder="Selecione..."
                        isSearchable={false}
                    />

                </div>

                <div className="hidden lg:block">
                    <p className="text-sm font-medium text-white mb-2">Página {currentPage} de {totalPages}</p>
                    <p className="text-2xl font-bold text-white">{filteredPedidos.length} Pedidos</p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 animate-pulse">

                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#18181b] p-5 rounded-xl shadow-lg border border-zinc-800"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-5 w-32 bg-zinc-700/40 rounded"></div>
                                <div className="h-6 w-20 bg-zinc-700/40 rounded-full"></div>
                            </div>

                            <div className="mb-4 flex gap-2">
                                <div className="h-4 w-20 bg-zinc-700/40 rounded"></div>
                                <div className="h-4 w-24 bg-zinc-700/40 rounded"></div>
                            </div>

                            <div className="h-4 w-24 bg-zinc-700/40 rounded mb-2"></div>
                            <div className="h-6 w-40 bg-zinc-700/40 rounded mb-4"></div>

                            <div className="flex justify-between items-center border-t border-zinc-700/50 pt-3">
                                <div>
                                    <div className="h-4 w-20 bg-zinc-700/40 rounded mb-1"></div>
                                    <div className="h-4 w-24 bg-zinc-700/40 rounded"></div>
                                </div>

                                <div className="text-right">
                                    <div className="h-4 w-16 bg-zinc-700/40 rounded mb-1"></div>
                                    <div className="h-6 w-10 bg-zinc-700/40 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            ) : pedidos.length === 0 ? (


                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <PackageX className="w-16 h-16 text-zinc-800 mb-4" />

                    <p className="text-xl text-zinc-800 font-medium">
                        Nenhum pedido encontrado.
                    </p>

                    <p className="text-sm text-zinc-600 mt-1">
                        Não há registros disponíveis no momento.
                    </p>
                </div>


            ) : (
                <>
                    {filteredPedidos.length === 0 ? (


                        <p className="text-center text-xl text-white mt-8 p-6 bg-[#27272a] rounded-xl shadow border border-gray-200">
                            Nenhum pedido encontrado com os filtros aplicados.
                        </p>

                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {currentItems.map((pedido) => (
                                <div key={pedido.id} className="bg-[#18181b] p-5 rounded-xl shadow-lg border-t-4  hover:shadow-2xl transition duration-300 border border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white flex items-center"><Hash className="w-5 h-5 mr-1 text-white" /> Pedido {pedido.id}</h3>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(pedido.status)}`}>{pedido.status}</span>
                                    </div>

                                    <div className="mb-4 flex">
                                        <p className="text-sm text-white flex items-center"><Box className="w-4 h-4 mr-1 text-white" /> SKU: </p>
                                        <p className="text-md font-medium text-white"> {pedido.sku}</p>
                                    </div>

                                    <p className="text-sm text-white mb-1">Produto:</p>
                                    <p className="text-lg font-semibold text-white mb-4">{pedido.produto}</p>

                                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                        <div>
                                            <p className="text-sm text-white flex items-center"><Calendar className="w-4 h-4 mr-1 text-white" /> Data:</p>
                                            <p className="text-md font-medium">{pedido.data_pedido}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-white flex items-center justify-end">Quantidade:</p>
                                            <p className="text-xl font-extrabold text-white">{pedido.quantidade}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`p-3 border rounded-lg transition duration-150 ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#27272a] hover:bg-gray-100 text-white border-gray-400'}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => goToPage(index + 1)}
                                className={`px-4 py-2 rounded-lg font-semibold transition duration-150 ${currentPage === index + 1
                                    ? 'bg-[#18181b] text-white shadow-md'
                                    : 'bg-[#27272a] text-white hover:bg-gray-100 hover:text-gray-900 border border-gray-400'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`p-3 border rounded-lg transition duration-150 ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#27272a] hover:bg-gray-100 text-white border-gray-400'}`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
