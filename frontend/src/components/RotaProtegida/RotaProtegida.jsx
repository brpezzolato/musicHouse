'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import Loading from '@/app/loading';
import './403.css';

export default function RotaProtegida({ permitido, children }) {
  const [tipoUser, setTipoUser] = useState(null);
  const [redirecionar, setRedirecionar] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const cookie = getCookie('token');
    if (cookie === undefined) {
      window.location.replace('/');
      return;
    }

    fetch(`http://localhost:8080/funcionarios/detalhes`, {

      cache: 'no-store',
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setTipoUser(data.id_credencial);
        } else {
          if (res.status === 440) {
            localStorage.setItem(
              'toastExpirado',
              'Login Expirado, Favor realiza-lo novamente!!!'
            );
            window.location.replace('/');
          }
          console.log('Erro ao carregar funcionario:', res.statusText);
        }
      })
      .catch((error) => {
        console.error('Erro na requisição:', error.message);
      })
      .finally(() => setCarregando(false));
  }, [permitido]);

  useEffect(() => {
    if (tipoUser === undefined || tipoUser === null) return;

    const redirecionamentos = {
      1: '/matriz',
      2: '/filial',
      3: '/pdv',
      4: '/catalogo',
    };

    setRedirecionar(redirecionamentos[tipoUser] || '/');
  }, [tipoUser]);

  if (carregando) {
    return <Loading />;
  }

  if (permitido != tipoUser && carregando === false) {
    return (
      <>
        <style>{`
        body {
         background-image: url('/notFound/not-found.png'); 
         background-size: cover; 
         background-repeat: no-repeat;
        }
      `}</style>

        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 py-10 gap-8">
          {/* BLOCO ESQUERDO */}
          <div className=" text-center shadow-md rounded-[var(--borda-padrao)] px-10 py-12 w-full max-w-[420px]">
            <h1 className="text-[120px] sm:text-[150px] font-black text-[var(--vermelho-vivo)] leading-none mb-2">
              403
            </h1>
            <p className="text-[var(--vermelho-vivo)] font-semibold text-lg sm:text-xl">
              opss! Você não tem permissão para acessar esta página
            </p>
            <p className="text-gray-600 text-sm mt-1 mb-6">
              volte para a página permitida.
            </p>

            <a
              href={redirecionar}
              className="bg-[var(--vermelho-vivo)] cursor-pointer hover:bg-[var(--vermelho-vivo)] hover:opacity-[0.9] hover:scale-[1.01] text-white px-9 py-2 rounded-[var(--borda-padrao)] text-base font-semibold"
            >
              Voltar!
            </a>
          </div>

          {/* IMAGEM DIREITA */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-[280px] sm:w-[340px] md:w-[420px] lg:w-[480px] object-contain"></div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
