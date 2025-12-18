"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import Select from "react-select";

// ---- OPTIONS ----
const categoriaOptions = [
  { value: "", label: "Selecione..." },
  { value: "Água", label: "Água" },
  { value: "Luz", label: "Luz" },
  { value: "Internet", label: "Internet" },
  { value: "Aluguel", label: "Aluguel" },
  { value: "Manutenção", label: "Manutenção" },
  { value: "Limpeza", label: "Materiais de Limpeza" },
  { value: "Marketing", label: "Marketing" },
  { value: "Transporte", label: "Transporte" },
  { value: "Salario", label: "Salário / RH" },
  { value: "Outros", label: "Outros" },
];

const statusOptions = [
  { value: "", label: "Selecione..." },
  { value: "pendente", label: "Pendente" },
  { value: "pago", label: "Pago" },
];


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

export default function ModalAdicionarDespesa({
  open,
  setOpen,
  novaDespesa,
  setNovaDespesa,
  erroForm,
  handleSubmit,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white border border-zinc-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Adicionar Despesa</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Preencha os detalhes da despesa.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">

          {/* CATEGORIA */}
          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">Categoria *</label>
            <Select
              value={categoriaOptions.find(opt => opt.value === novaDespesa.categoria)}
              onChange={(option) =>
                setNovaDespesa({ ...novaDespesa, categoria: option.value })
              }
              options={categoriaOptions}
              styles={selectStyle}
              placeholder="Selecione..."
              className="text-black"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">Descrição *</label>
            <input
              type="text"
              value={novaDespesa.descricao}
              onChange={(e) =>
                setNovaDespesa({ ...novaDespesa, descricao: e.target.value })
              }
              className="w-full rounded-lg bg-zinc-800 text-white border border-zinc-700 px-3 py-2"
            />
          </div>

          {/* VALOR */}
          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">Valor *</label>
            <input
              type="number"
              value={novaDespesa.valor}
              onChange={(e) =>
                setNovaDespesa({ ...novaDespesa, valor: e.target.value })
              }
              className="w-full rounded-lg bg-zinc-800 text-white border border-zinc-700 px-3 py-2"
            />
          </div>

          {/* DATA */}
          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">Data de Pagamento</label>
            <input
              type="date"
              value={novaDespesa.data_pagamento}
              onChange={(e) =>
                setNovaDespesa({
                  ...novaDespesa,
                  data_pagamento: e.target.value
                })
              }
              className="w-full rounded-lg bg-zinc-800 text-white border border-zinc-700 px-3 py-2"
            />
          </div>

          {/* STATUS — agora com react-select */}
          <div className="grid gap-2">
            <label className="text-sm text-zinc-300">Status *</label>
            <Select
              value={statusOptions.find(opt => opt.value === novaDespesa.status)}
              onChange={(option) =>
                setNovaDespesa({ ...novaDespesa, status: option.value })
              }
              options={statusOptions}
              styles={selectStyle}
              placeholder="Selecione..."
              className="text-black"
            />
          </div>

        </div>

        {erroForm && (
          <div className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm mt-4">
            {erroForm}
          </div>
        )}

        <DialogFooter className="flex gap-3 justify-end mt-4">
          <Button
            onClick={handleSubmit}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600"
          >
            Salvar
          </Button>

          <Button
            onClick={() => {
              setOpen(false);
            }}
            className="bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
