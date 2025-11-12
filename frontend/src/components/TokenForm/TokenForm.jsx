"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TokenForm() {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [mensagem, setMensagem] = useState("");
  const [verificando, setVerificando] = useState(false);
  const router = useRouter();

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const novoCodigo = [...codigo];
      novoCodigo[index] = value;
      setCodigo(novoCodigo);

    
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  async function verificarToken(event) {
    event.preventDefault();
    const token = codigo.join("");
    setVerificando(true);
    setMensagem("");

    try {
      const response = await fetch("http://localhost:8080/auth/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ codigo: token }),
      });

      const data = await response.json();
      if (response.ok) {
        router.replace("/mudar-senha-primeiro-login");
      } else {
        setMensagem(`Erro: ${data.message || "Token inválido."}`);
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor.");
    } finally {
      setVerificando(false);
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

        input[type=number]::-webkit-inner-spin-button {
          appearance: none;
        }

        input:focus {
          outline: none;
        }
      `}</style>

      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={verificarToken}
          className="bg-[var(--vinho-escuro)] text-white p-10 rounded-2xl shadow-xl w-[90%] max-w-md border border-[var(--vinho-escuro)]"
        >
          <h2 className="text-2xl font-semibold mb-2 text-center text-[var(--vermelho-vivo)]">
            Verifique seu e-mail
          </h2>

          <div className="text-gray-300 text-center mb-6">
            <p className="text-sm">
              Digite o código de 6 dígitos enviado ao seu e-mail.
            </p>
          </div>

          <div className="flex justify-between mb-6 gap-2 sm:gap-3">
            {codigo.map((num, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                value={num}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold rounded-xl 
                 bg-[var(--verde-profundo)] border-2 border-[var(--vermelho-vivo)]
                 focus:border-[var(--dourado)] text-[var(--dourado)] 
                 transition-all duration-300 shadow-md hover:scale-105"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verificando}
            className={`w-full py-3 rounded-md text-white font-semibold transition-all duration-300 ${
              verificando
                ? "bg-[var(--vermelho-vivo)] opacity-70 cursor-not-allowed"
                : "bg-[var(--vermelho-vivo)] hover:brightness-125"
            }`}
          >
            {verificando ? "Verificando..." : "Verificar"}
          </button>

          {mensagem && (
            <p className="mt-4 text-center text-red-400 text-sm">{mensagem}</p>
          )}
        </form>
      </div>
    </>
  );
}
