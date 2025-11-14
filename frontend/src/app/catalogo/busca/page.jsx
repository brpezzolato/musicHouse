'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Produtos from '@/components/Produtos/Produtos';
import FooterCatalogo from '@/components/FooterCatalogo/FooterCatalogo';
import BuscaSkeleton from '@/components/Skeleton/Busca';
import InputBusca from '@/components/InputBusca/InputBusca';

export default function Busca() {
  const searchParams = useSearchParams();
  const valorBuscado = searchParams.get('termo');
  const [resultado, setResultado] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // const tipo = getCookie('funcao');
    // const token = getCookie('token');
    fetch(`http://localhost:8080/produtos/busca?termo=${valorBuscado}`, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((informacao) => {
        setResultado(informacao);
        setCarregando(false);
      })
      .catch((error) => console.error('Erro ao buscar produtos:', error));
  }, [valorBuscado]);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#f3f3f3] overflow-x-hidden transition-all duration-300">
          <InputBusca />
          {carregando === true ? (
            <>
              <div className="mt-7 mb-15">
                <BuscaSkeleton />
              </div>
            </>
          ) : (
            <div className="">
              {resultado.length > 0 ? (
                <div>
                  <div className="ms-[4%] mt-7">
                    <h1 className="text-4xl font-medium mb-2">
                      Você buscou por{' '}
                      <span className="text-[#c1121f]">"{valorBuscado}"</span>
                    </h1>
                    <p className="italic mb-5">
                      {resultado.length}{' '}
                      {resultado.length === 1
                        ? 'Resultado encontrado'
                        : 'Resultados encontrados'}
                    </p>
                  </div>
                  <div className="sm:ms-[0%] ms-[4%]">
                    <div className="body-produto">
                      <div
                        className="py-6 sm:py-8 lg:py-12"
                        style={{ paddingTop: '0' }}
                      >
                        <div className="mx-auto max-w-screen-xl px-6 ps-0">
                          <div className="flex flex-wrap justify-center md:justify-start gap-y-14 md:gap-x-[5%]">
                            <Produtos produtos={resultado} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="ms-[4%]">
                    <h1 className="text-4xl font-medium mb-2 mt-8">
                      Você buscou por{' '}
                      <span className="text-[#c1121f]">"{valorBuscado}"</span>
                    </h1>
                    <p className="italic">
                      {resultado.length}{' '}
                      {resultado.length === 1
                        ? 'Resultado encontrado'
                        : 'Resultados encontrados'}
                    </p>
                  </div>
                  <div className="flex justify-center items-center mb-20 mt-1">
                    <div className="w-80">
                      <img
                        src="/busca/semProdutos.png"
                        className="mt-18"
                        alt="Caixa de som quebrada"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <FooterCatalogo />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
