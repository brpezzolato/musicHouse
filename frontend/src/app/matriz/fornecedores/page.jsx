'use client';

import { useState, useMemo, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import FornecedoresMatriz from '@/components/FornecedoresMatriz/FornecedoresMatriz';
import VerFornecedorMatriz from '@/components/FornecedoresMatriz/VerFornecedorMatriz';
import EditarFornecedorMatriz from '@/components/FornecedoresMatriz/EditarFornecedorMatriz';
import ExcluirFornecedorMatriz from '@/components/FornecedoresMatriz/ExcluirFornecedorMatriz';

function formatCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '');
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

function handleCNPJMask(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 14) value = value.slice(0, 14);
  return value
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscaNome, setBuscaNome] = useState('');
  const [buscaCNPJ, setBuscaCNPJ] = useState('');
  const [buscaEmail, setBuscaEmail] = useState('');
  const [buscaObjeto, setBuscaObjeto] = useState('');
  const [reload, setReload] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  async function pegarInfo() {
    try {
      setLoading(true);

      const res = await fetch('http://localhost:8080/fornecedores');

      await new Promise((resolve) => setTimeout(resolve, 1200));
      const data = await res.json();
      setFornecedores(data);


      await new Promise((resolve) => setTimeout(resolve, 1200));

    } catch (erro) {
      console.log('Erro ao pegar fornecedores', erro);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    pegarInfo();
  }, [reload]);

  const itensFiltrados = useMemo(() => {
    const cnpjBusca = buscaCNPJ.replace(/\D/g, '');
    return fornecedores.filter(
      (f) =>
        f.nome.toLowerCase().includes(buscaNome.toLowerCase()) &&
        f.cnpj.replace(/\D/g, '').includes(cnpjBusca) &&
        f.email.toLowerCase().includes(buscaEmail.toLowerCase()) &&
        f.objeto_fornecido.toLowerCase().includes(buscaObjeto.toLowerCase())
    );
  }, [fornecedores, buscaNome, buscaCNPJ, buscaEmail, buscaObjeto]);

  const totalPaginas = Math.ceil(itensFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const itensPagina = itensFiltrados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="p-4 text-zinc-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#003049]">Fornecedores</h1>
          <h2 className="text-lg text-[#235672] mt-1">
            Visualize e filtre os fornecedores cadastrados.
          </h2>
        </div>
        <FornecedoresMatriz setReload={setReload} />
      </div>


      <div className="bg-[#003049] border border-zinc-800 mt-5 p-6 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar por nome</label>
          <input
            value={buscaNome}
            onChange={(e) => setBuscaNome(e.target.value)}
            placeholder="Digite o nome..."
            className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar por CNPJ</label>
          <input
            value={buscaCNPJ}
            onChange={(e) => setBuscaCNPJ(handleCNPJMask(e.target.value))}
            placeholder="Digite o CNPJ..."
            className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar por email</label>
          <input
            value={buscaEmail}
            onChange={(e) => setBuscaEmail(e.target.value)}
            placeholder="Digite o email..."
            className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-1">Buscar por objeto fornecido</label>
          <input
            value={buscaObjeto}
            onChange={(e) => setBuscaObjeto(e.target.value)}
            placeholder="Digite o objeto fornecido..."
            className="p-2 pl-3 rounded bg-[#00263A] border border-[#5a6870] text-zinc-200"
          />
        </div>
      </div>


      <div className="bg-[#003049] rounded-xl border border-zinc-800 mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#00263A]">
            <tr>
              {['ID', 'Nome', 'CNPJ', 'Email', 'Custo', 'Ações'].map(
                (col, index) => (
                  <th
                    key={col}
                    className={`${index === 0 ? 'pl-10' : 'p-4'} text-left uppercase text-xs font-bold`}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <tr key={i} className="border-b border-zinc-800 animate-pulse">
                    <td className="pl-10 py-4">
                      <div className="h-4 w-12 bg-zinc-700/40 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-40 bg-zinc-700/40 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-32 bg-zinc-700/40 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-48 bg-zinc-700/40 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-20 bg-zinc-700/40 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-zinc-700/40 rounded"></div>
                        <div className="w-8 h-8 bg-zinc-700/40 rounded"></div>
                        <div className="w-8 h-8 bg-zinc-700/40 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ) : itensPagina.length ? (
              itensPagina.map((item) => (
                <tr
                  key={item.id_fornecedor}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50"
                >
                  <td className="pl-10 pr-3 py-3 font-mono text-zinc-300">
                    #{item.id_fornecedor}
                  </td>
                  <td className="p-3 font-semibold">{item.nome}</td>
                  <td className="p-3 font-mono">{formatCNPJ(item.cnpj)}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">
                    {Number(item.custo).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <VerFornecedorMatriz fornecedor={item} />
                    <EditarFornecedorMatriz fornecedor={item} setReload={setReload} />
                    <ExcluirFornecedorMatriz fornecedor={item} setReload={setReload} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-6 text-zinc-500">
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


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
