'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function Franquias() {
  const router = useRouter();

  const [todasFranquias, setTodasFranquias] = useState([]);
  const [franquiasFiltradas, setFranquiasFiltradas] = useState([]);
  const [busca, setBusca] = useState('');
  const [cidade, setCidade] = useState('Todos');
  const [status, setStatus] = useState('Todos');
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState([]);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchFranquias() {
      try {
        const res = await fetch('http://localhost:8080/franquias');
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [data];
        setTodasFranquias(lista);
        setFranquiasFiltradas(lista);

        const cidades = Array.from(new Set(lista.map((f) => f.cidade))).sort();
        setCidadesDisponiveis(cidades);
      } catch (error) {
        console.error('Erro ao buscar franquias:', error);
      }
    }
    fetchFranquias();
  }, []);

  function aplicarFiltros() {
    let filtradas = [...todasFranquias];

    if (busca.trim() !== '') {
      filtradas = filtradas.filter((f) =>
        [f.endereco_completo, f.cidade, f.email_contato]
          .join(' ')
          .toLowerCase()
          .includes(busca.toLowerCase())
      );
    }

    if (cidade !== 'Todos') {
      filtradas = filtradas.filter((f) => f.cidade === cidade);
    }

    if (status !== 'Todos') {
      filtradas = filtradas.filter((f) => f.status === status);
    }

    setFranquiasFiltradas(filtradas);
  }

  useEffect(() => {
    aplicarFiltros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca]);

  const scrollToContent = () => {
    const section = document.getElementById('conteudo-franquias');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] text-center">
      {/* ================= HERO ================= */}
      <section
        className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('/franquias/FundoFranquias.png')" }}
      >
        {/* overlay escuro */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col items-center px-4">
          <h1 className="text-white text-6xl font-extrabold italic drop-shadow-lg">
            Franquias
          </h1>
          <p className="text-gray-200 mt-4 text-lg font-medium max-w-[700px]">
            Aba para poder ver todas as franquias disponíveis da{' '}
            <b>Music House</b>
          </p>
        </div>

        {/* Chevron animado */}
        <button
          onClick={scrollToContent}
          className={`absolute bottom-12 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-[#c1121f] text-white hover:bg-[#780000] transition-all duration-200 animate-bounce-slow ${
            scrollY > 200 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <style jsx>{`
          @keyframes bounce-slow {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(8px);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 1s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* ============ CONTEUDO  ============ */}
      <section id="conteudo-franquias" className="bg-[#f4f4f4]">
        <div className="flex flex-1 w-full max-w-[1400px] mx-auto gap-6 mt-8 px-4 pb-16">
          <div className="flex flex-col flex-1 items-center">
            <div className="relative w-full max-w-[960px] mb-10">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar franquia..."
                className="w-full bg-white rounded-[var(--borda-padrao)] py-4 pl-12 pr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#c1121f]/60"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c1121f]" />
            </div>
            {franquiasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full max-w-[960px]">
                {franquiasFiltradas.map((franquia) => (
                  <div
                    key={franquia.id_franquia}
                    onClick={() =>
                      router.push(`/matriz/franquias/${franquia.id_franquia}`)
                    }
                    className="bg-white rounded-[var(--borda-padrao)] shadow-md p-6 w-[280px] sm:w-[300px]
                      transition-all duration-300 hover:scale-[1.03] hover:shadow-lg
                      cursor-pointer group"
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src="/catalogo/fundoMadeira.png"
                        alt="Imagem da franquia"
                        className="w-16 h-16 rounded-[var(--borda-padrao)] object-cover border border-gray-300 mb-3 group-hover:border-[#c1121f] transition-all"
                      />
                      <p className="font-semibold text-[15px] text-black leading-tight group-hover:text-[#c1121f] transition-colors">
                        {franquia.endereco_completo}
                      </p>
                      <p className="text-sm italic text-gray-700">
                        {franquia.cidade}
                      </p>
                      <div className="text-[13px] text-gray-600 mt-2 space-y-1">
                        <p>
                          <b>CEP:</b> {franquia.codigo_postal}
                        </p>
                        <p>
                          <b>Email:</b> {franquia.email_contato}
                        </p>
                        <p>
                          <b>Telefone:</b> {franquia.telefone_contato}
                        </p>
                        <p>
                          <b>Status:</b>{' '}
                          <span
                            className={`${
                              franquia.status === 'Ativo'
                                ? 'text-green-600'
                                : 'text-red-600'
                            } font-semibold`}
                          >
                            {franquia.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mt-10">
                Nenhuma franquia encontrada com os filtros aplicados.
              </p>
            )}
          </div>

          {/* Painel lateral de filtros */}
          <aside
            className="hidden lg:flex flex-col w-64 bg-[#f1f1f1] rounded-[var(--borda-padrao)]
            shadow-inner p-6 sticky top-20 self-start max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-[#c1121f] mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtros
            </h2>

            <div className="flex flex-col gap-4 text-left">
              {/* Filtro de cidade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Cidade
                </label>
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full p-2 border rounded-[var(--borda-padrao)] text-sm focus:ring-1 focus:ring-[#c1121f]"
                >
                  <option>Todos</option>
                  {cidadesDisponiveis.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Filtro de status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-[var(--borda-padrao)] text-sm focus:ring-1 focus:ring-[#c1121f]"
                >
                  <option>Todos</option>
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>

              <button
                onClick={aplicarFiltros}
                className="mt-4 bg-[#c1121f] text-white py-2 rounded-[var(--borda-padrao)] hover:bg-[#780000] transition-all"
              >
                Aplicar Filtros
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
