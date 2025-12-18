'use client';

import 'swiper/css';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Produtos from '@/components/Produtos/Produtos';
import FooterCatalogo from '@/components/FooterCatalogo/FooterCatalogo';
import InputBusca from '@/components/InputBusca/InputBusca';
import { useParams } from 'next/navigation';
import CategoriaSkeleton from '@/components/Skeleton/Categoria';
import { useState, useEffect } from 'react';

export default function Page() {
  const params = useParams();
  const id = params.id;
  const [categoria, setCategoria] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarCategoria();
  }, [id]);

  function carregarCategoria() {
    fetch(`http://localhost:8080/categorias/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((informacao) => {
        setCategoria(informacao);
        setCarregando(false);
      })
      .catch((error) => console.error('Erro ao buscar produtos:', error));

    fetch(`http://localhost:8080/produtos/categoria?categoria=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((informacao) => {
        setProdutos(informacao);
        setCarregando(false);
        console.log(informacao);
      })
      .catch((error) => console.error('Erro ao buscar produtos:', error));
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f3f3f3] overflow-x-hidden transition-all duration-300">
        <InputBusca />
        {carregando == true ? (
          <CategoriaSkeleton />
        ) : (
          <div className="mt-5 mb-15">
            <div className="px-4 flex flex-col gap-y-2 text-center md:text-left md:ml-5">
              <h1 className="text-4xl font-bold text-gray-800">
                Instrumentos de{' '}
                <span className="text-[#c1121f]">{categoria.nome}</span>
              </h1>

              <p className="italic text-gray-600 md:text-lg">
                Foram encontrados {produtos.length} instrumentos na categoria de{' '}
                {categoria.nome}
              </p>
            </div>

            <div className="mt-8 px-4 flex flex-wrap justify-center gap-10 md:ms-8">
              <Produtos produtos={produtos} />
            </div>
          </div>
        )}
        <FooterCatalogo />
      </SidebarInset>
    </SidebarProvider>
  );
}
