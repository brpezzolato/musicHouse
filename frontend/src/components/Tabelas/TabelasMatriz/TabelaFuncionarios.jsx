'use client';

import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import CriarFuncionario from './CriarFuncionario';
import VerFuncionario from './VerFuncionario';
import DialogEditarFuncionario from './DialogEditarFuncionario';
import DialogDesativarFuncionario from './DialogDesativarFuncionario.jsx'
import DialogLigarFuncionario from './DialogLigarFuncionario'

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

export default function TabelaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [franquiasOptions, setFranquiasOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [franquiaFiltro, setFranquiaFiltro] = useState('Todas');
  const [cargoFiltro, setCargoFiltro] = useState('Todos');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;


  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, statusFiltro, franquiaFiltro, cargoFiltro]);
  async function fetchData() {
    try {
      setLoading(true);
      const [resFunc, resFranq] = await Promise.all([
        fetch('http://localhost:8080/funcionarios'),
        fetch('http://localhost:8080/franquias'),
      ]);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const dataFunc = await resFunc.json();
      const dataFranq = await resFranq.json();

      setFuncionarios(Array.isArray(dataFunc) ? dataFunc : [dataFunc]);
      setFranquiasOptions(Array.isArray(dataFranq) ? dataFranq : [dataFranq]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  const franquiaOptionsSelect = [
    { value: 'Todas', label: 'Todas as Franquias' },
    ...franquiasOptions.map((f) => ({
      value: f.cidade,
      label: f.cidade,
    })),
  ];

  const statusOptionsSelect = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
  ];

  const cargoOptionsSelect = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Administrador Matriz', label: 'Administrador' },
    { value: 'Gerente de Loja', label: 'Gerente de Loja' },
    { value: 'Caixa', label: 'Caixa' },
    { value: 'Supervisor', label: 'Supervisor' },
  ];

  const funcionariosFiltrados = useMemo(() => {
    return funcionarios.filter((f) => {
      const nome = f.nome_completo?.toLowerCase() || '';
      const cargo = f.credencial || '';
      const status = f.status || '';
      const franquia = f.franquia || '';

      const matchBusca = nome.includes(busca.toLowerCase());
      const matchStatus = statusFiltro === 'Todos' || status === statusFiltro;
      const matchCargo = cargoFiltro === 'Todos' || cargo === cargoFiltro;

      const matchFranquia =
        franquiaFiltro === 'Todas' || franquia === franquiaFiltro;

      return matchBusca && matchStatus && matchCargo && matchFranquia;
    });
  }, [funcionarios, busca, statusFiltro, franquiaFiltro, cargoFiltro]);

  const ordenar = (key) => {
    setSortConfig((old) => {
      if (old.key === key)
        return { key, direction: old.direction === 'asc' ? 'desc' : 'asc' };
      return { key, direction: 'asc' };
    });
  };

  const funcionariosOrdenados = useMemo(() => {
    let sorted = [...funcionariosFiltrados];

    sorted.sort((a, b) => {
      if (a.status === 'Ativo' && b.status !== 'Ativo') return -1;
      if (a.status !== 'Ativo' && b.status === 'Ativo') return 1;
      return 0;
    });

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a.status === 'Ativo' && b.status !== 'Ativo') return -1;
        if (a.status !== 'Ativo' && b.status === 'Ativo') return 1;

        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  }, [funcionariosFiltrados, sortConfig]);

  const totalPaginas = Math.ceil(funcionariosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const funcionariosPagina = funcionariosOrdenados.slice(
    inicio,
    inicio + itensPorPagina
  );

  return (
    <div className="min-h-screen p-6 text-zinc-200">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--azul-marinho)] tracking-tight">
            Gestão de Funcionários
          </h1>
          <CriarFuncionario onSuccess={fetchData} />
        </div>

        <div className="bg-[#003049] border border-zinc-800 p-6 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-6 shadow-lg">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-zinc-300">
              Buscar por Nome
            </label>
            <div className="relative">
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digite o nome..."
                className="w-full p-2 pl-10 rounded-md bg-[#00263A] border border-[#5a6870] text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#5a6870]"
              />
              <Search className="absolute left-3 top-2.5 text-zinc-500 w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-zinc-300">
              Franquia
            </label>
            <Select
              styles={selectStyle}
              options={franquiaOptionsSelect}
              value={franquiaOptionsSelect.find(
                (o) => o.value === franquiaFiltro
              )}
              onChange={(opt) => setFranquiaFiltro(opt.value)}
              placeholder="Selecione..."
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-zinc-300">
              Status
            </label>
            <Select
              styles={selectStyle}
              options={statusOptionsSelect}
              value={statusOptionsSelect.find((o) => o.value === statusFiltro)}
              onChange={(opt) => setStatusFiltro(opt.value)}
              placeholder="Selecione..."
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-zinc-300">
              Cargo
            </label>
            <Select
              styles={selectStyle}
              options={cargoOptionsSelect}
              value={cargoOptionsSelect.find((o) => o.value === cargoFiltro)}
              onChange={(opt) => setCargoFiltro(opt.value)}
              placeholder="Selecione..."
            />
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-[#003049] rounded-xl border border-zinc-800 overflow-hidden shadow-xl">
          <table className="w-full">
            <thead className="bg-[#00263A]">
              <tr>
                {[
                  { key: 'id_registro', label: 'ID' },
                  { key: 'nome_completo', label: 'Nome' },
                  { key: 'cargo', label: 'Cargo' },
                  { key: 'telefone', label: 'Telefone' },
                  { key: 'status', label: 'Status' },
                ].map((col, index) => (
                  <th
                    key={col.key}
                    onClick={() => ordenar(col.key)}
                    className={`${index === 0 ? 'pl-8' : 'p-4'
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
                <th className="p-4  uppercase text-xs font-bold text-zinc-400 pr-8">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  {/* SKELETON PARA 6 LINHAS */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <tr key={i} className="border-b border-zinc-800 animate-pulse">
                      {/* ID */}
                      <td className="pl-8 pr-3 py-4">
                        <div className="h-4 w-10 bg-zinc-700/40 rounded"></div>
                      </td>

                      {/* Nome + foto */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-700/40"></div>
                          <div className="flex flex-col gap-2">
                            <div className="h-4 w-40 bg-zinc-700/40 rounded"></div>
                            <div className="h-3 w-28 bg-zinc-800/40 rounded"></div>
                          </div>
                        </div>
                      </td>

                      {/* Cargo */}
                      <td className="p-4">
                        <div className="h-4 w-24 bg-zinc-700/40 rounded"></div>
                      </td>

                      {/* Telefone */}
                      <td className="p-4">
                        <div className="h-4 w-20 bg-zinc-700/40 rounded"></div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <div className="h-5 w-16 bg-zinc-700/40 rounded-full"></div>
                      </td>

                      {/* Ações */}
                      <td className="pr-8 p-4">
                        <div className="flex gap-3 justify-end">
                          <div className="w-6 h-6 bg-zinc-700/40 rounded"></div>
                          <div className="w-6 h-6 bg-zinc-700/40 rounded"></div>
                          <div className="w-6 h-6 bg-zinc-700/40 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : funcionariosPagina.length ? (
                funcionariosPagina.map((f) => (
                  <tr
                    key={f.id_registro}
                    className="border-b border-zinc-800 hover:bg-[#003855] transition-colors group"
                  >
                    <td className="pl-8 pr-3 py-4 text-zinc-300 font-mono text-sm">
                      #{f.id_registro}
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      {f.fotoFuncionario ? (
                        <img
                          src={`http://localhost:8080${f.fotoFuncionario}`}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-600"
                          alt={f.nome_completo}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#c1121f] flex items-center justify-center text-sm text-white font-bold border-2 border-[#9f0e19]">
                          {(() => {
                            const nomes =
                              f.nome_completo?.trim().split(' ') || [];
                            const primeira =
                              nomes[0]?.charAt(0).toUpperCase() || '?';
                            const ultima =
                              nomes.length > 1
                                ? nomes[nomes.length - 1]
                                  .charAt(0)
                                  .toUpperCase()
                                : '';
                            return primeira + ultima;
                          })()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">
                          {f.nome_completo}
                        </p>
                        <p className="text-xs text-zinc-400">{f.email}</p>
                        {franquiasOptions.find(
                          (fq) => fq.id_franquia === f.id_franquia
                        ) && (
                            <p className="text-[10px] text-[#c1121f] font-bold mt-0.5">
                              {
                                franquiasOptions.find(
                                  (fq) => fq.id_franquia === f.id_franquia
                                ).cidade
                              }
                            </p>
                          )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-[#001d2d] border border-[#004e75] text-xs text-cyan-100 font-medium">
                        {f.credencial}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-300">{f.telefone}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${f.status === 'Ativo'
                          ? 'bg-green-900/30 text-green-400 border border-green-800'
                          : f.status === 'Inativo'
                            ? 'bg-red-900/30 text-red-400 border border-red-800'
                            : 'bg-gray-900/30 text-gray-400 border border-gray-800'
                          }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="p-1 pr-8 text-right flex justify-end gap-2">
                      <VerFuncionario funcionario={f} />
                      <DialogEditarFuncionario funcionario={f} />
                      {f.status === "Ativo" && (
                        <DialogDesativarFuncionario
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
                    Nenhum funcionário encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-zinc-500">
            Mostrando {inicio + 1} a{' '}
            {Math.min(inicio + itensPorPagina, funcionariosOrdenados.length)} de{' '}
            {funcionariosOrdenados.length} resultados
          </span>
          <div className="flex gap-2">
            <Button
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="bg-[#003049] text-zinc-200 hover:bg-[#00263A] border border-zinc-800"
            >
              Anterior
            </Button>
            <Button
              onClick={() =>
                setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={paginaAtual === totalPaginas}
              className="bg-[#003049] text-zinc-200 hover:bg-[#00263A] border border-zinc-800"
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
