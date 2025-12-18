'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Barcode } from 'lucide-react';
import Select from 'react-select';
import CriarProduto from '@/components/CriarProdutoDialog/CriarProdutoDialog';
import EditarProdutoDialog from '@/components/EditarProdutoDialog/EditarProdutoDialog';
import VerProdutoDialog from '@/components/VerProdutoDialog/VerProdutoDialog';
import DialogCriarVaria from '@/components/ProdutosMatrizDialog/criarVariacao';
import ExcluirProdutoVariacao from '@/components/ExcluirProdutoVariacao/ExcluirProdutoVariacao';

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

const colunas = [
  { label: 'SKU', key: 'sku' },
  { label: 'ID Prod', key: 'id_produto' },
  { label: 'Nome', key: 'nome' },
  { label: 'Categoria', key: 'categoria' },
  { label: 'Preço', key: 'valor' },
  { label: 'Custo', key: 'custo_producao' },
];

export default function TabelaPremium() {
  const [produtos, setProdutos] = useState([]);
  const [skuFilter, setSkuFilter] = useState('');
  const [busca, setBusca] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [recarregar, setRecarregar] = useState(false);
  const itensPorPagina = 10;

  useEffect(() => {
    setPaginaAtual(1);
  }, [skuFilter, busca, idFilter, categoriaFiltro]);

  async function carregarDados() {
    try {
      const response = await fetch('http://localhost:8080/produtos/matrizprodutos');
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [recarregar]);

  const categorias = ['Todas', ...new Set(produtos.map((p) => p.categoria))];

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchSKU =
        skuFilter === '' || String(p.sku).toLowerCase().includes(skuFilter.toLowerCase());
      const matchNome = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro;
      const matchID = idFilter === '' || String(p.id_produto).includes(idFilter);

      return matchSKU && matchNome && matchCategoria && matchID;
    });
  }, [produtos, skuFilter, busca, categoriaFiltro, idFilter]);

  const ordenar = (key) => {
    setSortConfig((old) => {
      if (old.key === key) {
        return { key, direction: old.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const produtosOrdenados = useMemo(() => {
    if (!sortConfig.key) return produtosFiltrados;

    return [...produtosFiltrados].sort((a, b) => {
      const valA =
        sortConfig.key === 'valor' || sortConfig.key === 'custo_producao'
          ? Number(String(a[sortConfig.key]).replace(/\./g, '').replace(',', '.'))
          : a[sortConfig.key];

      const valB =
        sortConfig.key === 'valor' || sortConfig.key === 'custo_producao'
          ? Number(String(b[sortConfig.key]).replace(/\./g, '').replace(',', '.'))
          : b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [produtosFiltrados, sortConfig]);

  const totalPaginas = Math.ceil(produtosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const produtosPagina = produtosOrdenados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="min-h-screen p-6 text-zinc-200">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#003049]">Produtos</h1>
            <h2 className="text-lg text-[#235672] mt-1">
              Gerencie o catálogo de produtos, variações e preços.
            </h2>
          </div>
          <CriarProduto setRecarregar={setRecarregar} />
        </div>

        {/* FILTROS */}
        <div className="bg-[#003049] border border-zinc-800 p-6 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="mb-2 text-sm text-zinc-400">Buscar por SKU</label>
            <input
              value={skuFilter}
              onChange={(e) => setSkuFilter(e.target.value)}
              placeholder="Digite o SKU..."
              className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200 focus:border-[#fdf0d5] focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm text-zinc-400">Buscar</label>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite o nome..."
              className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200 focus:border-[#fdf0d5] focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm text-zinc-400">Filtrar por ID</label>
            <input
              type="number"
              value={idFilter}
              onChange={(e) => setIdFilter(e.target.value)}
              placeholder="Ex: 12"
              className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200 focus:border-[#fdf0d5] focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm text-zinc-400">Categoria</label>
            <Select
              styles={selectStyle}
              value={{ label: categoriaFiltro, value: categoriaFiltro }}
              onChange={(e) => setCategoriaFiltro(e.value)}
              options={categorias.map((c) => ({ label: c, value: c }))}
              isSearchable={false}
            />
          </div>
        </div>

        {/* 📦 TABELA */}
        <div className="bg-[#003049] rounded-xl border-3 border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#00263A]">
              <tr>
                {colunas.map((col, index) => (
                  <th
                    key={col.label}
                    onClick={() => ordenar(col.key)}
                    className={`${index === 0 ? 'pl-10' : index === 3 ? 'pl-4' : 'p-4'} 
                      text-left uppercase text-xs font-bold cursor-pointer select-none`}
                  >
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
                <th className="p-4 text-left uppercase text-xs font-bold">Ações</th>
              </tr>
            </thead>

            <tbody>
              {/* 🔵 SKELETON PREMIUM */}
              {produtos.length === 0 ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800">
                    <td className="pl-10 p-4">
                      <div className="h-4 w-20 bg-[#012f54] rounded animate-pulse"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-10 bg-[#012f54] rounded animate-pulse"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-48 bg-[#012f54] rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-32 bg-[#012f54] rounded animate-pulse"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-24 bg-[#012f54] rounded-full animate-pulse"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-[#012f54] rounded animate-pulse"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-[#012f54] rounded animate-pulse"></div>
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#012f54] rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-[#012f54] rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-[#012f54] rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-[#012f54] rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : produtosPagina.length ? (
                produtosPagina.map((p) => (
                  <tr
                    key={p.id_produto}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50"
                  >
                    <td className="pl-5 pr-3 py-3 flex items-center gap-2">
                      <Barcode className="size-4" /> {p.sku}
                    </td>
                    <td className="ml-5 pr-3 py-3">
                      <div className="flex justify-center"># {p.id_produto}</div>
                    </td>
                    <td className="p-3 max-w-[240px]">
                      <p className="font-semibold w-65 truncate">{p.nome}</p>
                      <p className="text-xs text-zinc-500 w-65 truncate">
                        {p.descricao}
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <span className="px-4 py-1 rounded bg-zinc-800 text-xs">
                          {p.categoria}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-white">
                      {Number(p.valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="p-3 font-bold text-zinc-200">
                      {Number(p.custo_producao).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="p-3 flex items-center gap-3">
                      <VerProdutoDialog produto={p} />
                      <DialogCriarVaria produto={p} />
                      <EditarProdutoDialog produto={p} setRecarregar={setRecarregar} />
                      <ExcluirProdutoVariacao prod={p} setRecarregar={setRecarregar} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-zinc-500">
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="bg-[#003049] text-white hover:bg-[#002437]"
          >
            Anterior
          </Button>

          <Button
            onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
            className="bg-[#003049] text-white hover:bg-[#002437]"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
