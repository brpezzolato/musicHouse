'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Busca() {
  const searchParams = useSearchParams();
  const valorBuscado = searchParams.get('termo');
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    // const tipo = getCookie('funcao');
    // const token = getCookie('token');
    fetch(`http://localhost:8080/meusChamados?termo=${valorBuscado}`, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((informacao) => {
        setResultado(informacao);
      })
      .catch((error) => console.error('Erro ao buscar produtos:', error));
  }, [valorBuscado]);

  // function exibirResultado() {
  //   if (resultado.length > 0) {
  //     return (
  //       <div className="d-flex flex-wrap gap-5 justify-content-center pt-5">
  //         {resultado.map((item, index) => (
  //           <Card key={index} item={item} />
  //         ))}
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div className="d-flex justify-content-center align-items-center nao-encontrado">
  //         <h2>
  //           <span>Nenhum</span> filme encontrado, desculpe.
  //         </h2>
  //       </div>
  //     );
  //   }
  // }

  return (
    <>
      <h1>{valorBuscado}</h1>
      <div>{resultado}</div>
    </>
  );
}
