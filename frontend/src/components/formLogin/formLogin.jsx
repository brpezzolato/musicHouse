'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { redirect } from "next/navigation";

export default function FormLogin() {
    const [etapa, setEtapa] = useState(1);
    const [id_registro, setRegistro] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter()

    const handleAbrirCaixa = () => setEtapa(2);


    async function handleLogin(event) {
        try {
            event.preventDefault()
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ id_registro, senha })
            })

            const data = await response.json()
            console.log(data)
            if (data.etapa === 'codigo') {
                return router.replace('/token-primeiro-login')
            } else{
                if(data.funcionario.id_credencial === 1){
                    return redirect("/matriz");
                }

                if(data.funcionario.id_credencial === 2){
                    return redirect("/afilial");
                }

                if(data.funcionario.id_credencial === 3){
                    return redirect("/pdv");
                }

            }


        } catch (error) {
            console.error('Erro ao enviar informações de login:', error);
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
                        <form className="flex flex-col gap-4 w-[250px] mt-4" onSubmit={handleLogin}>
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
                            <Button
                                className="bg-[var(--azul-marinho)] text-[#FDF0D5] py-6 rounded-none tracking-[0.2em] hover:bg-[var(--azul-marinho)] hover:opacity-[0.9] hover:scale-[1.01] cursor-pointer transition-all"
                            >
                                Realizar Login
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </>
    );
}
