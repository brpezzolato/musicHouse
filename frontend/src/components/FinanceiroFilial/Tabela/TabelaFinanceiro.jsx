"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";

import ModalEditarDespesa from "./ModalEditarDespesa";
import Filtros from "./Filtros";
import { Check, Pencil, Trash2, PackageX } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TabelaFinanceiro() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [despesaDelete, setDespesaDelete] = useState(null);
  const [openConfirmarPagar, setOpenConfirmarPagar] = useState(false);
  const [despesaPagar, setDespesaPagar] = useState(null);

  const [despesaEdit, setDespesaEdit] = useState({
    id_despesa: "",
    categoria: "",
    descricao: "",
    valor: "",
    data_pagamento: "",
    status: "",
    id_fornecedor: "",
  });

  function formatarDataBR(data) {
    if (!data) return "-";
    const d = new Date(data);
    if (isNaN(d)) return data;
    return d.toLocaleDateString("pt-BR");
  }

  function ordenar(coluna) {
    if (sortConfig.key === coluna) {
      setSortConfig({
        key: coluna,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key: coluna, direction: "asc" });
    }
  }

  useEffect(() => {
    async function carregarDespesas() {
      const res = await fetch("http://localhost:8080/despesas/franquia/", {
        cache: 'no-store',
        credentials: 'include',
      });
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const data = await res.json();
      setProdutos(data);
      setCarregando(false);
    }
    carregarDespesas();
  }, []);

  const categorias = ["todas", ...new Set(produtos.map((p) => p.categoria))];

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchNome = p.descricao?.toLowerCase().includes(busca.toLowerCase());

      const matchCategoria =
        categoriaFiltro === "todas" || p.categoria === categoriaFiltro;

      const matchStatus =
        statusFiltro === "todos" ||
        p.status?.toLowerCase() === statusFiltro.toLowerCase();

      return matchNome && matchCategoria && matchStatus;
    });
  }, [produtos, busca, categoriaFiltro, statusFiltro]);

  const produtosOrdenados = useMemo(() => {
    if (!sortConfig.key) return produtosFiltrados;
    return [...produtosFiltrados].sort((a, b) =>
      sortConfig.direction === "asc"
        ? a[sortConfig.key] > b[sortConfig.key]
          ? 1
          : -1
        : a[sortConfig.key] < b[sortConfig.key]
          ? 1
          : -1
    );
  }, [produtosFiltrados, sortConfig]);

  const totalPaginas = Math.ceil(produtosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const produtosPagina = produtosOrdenados.slice(inicio, inicio + itensPorPagina);

  const abrirModalEditar = (item) => {
    setDespesaEdit({
      id_despesa: item.id_despesa,
      categoria: item.categoria,
      descricao: item.descricao,
      valor: item.valor,
      data_pagamento: item.data_pagamento?.slice(0, 10),
      status: item.status,
      id_fornecedor: item.id_fornecedor,
    });
    setOpenEdit(true);
  };

  const salvarEdicao = async () => {
    await fetch(
      `http://localhost:8080/despesas/franquia/${despesaEdit.id_despesa}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: 'no-store',
        credentials: 'include',
        body: JSON.stringify(despesaEdit),
      }
    );

    setOpenEdit(false);
    window.location.reload();
  };

  const abrirModalDeletar = (item) => {
    setDespesaDelete(item);
    setOpenDelete(true);
  };

  const confirmarDelete = async () => {
    if (!despesaDelete) return;

    try {
      await fetch(
        `http://localhost:8080/despesas/franquia/${despesaDelete.id_despesa}`,
        {
          method: "DELETE",
          cache: 'no-store',
          credentials: 'include',
        }
      );

      setOpenDelete(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const abrirConfirmarPagar = (item) => {
    setDespesaPagar(item);
    setOpenConfirmarPagar(true);
  };

  const confirmarPagarDespesa = async () => {
    if (!despesaPagar) return;

    try {
      await fetch(
        `http://localhost:8080/despesas/franquia/paga/${despesaPagar.id_despesa}`,
        {
          method: "PUT",
          cache: 'no-store',
          credentials: 'include',
        }
      );

      setOpenConfirmarPagar(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao pagar despesa:", error);
    }
  };

  return (
    <div className="space-y-6">

   
      <ModalEditarDespesa
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        despesaEdit={despesaEdit}
        setDespesaEdit={setDespesaEdit}
        salvarEdicao={salvarEdicao}
      />

 
      <Dialog open={openConfirmarPagar} onOpenChange={setOpenConfirmarPagar}>
        <DialogContent className="bg-zinc-900 text-white border border-green-900 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-green-400">
              Confirmar Pagamento
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Deseja marcar a despesa{" "}
              <span className="font-bold text-white">{despesaPagar?.descricao}</span>{" "}
              como <b>PAGA</b>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button onClick={() => setOpenConfirmarPagar(false)} className="bg-zinc-700 hover:bg-zinc-600">
              Cancelar
            </Button>

            <Button onClick={confirmarPagarDespesa} className="bg-green-700 hover:bg-green-600">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="bg-zinc-900 text-white border border-red-900 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir{" "}
              <span className="font-bold text-white">{despesaDelete?.descricao}</span>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button onClick={() => setOpenDelete(false)} className="bg-zinc-700 hover:bg-zinc-600">
              Cancelar
            </Button>

            <Button onClick={confirmarDelete} className="bg-red-700 hover:bg-red-600">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

  
      <Filtros
        busca={busca}
        setBusca={setBusca}
        categoriaFiltro={categoriaFiltro}
        setCategoriaFiltro={setCategoriaFiltro}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
        categorias={categorias}
      />

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 text-white w-full overflow-x-auto">
        <table className="w-full min-w-[900px]">

          <thead className="bg-zinc-800">
            <tr>
              {[
                { label: "ID", key: "id_despesa" },
                { label: "Descrição", key: "descricao" },
                { label: "Categoria", key: "categoria" },
                { label: "Valor", key: "valor" },
                { label: "Status", key: "status" },
                { label: "Criado em", key: "data_criacao" },
                { label: "Data Vencimento", key: "data_pagamento" },
              ].map((col, index) => (
                <th
                  key={col.label}
                  onClick={() => ordenar(col.key)}
                  className={`${index === 0 ? "pl-10" : "p-4"} 
                  text-left uppercase text-xs font-bold cursor-pointer select-none`}
                >
                  {col.label}

                  {sortConfig.key === col.key && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "▴" : "▾"}
                    </span>
                  )}
                </th>
              ))}

              <th className="p-4 text-left uppercase text-xs font-bold">Ações</th>
            </tr>
          </thead>

          <tbody>
    
            {carregando ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-zinc-800 animate-pulse">

                  <td className="pl-10 py-4">
                    <div className="h-4 w-10 bg-zinc-700/40 rounded"></div>
                  </td>

                  <td className="p-4">
                    <div className="h-4 w-56 bg-zinc-700/40 rounded mb-2"></div>
                    <div className="h-4 w-40 bg-zinc-700/20 rounded"></div>
                  </td>

                  <td className="p-4">
                    <div className="h-6 w-24 bg-zinc-700/30 rounded-full"></div>
                  </td>

                  <td className="p-4">
                    <div className="h-4 w-24 bg-zinc-700/40 rounded"></div>
                  </td>

                  <td className="p-4">
                    <div className="h-4 w-20 bg-zinc-700/40 rounded"></div>
                  </td>

                  <td className="p-4">
                    <div className="h-4 w-24 bg-zinc-700/40 rounded"></div>
                  </td>

                  <td className="p-4">
                    <div className="h-4 w-24 bg-zinc-700/40 rounded"></div>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-700/40"></div>
                      <div className="h-8 w-8 rounded-full bg-zinc-700/40"></div>
                      <div className="h-8 w-8 rounded-full bg-zinc-700/40"></div>
                    </div>
                  </td>
                </tr>
              ))

  
            ) : produtosPagina.length ? (
              produtosPagina.map((p) => (
                <tr key={p.id_despesa} className="border-b border-zinc-800 hover:bg-zinc-800/50">

                  <td className="pl-10 pr-3 py-3">{p.id_despesa}</td>

                  <td className="p-3">
                    <p className="font-semibold">{p.descricao}</p>
                  </td>

                  <td className="p-3">
                    <span className="px-3 py-2 rounded bg-zinc-800 text-xs">
                      {p.categoria}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-white">
                    R$ {Number(p.valor).toFixed(2)}
                  </td>

                  <td className="p-3 font-bold text-zinc-200">{p.status}</td>

                  <td className="p-3 font-bold text-zinc-200">{formatarDataBR(p.data_criacao)}</td>

                  <td className="p-3 font-bold text-zinc-200">{formatarDataBR(p.data_pagamento)}</td>

                  <td className="p-3 flex items-center gap-3">

                    {p.status !== "Paga" && (
                      <button
                        onClick={() => abrirConfirmarPagar(p)}
                        className="p-2 rounded-full bg-green-900/60 hover:bg-green-800 border border-green-700 transition"
                        title="Marcar como paga"
                      >
                        <Check className="w-4 h-4 text-green-400" />
                      </button>
                    )}

                    <button
                      onClick={() => abrirModalEditar(p)}
                      className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition"
                    >
                      <Pencil className="w-4 h-4 text-zinc-200" />
                    </button>

                    <button
                      onClick={() => abrirModalDeletar(p)}
                      className="p-2 rounded-full bg-red-900/50 hover:bg-red-800/60 border border-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>

                  </td>
                </tr>
              ))

            ) : (
              <tr>
                <td colSpan="10">
                  <div className="flex flex-col items-center justify-center h-[40vh] text-center w-full">
                    <PackageX className="w-16 h-16 text-zinc-700 mb-4" />
                    <p className="text-xl text-zinc-300 font-semibold">
                      Nenhuma despesa encontrada.
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Não há lançamentos financeiros cadastrados no momento.
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
  );
}
