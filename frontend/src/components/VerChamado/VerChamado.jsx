"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { useEffect } from 'react'
import Select from "react-select";

const selectStyle = {
  control: (base) => ({
    ...base,
    borderRadius: "99999px",
    borderColor: "#403a3f",
    padding: "2px",
    minHeight: "40px",
    boxShadow: "none",
    backgroundColor: "#27272a",
    "&:hover": { borderColor: "#403a3f" },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#a7a7a7bb",
    fontSize: "14px",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? "#003049" : isFocused ? "#C1121F" : "white",
    color: isFocused || isSelected ? "white" : "#003049",
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "6px",
    overflow: "hidden",
  }),
};

export default function DialogVerChamado({ chamados, index = 0 }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);

  const chamadoAtual = chamados[currentIndex] || {};

  const proximo = () => {
    if (currentIndex < chamados.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const anterior = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full flex justify-end mb-5 -mt-4">
        <DialogTrigger asChild>
          <button className="!px-7 text-white hover:text-white p-2 rounded bg-[#d4a017] hover:bg-[#bf8c06] transition">
            Ver chamados anteriores
          </button>
        </DialogTrigger>
      </div>

      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="bg-[#18181b] text-white border border-zinc-700 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl -mt-1 -mb-4">
            {
              chamados.length > 0
                ? <>Ver Chamado <span className="text-[#d4a017]">#{chamadoAtual.id_chamado}</span></>
                : 'Você ainda não abriu nenhum chamado.'
            }
          </DialogTitle>
        </DialogHeader>
        {chamados.length > 0 ?
          <>
            <style>
              {`
            textarea::-webkit-scrollbar {
              width: 10px;
            }

            textarea::-webkit-scrollbar-track {
              background: #1a1a1a;
              border-radius: 12px;
            }

            textarea::-webkit-scrollbar-thumb {
              background: #3a3a3a;
              border-radius: 12px;
            }

            textarea::-webkit-scrollbar-thumb:hover {
              background: #555;
            }

            textarea::-webkit-resizer {
              display: none;
            }

            textarea {
              resize: none;
            }
          `}
            </style>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Título: </Label>
                  <Input
                    value={chamadoAtual.titulo || ""}
                    disabled
                    className="bg-[#27272a] border-zinc-700 text-white opacity-100 disabled:opacity-100 disabled:text-white disabled:bg-[#27272a] disabled:cursor-default"
                  />
                </div>
                <div>
                  <Label className="mb-2">Status: </Label>
                  <Input
                    value={chamadoAtual.status || ""}
                    disabled
                    className="bg-[#27272a] border-zinc-700 text-white opacity-100 disabled:opacity-100 disabled:text-white disabled:bg-[#27272a] disabled:cursor-default"
                  />
                </div>
              </div>

              {chamadoAtual.apontamento_final &&
                <div>
                  <Label className="mb-2">Mensagem de resulução: </Label>
                  <Input
                    value={chamadoAtual.apontamento_final || ""}
                    disabled
                    className="bg-[#27272a] border-zinc-700 text-white opacity-100 disabled:opacity-100 disabled:text-white disabled:bg-[#27272a] disabled:cursor-default"
                  />
                </div>}

              <div>
                <Label className="mb-2">Descrição: </Label>
                <textarea
                  value={chamadoAtual.descricao || ""}
                  readOnly
                  className="bg-[#27272a] border border-zinc-700 text-white p-3 rounded-lg w-full !h-30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Categoria: </Label>
                  <Input
                    value={chamadoAtual.categoria || ""}
                    disabled
                    className="bg-[#27272a] border-zinc-700 text-white opacity-100 disabled:opacity-100 disabled:text-white disabled:bg-[#27272a] disabled:cursor-default"
                  />
                </div>

                <div>
                  <div>
                    <Label className="mb-2">Prioridade: </Label>
                    <Input
                      value={chamadoAtual.prioridade || ""}
                      disabled
                      className="bg-[#27272a] border-zinc-700 text-white opacity-100 disabled:opacity-100 disabled:text-white disabled:bg-[#27272a] disabled:cursor-default"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Abertura: </Label>
                  <Input
                    value={chamadoAtual.data_abertura ?
                      `${new Date(chamadoAtual.data_abertura).toLocaleDateString("pt-BR")} às ${new Date(chamadoAtual.data_abertura).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}` : ""}
                    disabled
                    className="bg-[#27272a] border-zinc-700 text-white opacity-100 disabled:opacity-100 disabled:text-white disabled:bg-[#27272a] disabled:cursor-default"
                  />
                </div>

                <div>
                  <Label className="mb-2">Última Atualização: </Label>
                  <Input
                    value={chamadoAtual.data_atualizacao ?
                      `${new Date(chamadoAtual.data_atualizacao).toLocaleDateString("pt-BR")} às ${new Date(chamadoAtual.data_atualizacao).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}` : ""}
                    disabled
                    className="bg-[#27272a] border-zinc-700 text-white opacity-100 disabled:opacity-100 disabled:text-white disabled:bg-[#27272a] disabled:cursor-default"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3">
                <span className="text-zinc-400 text-sm">
                  {currentIndex + 1} de {chamados.length}
                </span>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={anterior}
                    disabled={currentIndex === 0}
                    className="bg-transparent hover:bg-[#bf8c06] text-[#bf8c06] hover:text-white border border-[#bf8c06] transition"
                  >
                    Anterior
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={proximo}
                    disabled={currentIndex >= chamados.length - 1}
                    className="bg-transparent hover:bg-[#bf8c06] text-[#bf8c06] hover:text-white border border-[#bf8c06] transition"
                  >
                    Próximo
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="bg-[#d4a017] hover:bg-[#bf8c06] text-white hover:text-white"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </>
          : <>
            <h1 className="mt-3">
              Assim que novos chamados forem criados, eles aparecerão aqui.
            </h1>
            <div className="flex flex-col items-center justify-center text-center w-full">
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="bg-[#d4a017] hover:bg-[#bf8c06] text-white hover:text-white"
              >
                Fechar
              </Button>
            </div>
          </>}
      </DialogContent>
    </Dialog>
  );
}
