"use client";

import { useState, useMemo } from "react";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";


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
    backgroundColor: isSelected
      ? "#003049"
      : isFocused
        ? "#C1121F"
        : "white",
    color: isFocused || isSelected ? "white" : "#003049",
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "6px",
    overflow: "hidden",
  }),
};

export default function TabelaEstoque() {
  const [produtos, setProdutos] = useState([
    { id_produto: 1, nome_produto: "Guitarra Stratocaster", categoria: "Cordas", quantidade: 12, preco: 1999.99 },
    { id_produto: 2, nome_produto: "Bateria Acústica", categoria: "Percussão", quantidade: 4, preco: 3599.0 },
    { id_produto: 3, nome_produto: "Teclado Yamaha 61 Teclas", categoria: "Teclas", quantidade: 0, preco: 2599.9 },
    { id_produto: 4, nome_produto: "Violão Clássico Nylon", categoria: "Cordas", quantidade: 7, preco: 899.99 },
    { id_produto: 5, nome_produto: "Microfone Shure SM58", categoria: "Acessórios", quantidade: 22, preco: 499.0 },
    { id_produto: 6, nome_produto: "Baixo Jazz Bass", categoria: "Cordas", quantidade: 2, preco: 2199.99 },
  ]);

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  function statusItem(qtd) {
    if (qtd <= 0) return "Sem estoque";
    if (qtd < 5) return "Baixo estoque";
    return "Em estoque";
  }

  const categorias = ["todas", ...new Set(produtos.map((p) => p.categoria))];

  const categoriaOptions = categorias.map((c) => ({ value: c, label: c }));
  const statusOptions = [
    { value: "todos", label: "Todos" },
    { value: "Em estoque", label: "Em estoque" },
    { value: "Baixo estoque", label: "Baixo estoque" },
    { value: "Sem estoque", label: "Sem estoque" },
  ];

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchNome = p.nome_produto.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = categoriaFiltro === "todas" || p.categoria === categoriaFiltro;
      const status = statusItem(p.quantidade);
      const matchStatus = statusFiltro === "todos" || status.toLowerCase() === statusFiltro.toLowerCase();
      return matchNome && matchCategoria && matchStatus;
    });
  }, [produtos, busca, categoriaFiltro, statusFiltro]);

  const ordenar = (key) => {
    setSortConfig((old) => {
      if (old.key === key) {
        return { key, direction: old.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const produtosOrdenados = useMemo(() => {
    if (!sortConfig.key) return produtosFiltrados;

    return [...produtosFiltrados].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [produtosFiltrados, sortConfig]);

  const totalPaginas = Math.ceil(produtosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const produtosPagina = produtosOrdenados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="min-h-screen text-zinc-200">
      <div className="space-y-6">

        <div className="bg-[#003049] border border-zinc-800 p-6 rounded-md 
        grid grid-cols-1 md:grid-cols-6 gap-4">

          <div className="flex flex-col">
            <label className="text-sm text-zinc-400">Buscar produto</label>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite o nome..."
              className="
      mt-1 p-2 pl-3 rounded bg-[#00263A] 
      border border-[#5a6870] 
      focus:border-[#fdf0d5]
      outline-none ring-0 focus:ring-0 
      invalid:ring-0 invalid:border-[#5a6870]
      text-zinc-200
    "
            />
          </div>

          {/* CATEGORIA */}
          <div className="flex flex-col">
            <label className="text-sm text-zinc-400">Categoria</label>

            <Select
              value={categoriaOptions.find((o) => o.value === categoriaFiltro)}
              onChange={(opt) => setCategoriaFiltro(opt.value)}
              options={categoriaOptions}
              styles={selectStyle}
              className="mt-1 "
            />
          </div>

          {/* STATUS */}
          <div className="flex flex-col">
            <label className="text-sm text-zinc-400">Status</label>

            <Select
              value={statusOptions.find((o) => o.value === statusFiltro)}
              onChange={(opt) => setStatusFiltro(opt.value)}
              options={statusOptions}
              styles={selectStyle}
              className="mt-1 "
            />
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-[#003049] rounded-xl border-3 border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#00263A]">
              <tr>
                {["id_produto", "nome_produto", "categoria", "quantidade", "preco"].map(
                  (col, index) => (
                    <th
                      key={col}
                      onClick={() => ordenar(col)}
                      className={`${index === 0 ? "pl-10" : "p-4"
                        } text-left uppercase text-xs font-bold cursor-pointer`}
                    >
                      {col}
                      {sortConfig.key === col && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  )
                )}

                <th className="p-4 text-left uppercase text-xs font-bold">
                  Status
                </th>

                <th className="p-4 text-left uppercase text-xs font-bold">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {produtosPagina.length ? (
                produtosPagina.map((p) => {
                  const estado = statusItem(p.quantidade);

                  return (
                    <tr
                      key={p.id_produto}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50"
                    >
                      <td className="pl-10 pr-3 py-3">{p.id_produto}</td>

                      <td className="p-3 font-semibold">{p.nome_produto}</td>

                      <td className="p-3">
                        <span className="px-2 py-1 rounded bg-[#00263A] text-xs">
                          {p.categoria}
                        </span>
                      </td>

                      <td className="p-3 font-bold">{p.quantidade}</td>

                      <td className="p-3 font-bold">
                        R$ {Number(p.preco).toFixed(2)}
                      </td>

                      <td className="p-3 font-bold text-zinc-200">{estado}</td>

                      <td className="p-3 flex items-center gap-3">
                        <button className="p-2 rounded-full bg-[#00263A] hover:bg-zinc-700 border border-zinc-700 transition">
                          <Eye className="w-4 h-4 text-zinc-200" />
                        </button>

                        <button
                          onClick={() => console.log("Editar", p)}
                          className="p-2 rounded-full bg-[#00263A] hover:bg-zinc-700 border border-zinc-700 transition"
                        >
                          <Pencil className="w-4 h-4 text-zinc-200" />
                        </button>

                        <button
                          onClick={() => console.log("Excluir", p)}
                          className="p-2 rounded-full bg-red-900/50 hover:bg-red-800/60 border border-red-700 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-zinc-500">
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
            className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          >
            Anterior
          </Button>

          <Button
            onClick={() =>
              setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
            }
            disabled={paginaAtual === totalPaginas}
            className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
