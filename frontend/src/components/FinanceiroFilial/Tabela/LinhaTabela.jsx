"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

export default function LinhaTabela({
  item,
  formatarDataBR,
  abrirModalEditar
}) {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
      <td className="pl-10 pr-3 py-3">{item.id_despesa}</td>

      <td className="p-3">
        <p className="font-semibold">{item.descricao}</p>
        <p className="text-xs text-zinc-500">
          Pago: {formatarDataBR(item.data_pagamento)}
        </p>
      </td>

      <td className="p-3">
        <span className="px-2 py-1 rounded bg-zinc-800 text-xs">
          {item.categoria}
        </span>
      </td>

      <td className="p-3 font-bold text-white">
        R$ {Number(item.valor).toFixed(2)}
      </td>

      <td className="p-3 font-bold text-zinc-200">
        {item.status}
      </td>

      <td className="p-3 flex items-center gap-3">
        <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition">
          <Eye className="w-4 h-4 text-zinc-200" />
        </button>

        <button
          onClick={() => abrirModalEditar(item)}
          className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition"
        >
          <Pencil className="w-4 h-4 text-zinc-200" />
        </button>

        <button className="p-2 rounded-full bg-red-900/50 hover:bg-red-800/60 border border-red-700 transition">
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </td>
    </tr>
  );
}
