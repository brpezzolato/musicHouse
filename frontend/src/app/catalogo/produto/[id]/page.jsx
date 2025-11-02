'use client';
import { useState, useEffect } from 'react';
import 'swiper/css';
import NavProdutos from '@/components/NavProdutos/NavProdutos';
import { AppSidebar } from '@/components/app-sidebar';
import { X } from 'lucide-react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import MaisVendidos from '@/components/MaisVendidos/MaisVendidos';
import FooterCatalogo from '@/components/FooterCatalogo/FooterCatalogo';
import { useParams } from 'next/navigation';
import ProdutoSkeleton from '@/components/Skeleton/Produto';

export default function Page() {
  const params = useParams();
  const id = params.id;
  const [produto, setProduto] = useState({});
  const [carregando, setCarregando] = useState(true);

  async function carregarProduto() {
    try {
      const response = await fetch(
        `http://localhost:8080/produtos/catalogo/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setProduto(data);
        setCarregando(false);
      } else {
        console.log('Erro no login:', response.statusText);
      }
    } catch (error) {
      console.log('Erro ao fazer login:', error);
    }
  }

  useEffect(() => {
    carregarProduto();
  }, [id]);

  const [current, setCurrent] = useState(0);
  const prevSlide = () =>
    setCurrent(
      (current - 1 + (produto.slides?.length || 1)) %
        (produto.slides?.length || 1)
    );
  const nextSlide = () =>
    setCurrent((current + 1) % (produto.slides?.length || 1));

  const product = {
    name: produto.name,
    price: produto.price,
    href: produto.href,
    breadcrumbs: produto.breadcrumbs || [],
    colors: produto.colors || [],
    highlights: produto.highlights,
    details: produto.details,
    description: produto.description,
  };

  const [activeTab, setActiveTab] = useState('descrição');

  const tabClass = (tab) =>
    `inline-block p-4 border-b-4 rounded-t-lg transition-colors duration-200 ${
      activeTab === tab
        ? 'border-red-800 text-red-800 font-semibold'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f3f3f3] overflow-x-hidden transition-all duration-300">
        {carregando === true ? (
          <ProdutoSkeleton />
        ) : (
          <>
            <div className="bg-white">
              <nav aria-label="Breadcrumb" className="-mb-3 mt-3">
                <ol
                  role="list"
                  className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
                >
                  <SidebarTrigger className="mr-2 bg-white text-[#c1121f] p-7 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#c1121f]/60 hover:ring-2 hover:ring-[#c1121f]/40 hover:shadow-[0_0_12px_2px_rgba(193,18,31,0.3)] hover:bg-white hover:text-[#780000] focus:bg-white active:bg-white transition-all duration-300 md:hidden" />
                  {product.breadcrumbs.map((breadcrumb) => (
                    <li key={breadcrumb.id}>
                      <div className="flex items-center">
                        <a
                          href={breadcrumb.href}
                          className="mr-2 text-sm font-medium text-gray-900"
                        >
                          {breadcrumb.name}
                        </a>
                        <svg
                          fill="currentColor"
                          width={16}
                          height={20}
                          viewBox="0 0 16 20"
                          aria-hidden="true"
                          className="h-5 w-4 text-gray-300"
                        >
                          <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                        </svg>
                      </div>
                    </li>
                  ))}
                  <li className="text-sm">
                    <a
                      href={product.href}
                      aria-current="page"
                      className="font-medium text-gray-500 hover:text-gray-600"
                    >
                      {product.name}
                    </a>
                  </li>
                </ol>
              </nav>

              <NavProdutos
                preco={product.price}
                categoria={product.breadcrumbs[1]?.name}
              />

              <div className="relative w-full overflow-hidden">
                <img
                  src={produto.slides?.[current]}
                  alt={`Slide ${current + 1}`}
                  className="h-[calc(600px-30px)] w-full rotate-90 object-contain transition-all duration-500 ease-in-out -mt-30 -mb-30"
                />
                <button
                  onClick={prevSlide}
                  className="pl-20 pr-20 absolute left-0 top-0 bottom-0 flex items-center justify-center text-red-600 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-[15%] text-red-600 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>

              <div className="pt-6">
                <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pt-16 lg:pb-24 -mt-10">
                  <div className="pl-10 mb-8 -mt-4 items-center flex lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                    <fieldset aria-label="Choose a color" className="mr-5">
                      <div className="flex items-center gap-x-3">
                        {product.colors.map((color) => (
                          <label key={color.id} className="relative">
                            <input
                              defaultValue={color.id}
                              defaultChecked={color === product.colors[0]}
                              name="color"
                              type="radio"
                              aria-label={color.name}
                              disabled={color.outOfStock}
                              className={`${
                                color.classes
                              } size-10 rounded-full appearance-none cursor-pointer checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3 ${
                                color.outOfStock
                                  ? 'opacity-40 cursor-not-allowed'
                                  : ''
                              }`}
                              style={{ backgroundColor: color.cor }}
                            />
                            {color.outOfStock && (
                              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                <X className="-mt-1 w-7 h-7 text-gray-700 opacity-70" />
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="textos-nome-product">
                      <h1 className="text-2xl italic font-bold tracking-tight uppercase text-gray-900 sm:text-2xl">
                        {product.name}
                      </h1>
                      <h2 className="text-xs italic tracking-tight text-gray-400 sm:text-xs">
                        {product.description?.length > 60
                          ? product.description?.substring(0, 60) + '...'
                          : product.description}
                      </h2>
                    </div>
                  </div>

                  <div className="lg:col-span-3 pl-30 pr-30">
                    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                      <ul
                        className="flex flex-wrap -mb-px text-sm font-medium text-center"
                        role="tablist"
                      >
                        <li className="me-2" role="presentation">
                          <button
                            className={tabClass('descrição')}
                            onClick={() => setActiveTab('descrição')}
                          >
                            Descrição
                          </button>
                        </li>
                        <li className="me-2" role="presentation">
                          <button
                            className={tabClass('materiais')}
                            onClick={() => setActiveTab('materiais')}
                          >
                            Materiais
                          </button>
                        </li>
                        <li role="presentation">
                          <button
                            className={tabClass('details')}
                            onClick={() => setActiveTab('details')}
                          >
                            Detalhes
                          </button>
                        </li>
                      </ul>
                    </div>

                    {activeTab === 'descrição' && (
                      <div className="space-y-6">
                        <p className="text-base text-gray-900">
                          {product.description}
                        </p>
                      </div>
                    )}

                    {activeTab === 'materiais' && (
                      <div className="mt-4">
                        <ul
                          role="list"
                          className="list-disc space-y-2 pl-4 text-sm mt-3"
                        >
                          {product.highlights.map((item) => (
                            <li key={item} className="text-base text-gray-900">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === 'details' && (
                      <div className="mt-4">
                        <p className="text-base text-gray-900 mt-3">
                          {product.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="-mb-10 md:-mb-11 mt-10">
              <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-4 lg:text-3xl">
                Produtos em <span className="text-[#c1121f]">destaque</span>
              </h2>
              <p className="mx-auto max-w-screen-md text-center text-gray-600 md:text-lg">
                Veja aqui outros instrumentos que você pode curtir
              </p>
            </div>
            <div className="flex flex-wrap justify-center mt-23 gap-6 mb-16">
              <MaisVendidos />
            </div>
          </>
        )}
        <FooterCatalogo />
      </SidebarInset>
    </SidebarProvider>
  );
}
