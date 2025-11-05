'use client';

export default function NavProdutos({ preco, categoria, idCategoria }) {
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="/catalogo/logoNavProdutos.png"
              className="h-13 mt-5 ml-7"
              alt="Flowbite Logo"
            />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <h2 className="text-2xl font-bold italic pr-6">{preco}</h2>

            <a
              type="button"
              href={`/catalogo/categoria/${idCategoria}`}
              className="text-white bg-[#780000] focus:ring-4 focus:outline-none font-medium  text-sm px-4 py-2 text-center mr-5"
            >
              Instrumento de {categoria}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
