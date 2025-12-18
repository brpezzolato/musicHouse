'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MudarSenhaForm() {

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const [idRegistro, setIdRegistro] = useState('');
  const router = useRouter();


  useEffect(() => {
    const id = localStorage.getItem("id_registro");
    if (!id) {
      console.warn("Nenhum ID encontrado no localStorage!");
    }
    setIdRegistro(id);
  }, []);

  async function mudarSenha(event) {
    event.preventDefault();

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não são iguais.");
      return;
    }

    if (!idRegistro) {
      console.error("ID não encontrado no localStorage!");
      return;
    }

    setErro("");

    try {
      const response = await fetch('http://localhost:8080/auth/alterar-senha-primeiro-acesso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id_registro: idRegistro,
          novaSenha
        }),
      });

      if (response.ok) {
        localStorage.removeItem("id_registro");
        router.replace('/');
      } else {
        console.error('Erro ao mudar senha:', await response.text());
      }

    } catch (error) {
      console.error('Erro ao mudar senha:', error);
    }
  }

  return (
    <>
      <style>{`
        body {
          background-image: url('/abrirCaixa/abrirCaixa.png');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: bottom;
        }
        input:focus {
          outline: none;
        }
      `}</style>

      <form
        className="h-screen flex flex-col justify-center items-center gap-4"
        onSubmit={mudarSenha}
      >

        {/* Imagem agora vem primeiro */}
        <img
          src="/logos/logoEscritaBranca.png"
          alt="Music House"
          className="w-48 mb-6" // A margem inferior separa a imagem do formulário
        />


        <p className="text-[#FDF0D5] tracking-widest mb-8 w-70 text-left">
           DEFINA SUA NOVA SENHA PARA  CONCLUIR O PRIMEIRO ACESSO
        </p>

        {/* Campo SENHA */}
        <Input
          type="password"
          placeholder="SENHA"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          className="bg-[#FDF0D5] text-[#c1121f] tracking-[0.2em] border-none rounded-none 
          text-center py-6 w-[300px] focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Campo CONFIRMAR SENHA */}
        <Input
          type="password"
          placeholder="CONFIRMAR SENHA"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className="bg-[#FDF0D5] text-[#c1121f] tracking-[0.2em] border-none rounded-none 
          text-center py-6 w-[300px] focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Exibir erro se houver */}
        {erro && (
          <p className="text-[#FDF0D5]  mt-2">{erro}</p>
        )}

        <Button
          type="submit"
          className="bg-[var(--azul-marinho)] text-[#FDF0D5] py-6 rounded-none tracking-[0.2em] 
          hover:bg-[var(--azul-marinho)] hover:opacity-[0.9] hover:scale-[1.01] cursor-pointer 
          transition-all w-[300px]"
        >
          Mudar Senha
        </Button>

      </form>
    </>
  );
}
