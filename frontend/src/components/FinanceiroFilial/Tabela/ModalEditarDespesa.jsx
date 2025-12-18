"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import Select from "react-select";

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: '99999px',
    borderColor: state.isFocused ? '#403a3f' : '#403a3f',
    padding: '2px',
    minHeight: '40px',
    boxShadow: state.isFocused ? '0 0 0 1px #403a3f' : 'none',
    '&:hover': { borderColor: '#403a3f' },
    backgroundColor: '#27272a',
  }),

  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),

  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),

  placeholder: (base) => ({
    ...base,
    color: '#a7a7a7bb',
    fontSize: '14px',
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,

    backgroundColor: isFocused
      ? '#C1121F'
      : isSelected
      ? '#003049' 
      : 'white',

    color: isFocused || isSelected ? 'white' : '#003049',

    cursor: 'pointer',

    '&:active': {
      backgroundColor: '#003049',
      color: 'white',
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '6px',
    overflow: 'hidden',
  }),
};


const statusOptions = [
  { value: "Pendente", label: "Pendente" },
  { value: "Paga", label: "Paga" },
];

export default function ModalEditarDespesa({
  openEdit,
  setOpenEdit,
  despesaEdit,
  setDespesaEdit,
  salvarEdicao
}) {
  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className="bg-zinc-900 text-white border border-zinc-700 max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Despesa #{despesaEdit.id_despesa}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-3">
          <div className="grid gap-2">
            <label>Categoria</label>
            <input
              type="text"
              value={despesaEdit.categoria}
              onChange={(e) =>
                setDespesaEdit({ ...despesaEdit, categoria: e.target.value })
              }
              className="bg-zinc-800 border border-zinc-700 p-2 rounded"
            />
          </div>

          <div className="grid gap-2">
            <label>Descrição</label>
            <input
              type="text"
              value={despesaEdit.descricao}
              onChange={(e) =>
                setDespesaEdit({ ...despesaEdit, descricao: e.target.value })
              }
              className="bg-zinc-800 border border-zinc-700 p-2 rounded"
            />
          </div>

          <div className="grid gap-2">
            <label>Valor</label>
            <input
              type="number"
              value={despesaEdit.valor}
              onChange={(e) =>
                setDespesaEdit({ ...despesaEdit, valor: e.target.value })
              }
              className="bg-zinc-800 border border-zinc-700 p-2 rounded"
            />
          </div>

          <div className="grid gap-2">
            <label>Data Pagamento</label>
            <input
              type="date"
              value={despesaEdit.data_pagamento}
              onChange={(e) =>
                setDespesaEdit({
                  ...despesaEdit,
                  data_pagamento: e.target.value
                })
              }
              className="bg-zinc-800 border border-zinc-700 p-2 rounded"
            />
          </div>

          {/* SELECT SUBSTITUÍDO — ÚNICA ALTERAÇÃO */}
          <div className="grid gap-2">
            <label>Status</label>
            <Select
              value={statusOptions.find(opt => opt.value === despesaEdit.status)}
              onChange={(option) =>
                setDespesaEdit({ ...despesaEdit, status: option.value })
              }
              options={statusOptions}
              styles={selectStyle}
              className="text-black"
            />
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button
            onClick={salvarEdicao}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600"
          >
            Salvar Alterações
          </Button>

          <Button
            onClick={() => setOpenEdit(false)}
            className="bg-zinc-700 hover:bg-zinc-600 border border-zinc-600"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
