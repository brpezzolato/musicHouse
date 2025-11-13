'use client';
import 'swiper/css';
import { useState } from 'react';
import { Tag } from 'lucide-react';

export default function Page({ produtos }) {
  const [tooltipAberto, setTooltipAberto] = useState(null);

  const toggleTooltip = (event, idProduto) => {
    event.preventDefault();
    setTooltipAberto((atual) => (atual === idProduto ? null : idProduto));
  };

  return (
    <>
      {produtos.map((produto) => (
        <div key={produto.id_produto} className="relative group">
          <a
            href={`/catalogo/produto/${produto.id_produto}`}
            className="block h-64 w-64 overflow-hidden bg-gray-100 rounded relative"
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
                onClick={(event) => toggleTooltip(event, produto.id_produto)}
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

            {tooltipAberto === produto.id_produto && produto.desconto && (
              <div className="absolute ml-12 -mt-62 left-1/2 transform -translate-x-30 z-10 opacity-100 duration-300">
                <div className="absolute top-0 left-0 z-10 flex items-center gap-2 bg-red-600 bg-opacity-70 p-3 rounded cursor-pointer shadow-lg">
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
                href={`produto/${produto.id_produto}`}
                className="font-bold text-gray-800 transition duration-100 hover:text-[#c1121f] lg:text-lg"
              >
                {produto.nome}
              </a>
              <span className="text-[#c1121f] base:text-base italic">
                {parseInt(produto.valor).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
