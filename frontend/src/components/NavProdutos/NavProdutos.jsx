'use client';

export default function NavProdutos({ preco, sku, estoque, desconto, valorComDesconto }) {
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className=" max-w-screen-xl mx-auto p-4 flex flex-wrap items-center justify-between max-[320px]:flex-col max-[320px :justify-center max-[320px]:gap-3 min-[320px]:mt-6">
          <a
            href="/catalogo"
            className="flex items-center space-x-3 rtl:space-x-reverse max-[320px]:justify-center max-[320px]:w-full"
          >
            <img
              src="/catalogo/logoNavProdutos.png"
              alt="Logo"
              className="
          h-13 mt-5 ml-7
          max-[540px]:h-12 max-[540px]:mt-0 max-[540px]:ml-0 min-[530px]:-mt-2 max-[530px]:mt-3
        "
            />
          </a>

          <div
            className="
        flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse
        max-[540px]:flex-col max-[540px]:items-center max-[540px]:justify-center max-[540px]:space-x-0 max-[540px]:gap-1
      "
          >
            <h2
              className="
          text-2xl font-bold italic pr-6 pt-[0.3rem]
          max-[540px]:text-lg max-[540px]:pr-0 max-[540px]:pt-0 max-[540px]:text-center
        "
            >
              {preco} {desconto && desconto + '%'} {valorComDesconto}
            </h2>

            <span
              className={`text-white bg-[#780000] text-[15px] px-4 py-2 text-center mr-5
          max-[540px]:text-[13px] max-[540px]:px-3 max-[540px]:py-1 max-[540px]:mr-0 ${estoque != 0 ? `font-bold` : 'font-semibold'}`} 
            >
              {estoque != 0 ? `Código: ${sku}` : 'Out Of Stock'}
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
