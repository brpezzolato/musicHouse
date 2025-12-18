"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DialogCriarFuncionario from "@/components/FuncionariosFilial/DialogCriarFuncionario";
import DialogEditarFuncionario from '@/components/FuncionariosFilial/DialogEditarFuncionario'
import DialogVerFuncionario from "@/components/FuncionariosFilial/DialogVerFuncionario";

import FiltrosFuncionarios from "@/components/FuncionariosFilial/FiltrosFuncionarios";
import DialogDesligarFuncionario from "@/components/FuncionariosFilial/DialogDesligarFuncionario"
import DialogLigarFuncionario from "@/components/FuncionariosFilial/DialogLigarFuncionario"


export default function TabelaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState("");
  const [cargoFiltro, setCargoFiltro] = useState("Todos");
  const [statusFiltro, setStatusFiltro] = useState("Todos");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;


  const [orderBy, setOrderBy] = useState("id_registro");
  const [orderDirection, setOrderDirection] = useState("asc");

  function ordenarPor(campo) {
    if (orderBy === campo) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(campo);
      setOrderDirection("asc");
    }
  }

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("http://localhost:8080/funcionarios/franquias", {
          cache: 'no-store',
          credentials: 'include',
        }

        );
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const data = await res.json();
        setFuncionarios(data);
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);


  const funcionariosFiltrados = useMemo(() => {
    const filtrados = funcionarios.filter((f) => {
      const matchNome = f.nome_completo?.toLowerCase().includes(busca.toLowerCase());
      const matchCargo = cargoFiltro === "Todos" || f.cargo === cargoFiltro;
      const matchStatus = statusFiltro === "Todos" || f.status === statusFiltro;
      return matchNome && matchCargo && matchStatus;
    });
    return filtrados.sort((a, b) => {

      if (a.status === "Ativo" && b.status !== "Ativo") return -1;
      if (a.status !== "Ativo" && b.status === "Ativo") return 1;

      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (orderDirection === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

  }, [busca, cargoFiltro, statusFiltro, funcionarios, orderBy, orderDirection]);

  const totalPaginas = Math.ceil(funcionariosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const funcionariosPagina = funcionariosFiltrados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="min-h-screen text-zinc-200 p-4">

<div className="
  flex flex-col 
  md:flex-row 
  md:items-center 
  md:justify-between 
  gap-4 
  mb-10
">
  <div className="text-center md:text-left">
    <h1 className="text-3xl md:text-4xl font-bold text-black">Funcionários</h1>
    <h2 className="text-base md:text-lg text-gray-600 mt-1">
      Gerencie os colaboradores da franquia, visualize cargos, status e detalhes de cada funcionário.
    </h2>
  </div>

  <div className="flex justify-center md:justify-end">
    <DialogCriarFuncionario />
  </div>
</div>


      <FiltrosFuncionarios
        busca={busca}
        setBusca={setBusca}
        cargoFiltro={cargoFiltro}
        setCargoFiltro={setCargoFiltro}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
      />

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 mt-6 overflow-x-auto shadow-xl">
        <table className="w-full min-w-[900px] text-white">
          <thead className="bg-zinc-800">
            <tr>
              <th
                onClick={() => ordenarPor("id_registro")}
                className="pl-8 p-4 text-left uppercase text-xs font-bold text-zinc-400 cursor-pointer"
              >
                ID {orderBy === "id_registro" && (orderDirection === "asc" ? "↑" : "↓")}
              </th>

              <th
                onClick={() => ordenarPor("nome_completo")}
                className="p-4 text-left uppercase text-xs font-bold text-zinc-400 cursor-pointer"
              >
                Nome {orderBy === "nome_completo" && (orderDirection === "asc" ? "↑" : "↓")}
              </th>

              <th
                onClick={() => ordenarPor("cargo")}
                className="p-4 text-left uppercase text-xs font-bold text-zinc-400 cursor-pointer"
              >
                Cargo {orderBy === "cargo" && (orderDirection === "asc" ? "↑" : "↓")}
              </th>

              <th className="p-4 text-left uppercase text-xs font-bold text-zinc-400">Telefone</th>
              <th className="p-4 text-left uppercase text-xs font-bold text-zinc-400">Status</th>
              <th className="p-4 pr-8 text-left uppercase text-xs font-bold text-zinc-400">Ações</th>
            </tr>
          </thead>

          <tbody>
            {carregando ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-zinc-800 animate-pulse">

   
                    <td className="pl-8 py-4">
                      <div className="h-4 w-10 bg-zinc-700/40 rounded"></div>
                    </td>


                    <td className="p-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-zinc-700/40"></div>

                        <div className="flex flex-col gap-2">

                          <div className="h-4 w-40 bg-zinc-700/40 rounded"></div>

                          <div className="h-3 w-32 bg-zinc-700/30 rounded"></div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="h-6 w-24 bg-zinc-700/40 rounded-full"></div>
                    </td>


                    <td className="p-4">
                      <div className="h-4 w-24 bg-zinc-700/40 rounded"></div>
                    </td>


                    <td className="p-4">
                      <div className="h-5 w-20 bg-zinc-700/40 rounded-full"></div>
                    </td>

                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-700/40 rounded"></div>
                      <div className="w-8 h-8 bg-zinc-700/40 rounded"></div>
                      <div className="w-8 h-8 bg-zinc-700/40 rounded"></div>
                    </td>

                  </tr>
                ))}
              </>
            ) : funcionariosPagina.length ? (
              funcionariosPagina.map((f) => (
                <tr
                  key={f.id_registro}
                  className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
                >
                  <td className="pl-8 pr-3 py-4 text-zinc-300 font-mono text-sm">
                    #{f.id_registro}
                  </td>

                  <td className="p-4 flex items-center gap-3">
                    {f.fotoFuncionario ? (
                      <img
                        src={`http://localhost:8080${f.fotoFuncionario}`}
                        className="w-10 h-10 rounded-full border border-zinc-600 object-cover"
                        alt="foto"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm text-white font-bold border border-zinc-600"
                      style={{ display: f.fotoFuncionario ? "none" : "flex" }}
                    >
                      {(() => {
                        const n = f.nome_completo.trim().split(" ");
                        const p = n[0]?.charAt(0)?.toUpperCase() || "X";
                        const u = n[n.length - 1]?.charAt(0)?.toUpperCase() || "";
                        return p + u;
                      })()}
                    </div>

                    <div>
                      <p className="font-semibold text-white">{f.nome_completo}</p>
                      <p className="text-xs text-zinc-400">{f.email}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 font-medium">
                      {f.cargo}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-zinc-300">{f.telefone}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${f.status === "Ativo"
                        ? "bg-green-900/30 text-green-400 border border-green-800"
                        : "bg-red-900/30 text-red-400 border border-red-800"
                        }`}
                    >
                      {f.status}
                    </span>
                  </td>


                  <td className="p-4 flex items-center gap-2">

                    <DialogVerFuncionario
                      funcionario={f}
                      onAtualizado={() => window.location.reload()}
                    />

                    <DialogEditarFuncionario
                      funcionario={f}
                      onAtualizado={() => window.location.reload()}
                    />

                    {f.status === "Ativo" && (
                      <DialogDesligarFuncionario
                        funcionario={f}
                        onDesligado={() => window.location.reload()}
                      />
                    )}


                    {f.status === "Inativo" && (
                      <DialogLigarFuncionario
                        funcionario={f}
                        onDesligado={() => window.location.reload()}
                      />
                    )}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-12 text-zinc-500">
                  Nenhum funcionário encontrado.
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
          className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
        >
          Anterior
        </Button>

        <Button
          onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaAtual === totalPaginas}
          className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
