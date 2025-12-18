"use client";

import { useState, useEffect, useMemo } from "react";
import DialogEditarEstoque from "@/components/EstoqueMatriz/DialogEditarEstoque";
import Select from "react-select";

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: "99999px",
    borderColor: state.isFocused ? "#5a6870" : "#5a6870",
    padding: "2px",
    minHeight: "40px",
    boxShadow: state.isFocused ? "0 0 0 1px #403a3f" : "none",
    "&:hover": { borderColor: "#fdf0d5" },
    backgroundColor: "#00263a",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#697b85",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#b5b5b5",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isFocused
      ? "#C1121F"
      : isSelected
        ? "#003049"
        : "white",
    color: isFocused || isSelected ? "white" : "#003049",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#003049",
      color: "white",
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "6px",
    overflow: "hidden",
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

  const [ordenarPor, setOrdenarPor] = useState(null);
  const [ordem, setOrdem] = useState("asc");

  function ordenar(coluna) {
    if (ordenarPor === coluna) {
      setOrdem(ordem === "asc" ? "desc" : "asc");
    } else {
      setOrdenarPor(coluna);
      setOrdem("asc");
    }
  }

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, skuFiltro, categoriaFiltro, estoqueFiltro]);


  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(
          `http://localhost:8080/estoque/franquia`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
            credentials: "include",
          }
        );
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

  const categorias = ["Todos", ...new Set(estoque.map((p) => p.categoria))];
  const categoriaOptions = categorias.map((c) => ({ label: c, value: c }));

  const estoqueStatus = ["Todos", "Com estoque", "Zerado"];
  const estoqueOptions = estoqueStatus.map((s) => ({ label: s, value: s }));

  const itensFiltrados = useMemo(() => {
    let dados = estoque.filter((item) => {
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

    if (ordenarPor) {
      dados.sort((a, b) => {
        const x = a[ordenarPor];
        const y = b[ordenarPor];

        if (typeof x === "number" && typeof y === "number") {
          return ordem === "asc" ? x - y : y - x;
        }

        return ordem === "asc"
          ? String(x).localeCompare(String(y))
          : String(y).localeCompare(String(x));
      });
    }

    return dados;
  }, [estoque, busca, skuFiltro, categoriaFiltro, estoqueFiltro, ordenarPor, ordem]);

  const totalPaginas = Math.ceil(itensFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const itensPagina = itensFiltrados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="p-4 text-zinc-200">
      <h1 className="text-4xl font-bold text-[#003049]">Estoque da Matriz</h1>
      <p className="text-lg text-[#235672] mt-1">
        Visualize e filtre os produtos disponíveis no estoque.
      </p>

      <div className="bg-[#003049] border border-zinc-800 mt-5 p-6 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4">
    
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar produto</label>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite o nome..."
            className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200 focus:border-[#fdf0d5] focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar SKU</label>
          <input
            value={skuFiltro}
            onChange={(e) => setSkuFiltro(e.target.value)}
            placeholder="Ex: 964802"
            className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200 focus:border-[#fdf0d5] focus:outline-none focus:ring-0"
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

      <div className="bg-[#003049] rounded-xl border-3 border-zinc-800 mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#00263A]">
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
                  onClick={() => col.key && ordenar(col.key)}
                  className={`${index === 0 ? "pl-10" : "p-4"} text-left uppercase text-xs font-bold ${col.key ? "cursor-pointer select-none" : ""
                    }`}
                >
                  {col.label}
                  {col.key && ordenarPor === col.key && (
                    <span className="ml-1">{ordem === "asc" ? "▴" : "▾"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {carregando ? (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800">


                    <td className="pl-10 p-4">
                      <div className="h-4 w-16 bg-[#012f54] rounded animate-pulse"></div>
                    </td>


                    <td className="p-4">
                      <div className="h-4 w-48 bg-[#012f54] rounded animate-pulse"></div>
                    </td>


                    <td className="p-4">
                      <div className="h-5 w-24 bg-[#012f54] rounded-full animate-pulse"></div>
                    </td>

                    <td className="p-4">
                      <div className="h-4 w-10 bg-[#012f54] rounded animate-pulse"></div>
                    </td>


                    <td className="p-4">
                      <div className="h-8 w-16 bg-[#012f54] rounded animate-pulse"></div>
                    </td>

                  </tr>
                ))}
              </>
            ) : itensPagina.length ? (

              itensPagina.map((item) => (
                <tr
                  key={item.sku}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50"
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
                    <DialogEditarEstoque
                      quantidadeProduto={item.quantidade}
                      categoria={item.categoria}
                      sku={item.sku}
                      aviso={item.aviso}
                      nomeProduto={item.produto}
                      idEstoque={item.id_estoque}
                      onAtualizado={() => window.location.reload()}
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
=
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
          disabled={paginaAtual === 1}
          className="px-4 py-2 bg-[#003049] text-white hover:bg-[#002437] rounded disabled:opacity-40"
        >
          Anterior
        </button>

        <button
          onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaAtual === totalPaginas}
          className="px-4 py-2 bg-[#003049] text-white hover:bg-[#002437] rounded disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
