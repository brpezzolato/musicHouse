import { useEffect, useState } from 'react';
import Produtos from '@/components/Produtos/Produtos';

export default function maisVendidos() {
  const [maisVendidos, setMaisVendidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/produtos/hypados`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((informacao) => {
        setMaisVendidos(informacao);
        setCarregando(false);
      })
      .catch((error) => console.error('Erro ao buscar produtos:', error));
  }, []);

  return (
    <>
      {carregando === true ? (
        <div>Carregando...</div>
      ) : (
        <Produtos produtos={maisVendidos} />
      )}
    </>
  );
}
