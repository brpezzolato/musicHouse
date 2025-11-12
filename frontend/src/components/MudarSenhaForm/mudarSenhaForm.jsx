'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function MudarSenhaForm(){
    const [novaSenha, setNovaSenha] = useState('')
    const [id_registro, setIdRegistro] = useState('')
    const router = useRouter();

async function mudarSenha(event){
    event.preventDefault();

    try{
        const response = await fetch('http://localhost:8080/auth/alterar-senha-primeiro-acesso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({id_registro, novaSenha}),            
        });

        if(response.ok){
          return  router.replace('/')
        } else {
            console.log('Erro ao mudar senha:', response.statusText);
        }

    }catch(error){
        console.error('Erro ao mudar senha:', error);
    }
}


return(
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


      
    <form action="" className="h-screen" onSubmit={mudarSenha}>
        <input type="text" 
        name="id_registro"
        value={id_registro}
        placeholder="id registro"
        onChange={(e) => setIdRegistro(e.target.value)}
        />
        <input type="password" 
        name ="senha"
        value={novaSenha}
        placeholder="Senha"
        onChange={(e) => setNovaSenha(e.target.value)}
        />

        <button type="submit">Mudar Senha</button>
    </form>
    </>
)
}