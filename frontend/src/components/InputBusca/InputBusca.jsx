import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import FiltroCategorias from '@/components/FiltroCategorias/FiltroCategorias';

export default function header() {
  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-[#f3f3f3] transition-all duration-300 border-b border-transparent overflow-hidden mt-9">
      <div className="flex items-center gap-2 w-full max-w-[1200px] mx-auto">
        <SidebarTrigger className="mr-2 bg-white text-[#c1121f] p-7 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#c1121f]/60 hover:ring-2 hover:ring-[#c1121f]/40 hover:shadow-[0_0_12px_2px_rgba(193,18,31,0.3)] hover:bg-white hover:text-[#780000] focus:bg-white active:bg-white transition-all duration-300 md:hidden" />
        <Breadcrumb className="flex-1">
          <form
            className="w-full mx-auto"
            action="/catalogo/busca"
            onSubmit={(e) => {
              const input = e.target.querySelector('input[name="termo"]');
              const valor = input.value.trim();
              if (valor === '') {
                e.preventDefault();
              }
            }}
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
                className="block w-full rounded-lg border border-transparent bg-white p-4 pl-12 text-sm text-[#c1121f] placeholder-[#c1121f]/80 focus:outline-none focus:ring-2 focus:ring-[#c1121f]/60 focus:bg-[#c1121f]/20 hover:ring-2 hover:ring-[#c1121f]/40 hover:shadow-[0_0_12px_2px_rgba(193,18,31,0.3)] transition-all duration-300"
              />
            </div>
          </form>
        </Breadcrumb>

        <FiltroCategorias />
      </div>
    </header>
  );
}
