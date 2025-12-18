"use client";

import { Clock, NotebookText, Wallet, Package } from "lucide-react";

export default function FinanceiroCards({
  lucroMes,
  despesasAPagar,
  contasAtrasadas,
  formatarMoeda
}) {
  return (
    <>
      {/* CARDS PRINCIPAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border">
          <h2 className="text-xl font-semibold text-gray-900">Receita do Mês</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Total arrecadado com vendas de instrumentos.
          </p>
          <div className="mt-6 text-3xl font-bold">
            R$ {formatarMoeda(lucroMes)}
          </div>
        </div>

        <div className="bg-black text-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold">Contas a pagar</h2>
          <p className="opacity-90 mt-1 text-sm">
            Contas pendente
          </p>
          <div className="mt-6 text-3xl font-bold">
            R$ {formatarMoeda(despesasAPagar)}
          </div>
        </div>

        

        <div className="bg-white rounded-xl p-6 shadow-md border">
          <h2 className="text-xl font-semibold text-gray-900">Contas atrasadas</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Contas vencidas aguardando pagamento.
          </p>
          <div className="mt-6 text-3xl font-bold text-gray-900">
            {contasAtrasadas}
          </div>
        </div>
      </div>
      

    </>
  );
}
