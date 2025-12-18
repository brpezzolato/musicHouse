'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import VerChamadoMatriz from '@/components/VerChamadoMatriz/VerChamadoMatriz';
import { Loader2, PackageX } from 'lucide-react';
import ModalApontamentoFinal from "@/components/ApontamentoFinal/ApontamentoFinal";

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: '99999px',
    borderColor: '#5a6870',
    padding: '2px',
    minHeight: '40px',
    boxShadow: state.isFocused ? '0 0 0 1px #403a3f' : 'none',
    '&:hover': { borderColor: '#fdf0d5' },
    backgroundColor: '#00263a',
  }),
  singleValue: (base) => ({ ...base, color: '#697b85' }),
  placeholder: (base) => ({ ...base, color: '#b5b5b5' }),
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
  menu: (base) => ({ ...base, borderRadius: '6px', overflow: 'hidden' }),
};

const colunas = [
  { label: 'Nome', key: 'nome_func' },
  { label: 'Mensagem', key: 'descricao' },
  { label: 'Prioridade', key: 'prioridade' },
  { label: 'Status', key: 'status' },
  { label: 'Ações', key: 'acoes' },
];

export default function TabelaChamados() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroMensagem, setFiltroMensagem] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState("Todas");

  const [recarregar, setRecarregar] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusTemp, setStatusTemp] = useState(null);
  const [chamadoTemp, setChamadoTemp] = useState(null);
  const [mudandoStatus, setMudandoStatus] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const ordenar = (key) => {
    if (key === 'acoes') return;
    setSortConfig((old) => {
      if (old.key === key) {
        return { key, direction: old.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  async function carregarChamados() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/chamados", {
        cache: 'no-store',
        credentials: 'include',
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = await response.json();
      if (response.ok) {
        setChamados(data);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarChamados();
  }, [recarregar]);

  const chamadosFiltrados = useMemo(() => {
    return chamados.filter((c) => {
      const matchNome = c.nome_func.toLowerCase().includes(filtroNome.toLowerCase());
      const matchMensagem = c.descricao.toLowerCase().includes(filtroMensagem.toLowerCase());
      const matchStatus = filtroStatus === 'Todos' || c.status === filtroStatus;
      const matchPrioridade = filtroPrioridade === "Todas" || c.prioridade === filtroPrioridade;

      return matchNome && matchMensagem && matchStatus && matchPrioridade;
    });
  }, [chamados, filtroNome, filtroMensagem, filtroStatus, filtroPrioridade]);

  const chamadosOrdenados = useMemo(() => {
    if (!sortConfig.key) return chamadosFiltrados;
    return [...chamadosFiltrados].sort((a, b) => {
      const valA = a[sortConfig.key].toString().toLowerCase();
      const valB = b[sortConfig.key].toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [chamadosFiltrados, sortConfig]);

  const totalPaginas = Math.ceil(chamadosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const chamadosPagina = chamadosOrdenados.slice(inicio, inicio + itensPorPagina);

  async function atualizarStatus(id, novoStatus, chamadoData, apontamentoFinal = null) {
    try {
      setRecarregar(false);
      setMudandoStatus(true);

      const data = {
        ...chamadoData,
        apontamento_final: apontamentoFinal,
      };

      const resposta = await fetch(`http://localhost:8080/chamados/${id}?status=${novoStatus}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!resposta.ok) {
        console.log("Erro ao atualizar status");
      } else {
        setModalOpen(false);
        setMudandoStatus(false);
      }
    } catch (err) {
      console.log("Falha ao atualizar status:", err);
    } finally {
      setRecarregar(true);
    }
  }

  return (
    <div className="min-h-screen p-6 text-zinc-200">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-[#003049]">Chamados</h1>
          <h2 className="text-lg text-[#235672] mt-1">
            Gerencie os chamados recebidos.
          </h2>
        </div>


        <div className="bg-[#003049] border border-zinc-800 p-6 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="flex flex-col">
            <label className="mb-2 text-sm text-zinc-400">Nome</label>
            <input
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Buscar por nome..."
              className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm text-zinc-400">Prioridade</label>
            <Select
              styles={selectStyle}
              value={filtroPrioridade ? { label: filtroPrioridade, value: filtroPrioridade } : null}
              options={[
                { label: "Todas", value: "Todas" },
                { label: "Baixa", value: "Baixa" },
                { label: "Média", value: "Média" },
                { label: "Alta", value: "Alta" },
                { label: "Crítica", value: "Crítica" },
              ]}
              onChange={(opt) => setFiltroPrioridade(opt ? opt.value : "Todas")}
              isSearchable={false}
              placeholder="Selecionar prioridade..."
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm text-zinc-400">Mensagem</label>
            <input
              value={filtroMensagem}
              onChange={(e) => setFiltroMensagem(e.target.value)}
              placeholder="Palavra-chave..."
              className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm text-zinc-400">Status</label>
            <Select
              styles={selectStyle}
              value={{ label: filtroStatus, value: filtroStatus }}
              options={[
                { label: 'Todos', value: 'Todos' },
                { label: 'Aberto', value: 'Aberto' },
                { label: 'Em andamento', value: 'Em andamento' },
                { label: 'Resolvido', value: 'Resolvido' },
                { label: 'Cancelado', value: 'Cancelado' },
              ]}
              onChange={(selected) =>
                setFiltroStatus(selected ? selected.value : 'Todos')
              }
              isSearchable={false}
            />
          </div>
        </div>

        <div className="bg-[#003049] rounded-xl border border-zinc-800 overflow-hidden">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-[#00263A]">
              <tr>
                {colunas.map((col) => (
                  <th
                    key={col.label}
                    onClick={() => ordenar(col.key)}
                    className="p-4 text-left uppercase text-xs font-bold cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-2">
                      {col.label}

                      {col.key === "status" && mudandoStatus && (
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
                      )}

                      {sortConfig.key === col.key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-zinc-800 animate-pulse">
                      <td className="p-4">
                        <div className="h-4 w-40 bg-zinc-700/40 rounded"></div>
                      </td>

                      <td className="p-4">
                        <div className="h-4 w-60 bg-zinc-700/40 rounded mb-2"></div>
                        <div className="h-4 w-40 bg-zinc-700/20 rounded"></div>
                      </td>

                      <td className="p-4">
                        <div className="h-5 w-20 bg-zinc-700/40 rounded-full"></div>
                      </td>

                      <td className="p-4">
                        <div className="h-10 w-32 bg-zinc-700/40 rounded-md"></div>
                      </td>

                      <td className="p-4">
                        <div className="w-8 h-8 bg-zinc-700/40 rounded"></div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : chamadosPagina.length ? (
                chamadosPagina.map((c) => (
                  <tr
                    key={c.id_chamado}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50"
                  >
                    <td className="p-3 pr-7">{c.nome_func}</td>

                    <td className="p-3 max-w-[200px] pr-5">
                      <p className="truncate">
                        {c.descricao.length > 40
                          ? c.descricao.substring(0, 40) + '...'
                          : c.descricao}
                      </p>
                    </td>

                    <td className="p-3">
                      <span
                        className={{
                          "Baixa":
                            "px-2 py-1 rounded-lg text-xs font-semibold bg-green-700/20 text-green-400 border border-green-700/40",
                          "Média":
                            "px-2 py-1 rounded-lg text-xs font-semibold bg-yellow-700/20 text-yellow-400 border border-yellow-700/40",
                          "Alta":
                            "px-2 py-1 rounded-lg text-xs font-semibold bg-orange-700/20 text-orange-400 border border-orange-700/40",
                          "Crítica":
                            "px-2 py-1 rounded-lg text-xs font-semibold bg-red-700/20 text-red-400 border border-red-700/40",
                        }[c.prioridade]}
                      >
                        {c.prioridade}
                      </span>
                    </td>

                    <td className="p-3 w-40">
                      <Select
                        styles={selectStyle}
                        isSearchable={false}
                        value={{ label: c.status, value: c.status }}
                        options={[
                          { label: 'Aberto', value: 'Aberto' },
                          { label: 'Em andamento', value: 'Em andamento' },
                          { label: 'Resolvido', value: 'Resolvido' },
                          { label: 'Cancelado', value: 'Cancelado' },
                        ]}
                        onChange={(e) => {
                          if (e.value === "Resolvido" || e.value === "Cancelado") {
                            setStatusTemp(e.value);
                            setChamadoTemp(c);
                            setModalOpen(true);
                          } else {
                            atualizarStatus(c.id_chamado, e.value, c);
                          }
                        }}
                        menuPosition="fixed"
                      />
                    </td>

                    <td className="p-3 w-8">
                      <VerChamadoMatriz idChamado={c.id_chamado} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">
                    <div className="flex flex-col items-center justify-center h-[40vh] text-center w-full">
                      <PackageX className="w-16 h-16 text-white mb-4" />
                      <p className="text-xl text-white font-semibold">
                        Nenhum chamado encontrado
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">
                        Não há registros disponíveis no momento.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ModalApontamentoFinal
          open={modalOpen}
          id={chamadoTemp?.id_chamado}
          mudandoStatus={mudandoStatus}
          onClose={() => setModalOpen(false)}
          onConfirm={(texto) => {
            atualizarStatus(chamadoTemp.id_chamado, statusTemp, chamadoTemp, texto);
          }}
        />

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
