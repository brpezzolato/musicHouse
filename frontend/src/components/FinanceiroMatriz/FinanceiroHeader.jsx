"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export default function FinanceiroHeader({ setOpen }) {
  return (
    <div
      className="
    flex flex-col 
    md:flex-row 
    md:items-center 
    md:justify-between 
    gap-4 
    mb-6
  "
    >
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-[#003049]">
          Financeiro
        </h1>

        <h2 className="text-base md:text-lg mt-1 text-[#94a3b8]">
          Acompanhe os indicadores financeiros, despesas, vendas e movimentações.
        </h2>
      </div>

      <div className="flex justify-center md:justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="bg-[#003049] hover:bg-zinc-700 text-white border border-zinc-700 p-5"
        >
          <CirclePlus className="mr-2" /> Adicionar Despesa
        </Button>
      </div>
    </div>

  );
}
