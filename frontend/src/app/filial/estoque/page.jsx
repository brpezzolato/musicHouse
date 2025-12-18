"use client";

import { useState, useEffect, useMemo } from "react";
import { getCookie } from "cookies-next";
import { Pencil, Trash2 } from "lucide-react";
import DialogPedidoFornecedor from '@/components/EstoqueFilial/DialogPedidoFornecedor'
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

export default function estoqueFilial() {
  const [estoque, setEstoque] = useState([]);
  const [carregando, setCarregando] = useState(true);


  const [busca, setBusca] = useState("");
  const [skuFiltro, setSkuFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [estoqueFiltro, setEstoqueFiltro] = useState("Todos");

  const itensPorPagina = 10;
  const [paginaAtual, setPaginaAtual] = useState(1);




  const [ordenarPor, setOrdenarPor] = useState("");
  const [ordem, setOrdem] = useState("asc");

  function ordenar(coluna) {
    if (ordenarPor === coluna) {
      setOrdem((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setOrdenarPor(coluna);
      setOrdem("asc");
    }
  }

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(
          `http://localhost:8080/estoque/franquia`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
            credentials: 'include',
          });
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const data = await res.json();
        setEstoque(data || []);
      } catch (error) {
        console.error("Erro ao carregar estoque:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  useEffect(() => {
  setPaginaAtual(1);
}, [busca, skuFiltro, categoriaFiltro, estoqueFiltro, ordenarPor, ordem]);


  const categorias = ["Todos", ...new Set(estoque.map((p) => p.categoria))];

  const categoriaOptions = categorias.map((c) => ({
    label: c,
    value: c,
  }));

  const estoqueStatus = ["Todos", "Com estoque", "Zerado"];

  const estoqueOptions = estoqueStatus.map((s) => ({
    label: s,
    value: s,
  }));


  const itensFiltrados = useMemo(() => {
    return estoque.filter((item) => {
      const matchNome = item.produto
        ?.toLowerCase()
        .includes(busca.toLowerCase());

      const matchSku =
        skuFiltro.trim() === "" ||
        item.sku?.toString().includes(skuFiltro.trim());

      const matchCategoria =
        categoriaFiltro === "Todos" || item.categoria === categoriaFiltro;

      const matchEstoque =
        estoqueFiltro === "Todos"
          ? true
          : estoqueFiltro === "Com estoque"
            ? item.quantidade > 0
            : item.quantidade === 0;

      return matchNome && matchSku && matchCategoria && matchEstoque;
    });
  }, [estoque, busca, skuFiltro, categoriaFiltro, estoqueFiltro]);

  // ORDENAR TABELA
  const itensOrdenados = useMemo(() => {
    if (!ordenarPor) return itensFiltrados;

    return [...itensFiltrados].sort((a, b) => {
      const x = a[ordenarPor];
      const y = b[ordenarPor];

      if (x < y) return ordem === "asc" ? -1 : 1;
      if (x > y) return ordem === "asc" ? 1 : -1;
      return 0;
    });
  }, [itensFiltrados, ordenarPor, ordem]);


  const totalPaginas = Math.ceil(itensOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const itensPagina = itensOrdenados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="p-4 text-zinc-200">

      <h1 className="text-4xl font-bold text-black">Estoque da Filial</h1>
      <p className="text-zinc-500 mb-6">
        Visualize e filtre os produtos disponíveis.
      </p>


      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4">

    
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar produto</label>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite o nome..."
            className="p-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 w-full focus:border-[#FDF0D5] focus:outline-none focus:ring-0"
          />
        </div>


        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar SKU</label>
          <input
            value={skuFiltro}
            onChange={(e) => setSkuFiltro(e.target.value)}
            placeholder="Ex: 964802"
            className="p-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 w-full focus:border-[#FDF0D5] focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Categoria</label>
          <Select
            options={categoriaOptions}
            value={categoriaOptions.find((o) => o.value === categoriaFiltro)}
            onChange={(v) => setCategoriaFiltro(v.value)}
            styles={selectStyle}
            placeholder="Selecione..."
          />
        </div>

     
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Estoque</label>
          <Select
            options={estoqueOptions}
            value={estoqueOptions.find((o) => o.value === estoqueFiltro)}
            onChange={(v) => setEstoqueFiltro(v.value)}
            styles={selectStyle}
            placeholder="Selecione..."
          />
        </div>

      </div>
      Z
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 text-white w-full mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px]">

          <thead className="bg-zinc-800">
            <tr>
              {[
                { label: "SKU", key: "sku" },
                { label: "Produto", key: "produto" },
                { label: "Categoria", key: "categoria" },
                { label: "Quantidade", key: "quantidade" },
                { label: "Ações", key: null },
              ].map((col, index) => (
                <th
                  key={col.label}
                  className={`${index === 0 ? "pl-10" : "p-4"} 
                  text-left uppercase text-xs font-bold select-none
                  ${col.key ? "cursor-pointer" : ""}`}
                  onClick={() => col.key && ordenar(col.key)}
                >
                  {col.label}

                  {col.key && ordenarPor === col.key && (
                    <span className="ml-1">
                      {ordem === "asc" ? "▴" : "▾"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {carregando ? (
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <tr key={i} className="border-b border-zinc-800 animate-pulse">

             
                    <td className="pl-10 py-4">
                      <div className="h-4 w-16 bg-zinc-700/40 rounded"></div>
                    </td>

        
                    <td className="p-4">
                      <div className="h-4 w-40 bg-zinc-700/40 rounded mb-2"></div>
                      <div className="h-4 w-28 bg-zinc-700/30 rounded"></div>
                    </td>

        
                    <td className="p-4">
                      <div className="h-6 w-24 bg-zinc-700/40 rounded-full"></div>
                    </td>

          
                    <td className="p-4">
                      <div className="h-4 w-10 bg-zinc-700/40 rounded"></div>
                    </td>

                
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 bg-zinc-700/40 rounded"></div>
                    </td>

                  </tr>
                ))}
              </>
            ) : itensPagina.length ? (

              itensPagina.map((item) => (
                <tr
                  key={item.sku}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition"
                >

                  <td className="pl-10 pr-3 py-3 font-mono text-zinc-300">
                    #{item.sku}
                  </td>

                  <td className="p-3">
                    <p className="font-semibold">{item.produto}</p>
                  </td>

                  <td className="p-3">
                    <span className="px-3 py-2 rounded bg-zinc-800 text-xs">
                      {item.categoria || "Sem categoria"}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-white">
                    {item.quantidade}
                  </td>

                  <td className="p-3 flex items-center gap-3">
                    <DialogPedidoFornecedor
                      categoria={item.categoria}
                      id={item.id_estoque}
                      sku={item.sku}
                      produto={item.produto}
                      quantidadeProduto={item.quantidade}
                      aviso={item.aviso}
                    />

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-zinc-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
          disabled={paginaAtual === 1}
          className="px-4 py-2 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 rounded disabled:opacity-40"
        >
          Anterior
        </button>

        <button
          onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaAtual === totalPaginas}
          className="px-4 py-2 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 rounded disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
