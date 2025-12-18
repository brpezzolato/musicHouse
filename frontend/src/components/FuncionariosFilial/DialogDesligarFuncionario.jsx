"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

export default function DialogDesligarFuncionario({ funcionario, onDesligado }) {
  const [open, setOpen] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function desligar() {
    setCarregando(true);
    setErro("");

    try {
      const res = await fetch(`http://localhost:8080/funcionarios/desligar/${funcionario.id_registro}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.mensagem || "Erro ao desligar funcionário.");
        setCarregando(false);
        return;
      }

      setOpen(false);
      if (onDesligado) onDesligado();
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar ao servidor.");
    }

    setCarregando(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-red-900/40 hover:bg-red-800 border border-red-800 transition">
          <Power className="w-4 h-4 text-red-200" />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 text-white border border-red-900 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-red-400">
            Desligar Funcionário
          </DialogTitle>
        </DialogHeader>

        <p className=" text-zinc-300">
          Tem certeza que deseja desligar o funcionário:
          <br />
          <span className="font-bold text-white">{funcionario.nome_completo}</span>?
        </p>

        {erro && (
          <p className="text-red-500 bg-red-500/10 border border-red-700 p-2 rounded-md mt-3 text-sm">
            {erro}
          </p>
        )}

        <DialogFooter className="mt-5 flex justify-end gap-3">
          <Button onClick={() => setOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
            Cancelar
          </Button>

          <Button
            onClick={desligar}
            disabled={carregando}
            className="bg-red-700 hover:bg-red-600"
          >
            {carregando ? "Desligando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
