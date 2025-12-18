'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Search } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import CriarFranquia from './CriarFranquia';
import VerFranquia from './VerFranquia';
import DesativarFranquia from './DesativarFranquia';
import Select from 'react-select';

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

export default function TabelaFranquia() {
  const [franquias, setFranquias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState('');
  const [cidadeFiltro, setCidadeFiltro] = useState('Todas');
  const [statusFiltro, setStatusFiltro] = useState('Todos');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [recarregar, setRecarregar] = useState(false);
  const itensPorPagina = 10;

  async function fetchFranquias() {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/franquias');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await res.json();
      const lista = Array.isArray(data) ? data : [data];
      setFranquias(lista.slice(1));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFranquias();
  }, [recarregar]);

  const cidades = ['Todas', ...new Set(franquias.map((f) => f.cidade))];

  const franquiasFiltradas = useMemo(() => {
    return franquias.filter((f) => {
      const matchBusca =
        f.endereco_completo.toLowerCase().includes(busca.toLowerCase()) ||
        f.cidade.toLowerCase().includes(busca.toLowerCase()) ||
        String(f.id_franquia).includes(busca);

      const matchCidade = cidadeFiltro === 'Todas' || f.cidade === cidadeFiltro;
      const matchStatus = statusFiltro === 'Todos' || f.status === statusFiltro;

      return matchBusca && matchCidade && matchStatus;
    });
  }, [franquias, busca, cidadeFiltro, statusFiltro]);

  const ordenar = (key) => {
    setSortConfig((old) => {
      if (old.key === key) {
        return { key, direction: old.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const franquiasOrdenadas = useMemo(() => {
    if (!sortConfig.key) return franquiasFiltradas;

    return [...franquiasFiltradas].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [franquiasFiltradas, sortConfig]);

  const totalPaginas = Math.ceil(franquiasOrdenadas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const franquiasPagina = franquiasOrdenadas.slice(
    inicio,
    inicio + itensPorPagina
  );

  return (
    <div className="min-h-screen p-6 text-zinc-200">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--azul-marinho)] tracking-tight">
            Gestão de Franquias
          </h1>

          <CriarFranquia onSuccess={fetchFranquias} />
        </div>

        <div className="bg-[var(--azul-marinho)] border border-zinc-800 p-6 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-6 shadow-lg">
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 text-sm font-medium text-zinc-300">
              Buscar (ID, Endereço ou Cidade)
            </label>
            <div className="relative">
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digite para buscar..."
                className="w-full p-2 pl-10 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200 focus:border-[#fdf0d5] focus:outline-none focus:ring-0"
              />
              <Search className="absolute left-3 top-2.5 text-zinc-500 w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-zinc-300">
              Cidade
            </label>
            <Select
              value={{ label: cidadeFiltro, value: cidadeFiltro }}
              onChange={(opt) => setCidadeFiltro(opt.value)}
              options={cidades.map((c) => ({ label: c, value: c }))}
              styles={selectStyle}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-zinc-300">
              Status
            </label>
            <Select
              value={{ label: statusFiltro, value: statusFiltro }}
              onChange={(opt) => setStatusFiltro(opt.value)}
              options={[
                { label: 'Todos', value: 'Todos' },
                { label: 'Ativo', value: 'Ativo' },
                { label: 'Inativo', value: 'Inativo' },
              ]}
              styles={selectStyle}
            />
          </div>
        </div>

        <div className="bg-[var(--azul-marinho)] rounded-xl border border-zinc-800 overflow-hidden shadow-xl">
          <table className="w-full">
            <thead className="bg-[#00263A]">
              <tr>
                {[
                  { key: 'id_franquia', label: 'ID' },
                  { key: 'endereco_completo', label: 'Endereço' },
                  { key: 'cidade', label: 'Cidade' },
                  { key: 'telefone_contato', label: 'Contato' },
                  { key: 'status', label: 'Status' },
                ].map((col, index) => (
                  <th
                    key={col.key}
                    onClick={() => ordenar(col.key)}
                    className={`${
                      index === 0 ? 'pl-8' : 'p-4'
                    } text-left uppercase text-xs font-bold text-zinc-400 cursor-pointer select-none hover:text-white transition-colors`}
                  >
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="ml-1 text-[#c1121f]">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
                <th className="p-4 text-right uppercase text-xs font-bold text-zinc-400 pr-8">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <>
                  {[1,2,3,4,5,7,8,9,10].map((i) => (
                    <tr key={i} className="border-b border-zinc-800 animate-pulse">

                      <td className="pl-8 py-4">
                        <div className="h-4 w-12 bg-zinc-700/40 rounded"></div>
                      </td>

                      <td className="p-4">
                        <div className="h-4 w-64 bg-zinc-700/40 rounded mb-2"></div>
                        <div className="h-4 w-40 bg-zinc-700/20 rounded"></div>
                      </td>

                      <td className="p-4">
                        <div className="h-5 w-24 bg-zinc-700/40 rounded-full"></div>
                      </td>

                      <td className="p-4">
                        <div className="h-4 w-40 bg-zinc-700/40 rounded"></div>
                        <div className="h-3 w-32 bg-zinc-700/30 rounded mt-1"></div>
                      </td>

                      <td className="p-4">
                        <div className="h-5 w-16 bg-zinc-700/40 rounded-full"></div>
                      </td>

                      <td className="p-4 pr-2 flex justify-end gap-3">
                        <div className="h-8 w-8 bg-zinc-700/40 rounded"></div>
                        <div className="h-8 w-8 bg-zinc-700/40 rounded"></div>
                      </td>

                    </tr>
                  ))}
                </>
              ) : franquiasPagina.length ? (
                franquiasPagina.map((f) => (
                  <tr
                    key={f.id_franquia}
                    className="border-b border-zinc-800 hover:bg-[#003855] transition-colors group"
                  >
                    <td className="pl-8 pr-3 py-4 text-zinc-300 font-mono text-sm">
                      #{f.id_franquia}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-white">
                        {f.endereco_completo}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {f.codigo_postal}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-[#001d2d] border border-[#004e75] text-xs text-cyan-100 font-medium">
                        {f.cidade}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-zinc-300">
                      <div className="flex flex-col">
                        <span>{f.telefone_contato}</span>
                        <span className="text-xs text-zinc-500">
                          {f.email_contato}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          f.status === 'Ativo'
                            ? 'bg-green-900/30 text-green-400 border border-green-800'
                            : 'bg-red-900/30 text-red-400 border border-red-800'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>

                    <td className="p-4 pr-2 text-right flex">
                      <VerFranquia filial={f} />

                      <DesativarFranquia
                        filial={f}
                        setRecarregar={setRecarregar}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-12 text-zinc-500">
                    Nenhuma franquia encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-zinc-500">
            Mostrando {inicio + 1} a{' '}
            {Math.min(inicio + itensPorPagina, franquiasOrdenadas.length)} de{' '}
            {franquiasOrdenadas.length} resultados
          </span>
          <div className="flex gap-2">
            <Button
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="bg-[var(--azul-marinho)] text-zinc-200 hover:bg-[#00263A] border border-zinc-800"
            >
              Anterior
            </Button>

            <Button
              onClick={() =>
                setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={paginaAtual === totalPaginas}
              className="bg-[var(--azul-marinho)] text-zinc-200 hover:bg-[#00263A] border border-zinc-800"
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
