"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner"

export default function ModalApontamentoFinal({ open, onClose, onConfirm, id, mudandoStatus }) {
    const [texto, setTexto] = useState("");

    function confirmar() {
        onConfirm(texto);
        setTexto("");
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Mensagem Final para #{id}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-zinc-600 -mt-2">
                    Escreva a mensagem final antes de finalizar este chamado.
                </p>
                <label className="-mb-3">Digite o apontamento: </label>
                <textarea
                    placeholder="Digite o apontamento..."
                    className="rounded-[15px] px-3 py-2 border-2 h-30 focus:outline-0"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />


                <DialogFooter>
                    {mudandoStatus === true ?
                        <Button className='bg-[var(--azul-marinho)] hover:bg-[#003049]/90 flex justify-center' disabled>Salvando <Spinner /></Button>
                        :
                        <>
                            <Button variant="outline" onClick={onClose} className="hover:bg-[#003049]/80 hover:text-white">
                                Cancelar
                            </Button>

                            <Button onClick={confirmar} className='bg-[var(--azul-marinho)] hover:bg-[#003049]/90'>Confirmar</Button>
                        </>
                    }
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}