'use client';

import 'swiper/css';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import Produtos from '@/components/Produtos/Produtos';
import FooterCatalogo from '@/components/FooterCatalogo/FooterCatalogo';
import InputBusca from '@/components/InputBusca/InputBusca';

export default function Page() {
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
        <InputBusca />
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
