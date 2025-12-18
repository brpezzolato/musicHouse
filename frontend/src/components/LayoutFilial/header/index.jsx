"use client";


import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";

import { MenuIcon } from "lucide-react";

import { UserInfo } from "./user-info";

export function Header({ user, franquia_endereco, cidade }) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="
      sticky top-0 z-30 
      flex items-center justify-between
       bg-black
      px-4 py-5 shadow-sm 
      dark:border-gray-700 dark:bg-gray-900
      md:px-5 2xl:px-10
    ">

      {/* Botão menu mobile */}
      <button
        onClick={toggleSidebar}
        className="
          rounded-lg border px-2 py-1 
          border-gray-300 hover:bg-gray-100
          dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 
          lg:hidden
        "
      >
        <MenuIcon size={22} className="text-white" />
      </button>


      {isMobile && (
        <Link href="/filial" className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <img src="/logos/logoEscritaBranca.png" alt="" className="max-w-[100px]" />
        </Link>
      )}


      <div className="max-xl:hidden">
        <h1 className="text-xl font-bold text-[var(--bege-claro)]">
          Music House - Filial
        </h1>
        <p className="text-gray-100">
          {franquia_endereco}, {cidade}
        </p>
      </div>


      <div className="flex flex-1 items-center justify-end gap-4">




        <div className="shrink-0">
          <UserInfo user={user} />
        </div>
      </div>
    </header>
  );
}
