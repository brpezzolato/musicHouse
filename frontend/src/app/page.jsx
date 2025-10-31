'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins } from 'lucide-react';

export default function AbrirCaixa() {
  const [etapa, setEtapa] = useState(1);
  const [registro, setRegistro] = useState('');
  const [senha, setSenha] = useState('');

  const handleAbrirCaixa = () => setEtapa(2);

  const handleLogin = () => {
    if (registro && senha) {
      console.log('Login enviado:', { registro, senha });
    }
  };

  return (
    <>
      <style>{`
        body {
          background-image: url('/abrirCaixa/abrirCaixa.png');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: bottom;
        }
        input[type=number]::-webkit-inner-spin-button{
          appearance: none; 
        }
      `}</style>

      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <img
          src="/logos/logoEscritaBranca.png"
          alt="Music House"
          className="w-48 mb-6"
        />

        {etapa === 1 ? (
          <>
            <Coins className="w-16 h-16 text-[#FDF0D5] mb-4" />
            <p className="text-[#FDF0D5] tracking-widest mb-8">
              APERTE O BOTÃO PARA <br /> ACESSAR O CAIXA
            </p>

            <Button
              onClick={handleAbrirCaixa}
              className="bg-[var(--bege-claro)] text-[var(--vermelho-vivo)] font-semibold py-6 px-10 rounded-none hover:bg-[var(--bege-claro)] hover:opacity-[0.9] hover:scale-[1.01] cursor-pointer transition-all"
            >
              ABRIR CAIXA
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-[250px] mt-4">
              <Input
                placeholder="N° REGISTRO"
                type="number"
                value={registro}
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
              <Button
                onClick={handleLogin}
                className="bg-[var(--azul-marinho)] text-[#FDF0D5] py-6 rounded-none tracking-[0.2em] hover:bg-[var(--azul-marinho)] hover:opacity-[0.9] hover:scale-[1.01] cursor-pointer transition-all"
              >
                ABRIR CAIXA
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
