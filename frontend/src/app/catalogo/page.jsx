'use client';

import Link from 'next/link';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Produtos from '@/components/Produtos/Produtos';
import FooterCatalogo from '@/components/FooterCatalogo/FooterCatalogo';
import SvgHype from '@/components/Produtos/svgHype';
import InputBusca from '@/components/InputBusca/InputBusca';

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
        <InputBusca />
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
        {/* <Produtos /> */}
        <FooterCatalogo />
      </SidebarInset>
    </SidebarProvider>
  );
}
