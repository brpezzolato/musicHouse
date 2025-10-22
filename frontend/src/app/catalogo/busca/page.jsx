'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaginaDeBusca() {
  const searchParams = useSearchParams();
  const termoBuscado = searchParams.get('query'); // Mesmo nome do parâmetro da URL
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    if (termoBuscado) {
      console.log('Realizando busca por:', termoBuscado);
      // Aqui você colocaria a lógica para buscar os produtos
      // em uma API ou no seu banco de dados.
    }
  }, [termoBuscado]); // Roda o efeito sempre que o termo buscado mudar

  return (
    <div>
      <h1>Resultados para: "{termoBuscado}"</h1>
      {/* Aqui você vai listar os produtos encontrados no estado 'resultados' */}
    </div>
  );
}