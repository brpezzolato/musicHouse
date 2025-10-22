'use client';

import 'swiper/css';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Produtos from '@/components/Produtos/Produtos';
import FiltroCategorias from '@/components/FiltroCategorias/FiltroCategorias';
import FooterCatalogo from '@/components/FooterCatalogo/FooterCatalogo';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [busca, setBusca] = useState('');
  const router = useRouter();

  function buscar() {
    window.location.href = '/catalogo/busca?query=' + encodeURIComponent(busca);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f3f3f3] overflow-x-hidden transition-all duration-300">
        <img
          src="/catalogo/banAtendimento.png"
          alt="Banner"
          className="w-full h-auto object-cover"
          draggable={false}
        />

        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-[#f3f3f3] transition-all duration-300 border-b border-transparent overflow-hidden mt-9">
          <div className="flex items-center gap-2 w-full max-w-[1200px] mx-auto">
            <SidebarTrigger className="mr-2 bg-white text-[#c1121f] p-7 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#c1121f]/60 hover:ring-2 hover:ring-[#c1121f]/40 hover:shadow-[0_0_12px_2px_rgba(193,18,31,0.3)] hover:bg-white hover:text-[#780000] focus:bg-whiteactive:bg-white transition-all duration-300" />

            <Breadcrumb className="flex-1">
              <div className="w-full mx-auto">
                <div className="relative">
                  <button
                    type="button"
                    onClick={buscar}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c1121f] hover:text-[#780000] transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </button>

                  <input
                    type="search"
                    id="search"
                    value={busca}
                    onChange={(e) => {
                      setBusca(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && buscar()}
                    placeholder="Buscar instrumentos, marcas..."
                    className="block w-full rounded-lg border border-transparent bg-white p-4 pl-12 text-sm text-[#c1121f] placeholder-[#c1121f]/80 focus:outline-none focus:ring-2 focus:ring-[#c1121f]/60 hover:ring-2 hover:ring-[#c1121f]/40 hover:shadow-[0_0_12px_2px_rgba(193,18,31,0.3)] transition-all duration-300"
                  />
                </div>
              </div>
            </Breadcrumb>

            <div>
              <FiltroCategorias />
            </div>
          </div>
        </header>

        <div className="-mb-10 md:-mb-11 mt-10 ">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-4 lg:text-3xl">
            Instrumentos de <span className="text-[#c1121f] ">cordas</span>
          </h2>

          <p className="mx-auto max-w-screen-md text-center text-gray-600 md:text-lg ">
            Foram encontrados xx instrumentos na categoria de cordas
          </p>
        </div>
        <Produtos />

        <FooterCatalogo />
      </SidebarInset>
    </SidebarProvider>
  );
}
