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
    borderRadius: "99999px",
    borderColor: "#003049",
    padding: "2px",
    minHeight: "40px",
    boxShadow: "none",
    backgroundColor: "#003049",
    "&:hover": { borderColor: "#003049" },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#ffffff",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#b5c7d8",
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
      <DialogContent
        className="text-white max-w-lg"
        style={{ backgroundColor: "#00263a", border: "1px solid #003049" }}
      >
        <DialogHeader>
          <DialogTitle className="text-[#FDF0D5]">
            Editar Despesa #{despesaEdit.id_despesa}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-3">

          {/* CATEGORIA */}
          <div className="grid gap-2">
            <label className="text-[#FDF0D5]">Categoria</label>
            <input
              type="text"
              value={despesaEdit.categoria}
              onChange={(e) =>
                setDespesaEdit({ ...despesaEdit, categoria: e.target.value })
              }
              className="p-2 rounded text-white"
              style={{
                backgroundColor: "#003049",
                border: "1px solid #003049",
              }}
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="grid gap-2">
            <label className="text-[#FDF0D5]">Descrição</label>
            <input
              type="text"
              value={despesaEdit.descricao}
              onChange={(e) =>
                setDespesaEdit({ ...despesaEdit, descricao: e.target.value })
              }
              className="p-2 rounded text-white"
              style={{
                backgroundColor: "#003049",
                border: "1px solid #003049",
              }}
            />
          </div>

          {/* VALOR */}
          <div className="grid gap-2">
            <label className="text-[#FDF0D5]">Valor</label>
            <input
              type="number"
              value={despesaEdit.valor}
              onChange={(e) =>
                setDespesaEdit({ ...despesaEdit, valor: e.target.value })
              }
              className="p-2 rounded text-white"
              style={{
                backgroundColor: "#003049",
                border: "1px solid #003049",
              }}
            />
          </div>

          {/* DATA PAGAMENTO */}
          <div className="grid gap-2">
            <label className="text-[#FDF0D5]">Data Pagamento</label>
            <input
              type="date"
              value={despesaEdit.data_pagamento}
              onChange={(e) =>
                setDespesaEdit({
                  ...despesaEdit,
                  data_pagamento: e.target.value
                })
              }
              className="p-2 rounded text-white"
              style={{
                backgroundColor: "#003049",
                border: "1px solid #003049",
              }}
            />
          </div>

          {/* STATUS */}
          <div className="grid gap-2">
            <label className="text-[#FDF0D5]">Status</label>

            <Select
              value={statusOptions.find(opt => opt.value === despesaEdit.status)}
              onChange={(option) =>
                setDespesaEdit({ ...despesaEdit, status: option.value })
              }
              options={statusOptions}
              styles={selectStyle}
            />
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="mt-5 flex justify-end gap-3">
          <Button
            onClick={salvarEdicao}
            className="text-white"
            style={{
              backgroundColor: "#003049",
              border: "1px solid #003049",
            }}
          >
            Salvar Alterações
          </Button>

          <Button
            onClick={() => setOpenEdit(false)}
            className="text-white"
            style={{
              backgroundColor: "#00263a",
              border: "1px solid #003049",
            }}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
