import React, { useState, useEffect } from 'react';
import { PackageX } from 'lucide-react'
export default function InstrumentosMaisVendidos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {

                const response = await fetch('http://localhost:8080/dashboardFilial/produtosMaisVendidos/ultimos-7-dias', {
                    cache: 'no-store',
                    credentials: 'include',
                });
                if (!response.ok) {

                }
                const data = await response.json();
                setProdutos(data);


            } catch (err) {
                console.error("Erro ao buscar dados da API:", err);
                setError("Não foi possível carregar os dados. Verifique a API.");
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);

    // --- Renderização Condicional ---

    if (loading) {
        return (
            <div className="p-4 text-gray-500">
                Carregando instrumentos mais vendidos...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded">
                Erro: {error}
            </div>
        );
    }

    if (produtos.length === 0) {
        return (

            <div className="bg-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center py-10 text-zinc-400">
                <PackageX className="w-12 h-12 mb-3 text-zinc-600" />
                <p className="text-lg font-medium">
                    Nenhum produto entrou no ranking esta semana.
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                    Não houve vendas registradas nos últimos 7 dias.
                </p>
            </div>


        );
    }

    // --- Renderização da Tabela ---
    // Assumindo que você está dentro do componente InstrumentosMaisVendidos e possui o objeto 'produtos'

    return (
        // 1. Container: Fundo Cinza Escuro (Quase Preto)
        <div className="bg-black p-6 shadow-2xl rounded-lg border border-gray-700">
            <h2 className="text-xl font-extrabold mb-4 text-white">
                Top 5 Produtos Mais Vendidos
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    {/* 2. Cabeçalho: Preto Sólido */}
                    <thead className="bg-zinc-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Produto
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                Quantidade
                            </th>
                        </tr>
                    </thead>
                    {/* 3. Corpo da Tabela: Fundo Cinza Escuro e Linhas Alternadas */}
                    <tbody className="bg-black divide-y divide-zinc-800">
                        {produtos.map((produto, index) => (
                            <tr
                                key={produto.sku}
                                // Alternando cores de linha para um efeito "Zebra" sutil no tema escuro
                                className={index % 2 === 0 ? 'bg-black hover:bg-zinc-800 transition duration-150' : 'bg-black hover:bg-zinc-800 transition duration-150'}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-300">
                                    {produto.sku}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                    {produto.nome}
                                </td>
                                {/* 4. Destaque de Vendas: Texto Branco e Fundo Cinza Claro */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-600 text-white">
                                        {produto.quantidade}
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}