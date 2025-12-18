"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function DialogRecusarPedidoFilial({ franquia, quantidade, id_pedido, onRecusado }) {
    const [open, setOpen] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function recusarPedido() {
        setCarregando(true);
        setErro("");

        try {
            const res = await fetch(`http://localhost:8080/estoque/pedidoRecusado/${id_pedido}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.mensagem || "Erro ao aceitar pedido.");
                setCarregando(false);
                return;
            }

            setOpen(false);
            if (onRecusado) onRecusado();
        } catch (error) {
            console.error(error);
            setErro("Erro ao conectar ao servidor.");
        }

        setCarregando(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-6 py-2 text-[#003049] bg-white cursor-pointer border border-[#003049] transition">
                    <XCircle className="text-[#003049]"></XCircle>Recusar
                </button>
            </DialogTrigger>

            <DialogContent className="bg-white text-[#003049] border border-[#003049] max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-[#003049]">
                        Confirmar Ação
                    </DialogTitle>
                </DialogHeader>

                <p className="text-[#003049]">
                    Tem certeza que deseja recusar essa quantidade  <span className="font-bold text-[#003049]">{quantidade}</span> para a franquia  <span className="font-bold text-[#003049]">{franquia}</span>
                    <br />

                </p>

                {erro && (
                    <p className="text-red-500 bg-red-500/10 border border-red-700 p-2 rounded-md mt-3 text-sm">
                        {erro}
                    </p>
                )}

                <DialogFooter className="mt-5 flex justify-end gap-3">
                    <Button onClick={() => setOpen(false)} className="bg-[#003049] hover:bg-[#002437] text-white">
                        Cancelar
                    </Button>

                    <Button
                        onClick={recusarPedido}
                        disabled={carregando}
                        className="bg-[#003049] hover:bg-[#002437] text-white"
                    >
                        {carregando ? "Processando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
