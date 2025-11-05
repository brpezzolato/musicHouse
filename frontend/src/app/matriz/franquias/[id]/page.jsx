'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  ArrowLeft,
  User,
} from 'lucide-react';

export default function FranquiaDetalhes() {
  const { id } = useParams();
  const router = useRouter();
  const [franquia, setFranquia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFranquia() {
      try {
        const res = await fetch(`http://localhost:8080/franquias/${id}`);
        const data = await res.json();
        setFranquia(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da franquia:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchFranquia();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f4f4f4]">
        <p className="text-gray-600 text-lg">Carregando franquia...</p>
      </div>
    );
  }

  if (!franquia) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#f4f4f4] text-center">
        <p className="text-gray-600 text-lg mb-4">
          Nenhuma franquia encontrada.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-[#c1121f] text-white px-4 py-2 rounded-[var(--borda-padrao)] hover:bg-[#780000] transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] text-center">
      {/* Banner topo */}
      <section
        className="relative w-full h-48 sm:h-56 md:h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/catalogo/bannerfranquias.png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative text-white text-4xl sm:text-5xl font-bold italic z-10">
          Detalhes da Franquia
        </h1>
      </section>

      {/* Conteúdo */}
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-[1200px] mx-auto mt-10 mb-16 px-6">
        {/* Imagem da franquia */}
        <div className="flex justify-center md:justify-start w-full md:w-1/3">
          <div className="bg-white rounded-[var(--borda-padrao)] shadow-md p-6 w-full max-w-[320px]">
            <img
              src="/catalogo/fundoMadeira.png"
              alt="Imagem da franquia"
              className="w-full h-56 rounded-[var(--borda-padrao)] object-cover mb-4"
            />
            <p className="font-semibold text-lg text-[#111]">
              {franquia.endereco_completo}
            </p>
            <p className="italic text-gray-600">{franquia.cidade}</p>

            <div className="flex items-center justify-center gap-2 mt-6">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  franquia.status === 'Ativo'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {franquia.status}
              </span>
            </div>
          </div>
        </div>

        {/* Informações detalhadas */}
        <div className="flex-1 bg-white rounded-[var(--borda-padrao)] shadow-md p-8 text-left">
          <h2 className="text-2xl font-bold text-[#c1121f] mb-6">
            Informações da Franquia
          </h2>

          <div className="space-y-4 text-[15px] text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="text-[#c1121f]" size={18} />
              <span>
                <b>Endereço:</b> {franquia.endereco_completo}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="text-[#c1121f]" size={18} />
              <span>
                <b>Email:</b> {franquia.email_contato}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="text-[#c1121f]" size={18} />
              <span>
                <b>Telefone:</b> {franquia.telefone_contato}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="text-[#c1121f]" size={18} />
              <span>
                <b>Data de Registro:</b>{' '}
                {new Date(franquia.data_registro).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="text-[#c1121f]" size={18} />
              <span>
                <b>Última Atualização:</b>{' '}
                {new Date(franquia.atualizado_em).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="mt-8 flex gap-2">
              <button
                onClick={() => router.back()}
                className="bg-[#c1121f] text-white px-6 py-2 rounded-[var(--borda-padrao)] hover:bg-[#780000] transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={18} /> Voltar para franquias
              </button>

              {/* Novo botão que leva à página de funcionários */}
              <button
                onClick={() =>
                  router.push(`/matriz/franquias/${id}/funcionarios`)
                }
                className="bg-[#c1121f] text-white px-6 py-2 rounded-[var(--borda-padrao)] hover:bg-[#780000] transition-all flex items-center gap-2 cursor-pointer"
              >
                <User size={18} /> Funcionários
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
