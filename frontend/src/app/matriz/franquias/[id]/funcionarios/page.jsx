'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, ChevronDown, Filter } from 'lucide-react';

export default function FuncionariosFranquia() {
  const { id } = useParams();
  const router = useRouter();

  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionariosFiltrados, setFuncionariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [cargoSelecionado, setCargoSelecionado] = useState('Todos');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const res = await fetch(
          `http://localhost:8080/funcionarios/franquias/${id}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setFuncionarios(data);
          setFuncionariosFiltrados(data);
        } else {
          setMensagem(data.mensagem || 'Nenhum funcionário encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        setMensagem('Erro ao buscar funcionários.');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchFuncionarios();
  }, [id]);

  function aplicarFiltros() {
    let filtrados = [...funcionarios];

    if (cargoSelecionado !== 'Todos') {
      filtrados = filtrados.filter(
        (f) => f.cargo?.toLowerCase() === cargoSelecionado.toLowerCase()
      );
    }

    setFuncionariosFiltrados(filtrados);
  }

  const scrollToContent = () => {
    const section = document.getElementById('conteudo-funcionarios');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f4f4f4]">
        <p className="text-gray-600 text-lg">Carregando funcionários...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] text-center">
      {/* ================= HERO ================= */}
      <section
        className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('/catalogo/bannerfranquias.png')" }}
      >
        {/* overlay escuro */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col items-center px-4">
          <h1 className="text-white text-6xl font-extrabold italic drop-shadow-lg">
            Funcionários
          </h1>
          <p className="text-gray-200 mt-4 text-lg font-medium max-w-[700px]">
            Equipe da franquia <b>#{id}</b> da <b>Music House</b>
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

      {/* ============ CONTEÚDO ============ */}
      <section id="conteudo-funcionarios" className="bg-[#f4f4f4]">
        <div className="flex flex-1 w-full max-w-[1400px] mx-auto gap-6 mt-8 px-4 pb-16">
          {/* LISTA DE FUNCIONÁRIOS */}
          <div className="flex flex-col flex-1 items-center">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-8 gap-4">
              <button
                onClick={() => router.back()}
                className="bg-[#c1121f] text-white px-5 py-2 rounded-[var(--borda-padrao)] hover:bg-[#780000] transition-all flex items-center gap-2"
              >
                <ArrowLeft size={18} /> Voltar
              </button>
            </div>

            {mensagem ? (
              <p className="text-gray-600 text-lg mt-10">{mensagem}</p>
            ) : funcionariosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {funcionariosFiltrados.map((f) => (
                  <div
                    key={f.id_registro}
                    className="bg-white rounded-[var(--borda-padrao)] shadow-md p-6 flex flex-col items-center transition-transform hover:scale-[1.02]"
                  >
                    <img
                      src={f.fotoFuncionario || '/catalogo/fundoMadeira.png'}
                      alt={f.nome_completo}
                      className="w-20 h-20 rounded-full object-cover mb-4 border border-gray-300"
                    />
                    <h3 className="text-lg font-semibold text-[#111]">
                      {f.nome_completo}
                    </h3>
                    <p className="text-sm italic text-gray-600 mb-2">
                      {f.cargo || 'Cargo não informado'}
                    </p>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="flex items-center gap-1 justify-center">
                        <Mail className="w-4 h-4 text-[#c1121f]" /> {f.email}
                      </p>
                      <p className="flex items-center gap-1 justify-center">
                        <Phone className="w-4 h-4 text-[#c1121f]" />{' '}
                        {f.telefone}
                      </p>
                    </div>
                    <span
                      className={`mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
                        f.status === 'Ativo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mt-10">
                Nenhum funcionário encontrado para este cargo.
              </p>
            )}
          </div>

          {/* PAINEL LATERAL DE FILTROS */}
          <aside
            className="hidden lg:flex flex-col w-64 bg-[#f1f1f1] rounded-[var(--borda-padrao)]
            shadow-inner p-6 sticky top-20 self-start max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-[#c1121f] mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtros
            </h2>

            <div className="flex flex-col gap-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Cargo
                </label>
                <select
                  value={cargoSelecionado}
                  onChange={(e) => setCargoSelecionado(e.target.value)}
                  className="w-full p-2 border rounded-[var(--borda-padrao)] text-sm focus:ring-1 focus:ring-[#c1121f]"
                >
                  <option>Todos</option>
                  <option>Administrador</option>
                  <option>Gerente de Loja</option>
                  <option>Caixa</option>
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
