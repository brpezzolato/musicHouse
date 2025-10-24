'use client';

import Link from 'next/link';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AppSidebar } from '@/components/app-sidebar';
import { SlidersHorizontal } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Produtos from '@/components/Produtos/Produtos';
import FiltroCategorias from '@/components/FiltroCategorias/FiltroCategorias';
import FooterCatalogo from '@/components/FooterCatalogo/FooterCatalogo';
import SvgHype from '@/components/Produtos/svgHype';

export default function Page() {
  const cards = [
    {
      name: 'Cordas',
      role: 'Toque que emociona.',
      image: '/catalogo/iconCordas.png',
    },
    {
      name: 'Percussão',
      role: 'Ritmo que pulsa.',
      image: '/catalogo/iconPercussao.png',
    },
    {
      name: 'Teclas',
      role: 'Na pontas dos dedos.',
      image: '/catalogo/iconTeclas.png',
    },
    {
      name: 'Sopro',
      role: 'Som que vem do fôlego.',
      image: '/catalogo/iconSopro.png',
    },
    {
      name: 'Áudio',
      role: 'Clareza em cada nota.',
      image: '/catalogo/iconAudio.png',
    },
    {
      name: 'Acessórios',
      role: 'O apoio do seu som.',
      image: '/catalogo/iconAcessorio.png',
    },
  ];

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
              <form
                className="w-full mx-auto"
                action="/catalogo/busca"
                // method="GET"
              >
                <div className="relative">
                  <button
                    type="submit"
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
                    name="termo"
                    id="search"
                    placeholder="Buscar instrumentos, marcas..."
                    className="block w-full rounded-lg border border-transparent bg-white p-4 pl-12 text-sm text-[#c1121f] placeholder-[#c1121f]/80 focus:outline-none focus:ring-2 focus:ring-[#c1121f]/60 hover:ring-2 hover:ring-[#c1121f]/40 hover:shadow-[0_0_12px_2px_rgba(193,18,31,0.3)] transition-all duration-300"
                  />
                </div>
              </form>
            </Breadcrumb>

            <FiltroCategorias />
          </div>
        </header>

        <div className="w-full overflow-x-hidden px-4 sm:px-8 py-10 transition-all duration-300">
          <div className="max-w-[1200px] mx-auto">
            <Swiper
              spaceBetween={20}
              slidesPerView={3}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 10 },
                270: { slidesPerView: 1.2, spaceBetween: 10 },
                330: { slidesPerView: 1.5, spaceBetween: 10 },
                410: { slidesPerView: 1.9, spaceBetween: 10 },
                450: { slidesPerView: 2.1, spaceBetween: 10 },
                500: { slidesPerView: 2.3, spaceBetween: 10 },
                590: { slidesPerView: 2.7, spaceBetween: 10 },
                670: { slidesPerView: 3, spaceBetween: 10 },
                720: { slidesPerView: 3.2, spaceBetween: 10 },
                767: { slidesPerView: 2.1, spaceBetween: 10 },
                780: { slidesPerView: 2.3, spaceBetween: 12 },
                860: { slidesPerView: 2.7, spaceBetween: 12 },
                920: { slidesPerView: 3, spaceBetween: 12 },
                972: { slidesPerView: 3.2, spaceBetween: 8 },
                1000: { slidesPerView: 3.4, spaceBetween: 15 },
                1090: { slidesPerView: 3.8, spaceBetween: 10 },
                1180: { slidesPerView: 4, spaceBetween: 13 },
                1280: { slidesPerView: 4.5, spaceBetween: 20 },
              }}
              className="w-full"
            >
              {cards.map((card, i) => (
                <SwiperSlide key={i}>
                  <Link href="#">
                    <div className="mt-2 mb-2 w-50 h-60 max-w-xs mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 cursor-pointer hover:scale-105 transition-transform duration-300">
                      <img
                        className="object-cover w-full"
                        src={card.image}
                        alt={card.name}
                      />
                      <div className="py-5 text-left">
                        <h2 className="ml-6 block text-xl font-bold text-[#c1121f]">
                          {card.name}
                        </h2>
                        <span className=" ml-6 text-sm text-[#c1121f]">
                          {card.role}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="-mb-10 md:-mb-11 mt-10 ">
          <h2 className="text-center text-2xl font-bold text-gray-800 lg:text-3xl">
            Instrumentos <span className="text-[#c1121f] ">mais hypados</span>
            <span>
              <SvgHype />
            </span>
          </h2>

          <p className="mx-auto max-w-screen-md text-center text-gray-600 md:text-lg ">
            Veja aqui nossos principais instrumentos
          </p>
        </div>
        <Produtos />

        <FooterCatalogo />
      </SidebarInset>
    </SidebarProvider>
  );
}
