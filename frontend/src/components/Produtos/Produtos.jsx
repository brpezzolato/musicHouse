'use client';
import 'swiper/css';
import { useState } from 'react';
import { Tag } from 'lucide-react';
export default function Page({ produtos }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const toggleTooltip = (event) => {
    event.preventDefault();
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <div className="body-produto">
      <div className="py-6 sm:py-8 lg:py-12" style={{ paddingTop: '0' }}>
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-8 justify-left">
            {produtos.map((produto) => (
              <div key={produto.id_produto} className="relative group">
                <a
                  href="#"
                  className="block h-64 w-64 overflow-hidden bg-gray-100 rounded"
                >
                  <img
                    src={'/catalogo/violao-nylon-frente-sem-fundo.png'}
                    loading="lazy"
                    alt={produto.nome}
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                    draggable={false}
                  />

                  {produto.desconto && (
                    <div
                      onClick={(event) => toggleTooltip(event)}
                      className="absolute top-0 left-0 z-20 shadow-md flex items-center justify-center bg-red-600 p-3 rounded-full cursor-pointer duration-300 mt-2 ml-2 transform"
                    >
                      <Tag
                        fill="none"
                        className="fill-white"
                        height="20px"
                        width="20px"
                      />
                    </div>
                  )}

                  {isTooltipVisible && produto.desconto && (
                    <div className="absolute ml-12 -mt-62 left-1/2 transform -translate-x-30 z-10 opacity-100 duration-300">
                      <div className="absolute top-0 left-0 z-10 flex items-center gap-2 bg-red-600 bg-opacity-70 p-3 rounded cursor-pointer">
                        <span className="text-white text-sm uppercase">
                          {produto.desconto}
                        </span>
                      </div>
                    </div>
                  )}
                </a>

                <div className="flex items-start justify-between gap-2 bg-gray-100 p-4 w-64">
                  <div className="flex flex-col">
                    <span className="italic text-xs text-gray-700 xs:text-base">
                      {produto.descricao}
                    </span>
                    <a
                      href="#"
                      className="font-bold text-gray-800 transition duration-100 hover:text-[#c1121f] lg:text-lg"
                    >
                      {produto.nome}
                    </a>
                    <span className="text-[#c1121f] base:text-base italic">
                      R$ {produto.valor.replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <ul role="list" className="flex gap-3"></ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
