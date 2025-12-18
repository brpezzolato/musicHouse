'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins, ClockAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next/client';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function FormLogin() {
  const [etapa, setEtapa] = useState(1);
  const [id_registro, setRegistro] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleAbrirCaixa = () => setEtapa(2);

  async function handleLogin(event) {
    event.preventDefault();
    setErro('');

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id_registro, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro('Registro ou senha incorretos.');
        return;
      }

      if (data.etapa === 'codigo') {
        return router.replace('/token-primeiro-login');
      }

      const cred = data.funcionario?.id_credencial;

      const cookie = getCookie('token');
      if (cred === 3) {
        try {
          const response = await fetch('http://localhost:8080/caixas', {
            method: 'POST',
            headers: {
              cookie: cookie,
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Sessão do caixa criada:', data);
          } else {
            alert('Erro ao criar sessão do caixa');
            return;
          }
        } catch {
          console.log('Erro ao criar sessão do caixa');
        }
      }

      if (cred === 1) return router.replace('/matriz');
      if (cred === 2) return router.replace('/filial');
      if (cred === 3) return router.replace('/pdv');
      if (cred === 4) return router.replace('/catalogo');
    } catch (error) {
      console.error('Erro ao enviar informações de login:', error);
      setErro('Erro ao conectar com o servidor.');
    }
  }

  useEffect(() => {
    const expirado = localStorage.getItem('toastExpirado');

    if (!expirado) return;
    toast.custom(
      (t) => (
        <div className="bg-white w-[22rem] p-4 rounded-2xl shadow-lg flex items-start gap-2 border border-gray-100">
          <div className="flex items-center justify-center w-10 h-10 rounded-full text-[var(--vermelho-vivo)]">
            <ClockAlert className="w-7 h-7" />
          </div>

          <div className="flex flex-col text-left">
            <p className="text-[15px] font-semibold text-gray-900">
              Login expirado
            </p>
            <p className="text-[13px] text-gray-600">{expirado}</p>
          </div>
        </div>
      ),
      { position: 'top-right', duration: 4000 }
    );
    setTimeout(() => {
      localStorage.removeItem('toastExpirado');
    }, 4000);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-login">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <img
            src="/logos/logoEscritaBranca.png"
            alt="Music House"
            className="w-48 mb-6"
          />

          <Toaster />
          {etapa === 1 ? (
            <>
              <Coins className="w-16 h-16 text-[#FDF0D5] mb-4" />
              <p className="text-[#FDF0D5] tracking-widest mb-8">
                APERTE O BOTÃO PARA <br /> ACESSAR SUA CONTA
              </p>

              <Button
                onClick={handleAbrirCaixa}
                className="bg-[var(--bege-claro)] text-[var(--vermelho-vivo)] font-semibold py-6 px-10 rounded-none hover:bg-[var(--bege-claro)] hover:opacity-[0.9] hover:scale-[1.01] cursor-pointer transition-all"
              >
                ACESSAR LOGIN
              </Button>
            </>
          ) : (
            <>
              <form
                className="flex flex-col gap-4 w-[250px] mt-4"
                onSubmit={handleLogin}
              >
                <Input
                  placeholder="N° REGISTRO"
                  type="number"
                  value={id_registro}
                  onChange={(e) => setRegistro(e.target.value)}
                  className="bg-[#FDF0D5] text-[#c1121f] tracking-[0.2em] border-none rounded-none text-center py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <Input
                  type="password"
                  placeholder="SENHA"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="bg-[#FDF0D5] text-[#c1121f] tracking-[0.2em] border-none rounded-none text-center py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <div className="min-h-[22px] mt-1">
                  {erro && (
                    <p className="text-[#FDF0D5] text-sm tracking-wide">
                      {erro}
                    </p>
                  )}
                </div>

                <Button className="bg-[var(--azul-marinho)] text-[#FDF0D5] py-6 rounded-none tracking-[0.2em] hover:bg-[var(--azul-marinho)] hover:opacity-[0.9] hover:scale-[1.01] cursor-pointer transition-all">
                  Realizar Login
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
