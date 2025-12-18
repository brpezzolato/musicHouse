"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";


export default function DialogLigarFuncionario({ funcionario, onDesligado }) {
  const [open, setOpen] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function desligar() {
    setCarregando(true);
    setErro("");

    try {
      const res = await fetch(`http://localhost:8080/funcionarios/ligar/${funcionario.id_registro}`, {
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
    <button className="p-2 rounded-lg bg-green-900/40 hover:bg-green-800 border border-green-800 transition">
      <Check className="w-4 h-4 text-green-200" />
    </button>
  </DialogTrigger>

  <DialogContent className="bg-white text-[#003049] border border-green-600 max-w-sm">
    <DialogHeader>
      <DialogTitle className="text-green-600">
        Confirmar Ação
      </DialogTitle>
    </DialogHeader>

    <p className="text-[#003049]">
      Tem certeza que deseja ativar o funcionário:
      <br />
      <span className="font-bold text-[#003049]">{funcionario.nome_completo}</span>?
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
        className="bg-green-700 hover:bg-green-600"
      >
        {carregando ? "Processando..." : "Confirmar"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  );
}
