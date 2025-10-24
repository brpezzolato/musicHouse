'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import FooterCatalogo from '@/components/FooterCatalogo/FooterCatalogo';
import InputBusca from '@/components/InputBusca/InputBusca';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f3f3f3] overflow-x-hidden transition-all duration-300">
        <InputBusca />
        <img
          src="/catalogo/catalogo404.png"
          alt="Banner"
          className="w-full h-auto object-cover pl-40 pr-40"
          draggable={false}
        />
        <FooterCatalogo />
      </SidebarInset>
    </SidebarProvider>
  );
}
