'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const cssInput = `
  border-2 border-[#d9d9db]
  focus:ring-transparent 
  focus-visible:ring-transparent 
  focus:outline-none 
  focus-visible:outline-none 
  rounded-[15px] py-[5px] px-3 w-full
  disabled:opacity-100 disabled:cursor-default
`;

function formatISO(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} | ${horas}:${minutos}`;
}

export default function VerChamadoModalMatriz({ idChamado }) {
    const [open, setOpen] = useState(false);
    const [chamado, setChamado] = useState({});

    async function carregarChamado() {
        try {
            const response = await fetch(`http://localhost:8080/chamados/${idChamado}`, {
                cache: 'no-store',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setChamado(data);
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    }

    useEffect(() => {
        if (!open) return;
        if (!idChamado) return;

        carregarChamado()
    }, [idChamado, open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition">
                    <Eye className="w-4 h-4 text-zinc-200" />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Ver Chamado <span className='text-[var(--azul-marinho)] font-semibold'>#{idChamado}</span></DialogTitle>
                    <DialogDescription>
                        Veja os dados completos do chamado. Os campos abaixo não são
                        editáveis.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2">
                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col">
                            <label>Franquia:</label>
                            <Input value={chamado.filialEndereco ? `${chamado.filialEndereco} - (#${chamado.id_franquia})` : 'Carregando...'} disabled className={cssInput} />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label>Funcionário:</label>
                            <Input value={chamado.nome_func ? `${chamado.nome_func} - (#${chamado.id_funcionario})` : 'Carregando...'} disabled className={cssInput} />
                        </div>
                    </div>

                {!chamado.apontamento_final ? 
                    <div className="flex flex-col">
                        <label>Título:</label>
                        <Input value={chamado.titulo || 'Carregando...'} disabled className={cssInput} />
                    </div>
                    :
                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col">
                            <label>Título:</label>
                            <Input value={chamado.titulo || 'Carregando...'} disabled className={cssInput} />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label >Apontamento Final:</label>
                            <Input value={chamado.apontamento_final || 'Carregando...'} disabled className={cssInput} />
                        </div>
                    </div>
                    }

                    <div className="flex flex-col">
                        <label>Descrição:</label>
                        <textarea
                            value={chamado.descricao || 'Carregando...'}
                            disabled
                            className={cssInput + ' h-28 resize-none'}
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col">
                            <label >Categoria:</label>
                            <Input value={chamado.categoria || 'Carregando...'} disabled className={cssInput} />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label >Prioridade:</label>
                            <Input value={chamado.prioridade || 'Carregando...'} disabled className={cssInput} />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col">
                            <label >Status:</label>
                            <Input value={chamado.status || 'Carregando...'} disabled className={cssInput} />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label >Data de Abertura:</label>
                            <Input
                                value={chamado.data_abertura ? formatISO(chamado.data_abertura) : 'Carregando...'}
                                disabled
                                className={cssInput}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-[var(--azul-marinho)] hover:bg-[#00263a] text-white hover:text-white"
                        >
                            Fechar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}