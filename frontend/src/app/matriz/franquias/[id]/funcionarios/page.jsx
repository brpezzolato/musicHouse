'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone } from 'lucide-react';

export default function FuncionariosFranquia() {
  const { id } = useParams();
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const res = await fetch(
          `http://localhost:8080/funcionarios/franquias/${id}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setFuncionarios(data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f4f4f4]">
        <p className="text-gray-600 text-lg">Carregando funcionários...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] text-center">
      <section
        className="relative w-full h-48 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/catalogo/bannerfranquias.png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative text-white text-4xl sm:text-5xl font-bold italic z-10">
          Funcionários da Franquia #{id}
        </h1>
      </section>

      <div className="flex flex-col items-center gap-6 w-full max-w-[1200px] mx-auto mt-10 mb-16 px-6">
        <button
          onClick={() => router.back()}
          className="bg-[#c1121f] text-white px-5 py-2 rounded-[var(--borda-padrao)] hover:bg-[#780000] transition-all flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        {mensagem ? (
          <p className="text-gray-600 text-lg mt-10">{mensagem}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {funcionarios.map((f) => (
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
                    <Phone className="w-4 h-4 text-[#c1121f]" /> {f.telefone}
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
        )}
      </div>
    </div>
  );
}
