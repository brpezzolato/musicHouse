'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idCredencial, setIdCredencial] = useState('');

  async function chamado() {
    const dados = JSON.stringify({});

    try {
      const response = await fetch('http://localhost:8080/chamado', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        //   Authorization: 'Bearer ' + cookieJWT,
        // },
        body: dados,
      });

      const data = await response.json();
      if (response.ok) {
      } else {
      }
    } catch (error) {}
  }
  return (
    <>
      <div className="flex justify-center my-5">
        <h1 className="text-[40px]">Cadastrar Funcionario</h1>
      </div>

      <div className="flex flex-col gap-6 justify-center p-10">
        <div className="">
          <label htmlFor="funcionario" className="me-5">
            Nome do funcionario:
          </label>
          <input
            type="text"
            className="border-1 border-black p-[3px] rounded-2xl ps-3"
            placeholder="Nome do funcionario"
            name="funcionario"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="">
          <label htmlFor="funcionario" className="me-5">
            E-mail do funcionario:
          </label>
          <input
            type="text"
            className="border-1 border-black p-[3px] rounded-2xl ps-3"
            placeholder="Nome do funcionario"
            name="funcionario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="">
          <label htmlFor="funcionario" className="me-5">
            Telefone do funcionario:
          </label>
          <input
            type="text"
            className="border-1 border-black p-[3px] rounded-2xl ps-3"
            placeholder="Nome do funcionario"
            name="funcionario"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className="">
          <label htmlFor="funcionario" className="me-5">
            Função do funcionario:
          </label>
          <input
            type="text"
            className="border-1 border-black p-[3px] rounded-2xl ps-3"
            placeholder="Nome do funcionario"
            name="funcionario"
            value={idCredencial}
            onChange={(e) => setIdCredencial(e.target.value)}
          />
        </div>
        <div className="">
          <button
            type="submit"
            className="w-[370px] bg-blue-800 text-white pt-[5px] pb-[5px] rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
