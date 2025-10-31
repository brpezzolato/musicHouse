import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import 'swiper/css';

export default function CategoriaCatalogo({ cards }) {
  return (
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
              <Link href={`/catalogo/categoria/${card.id_categoria}`}>
                <div className="mt-2 mb-2 w-50 h-60 max-w-xs mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 cursor-pointer hover:scale-105 transition-transform duration-300">
                  <img
                    className="object-cover w-full"
                    src={`http://localhost:8080/uploads/iconesCategorias/${card.icone}`}
                    alt={card.nome}
                  />
                  <div className="py-5 text-left">
                    <h2 className="ml-6 block text-xl font-bold text-[#c1121f]">
                      {card.nome}
                    </h2>
                    <span className=" ml-6 text-sm text-[#c1121f]">
                      {card.descricao}
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
