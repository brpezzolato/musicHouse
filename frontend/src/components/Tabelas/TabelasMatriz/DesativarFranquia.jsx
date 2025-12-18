'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Power } from 'lucide-react';

export default function DialogDesativarFuncionario({
  onDesligado,
  filial,
  setRecarregar,
}) {
  const [open, setOpen] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function desligar() {
    setCarregando(true);
    setRecarregar(false);
    setErro('');

    try {
      const res = await fetch(
        `http://localhost:8080/franquias/${filial.id_franquia}?tipo=${
          filial.status === 'Ativo' ? 1 : 2
        }`,
        {
          method: 'PUT',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErro(data.mensagem || 'Erro ao desativar/ativar filial.');
        setCarregando(false);
        return;
      }

      setOpen(false);
      setRecarregar(true);
      if (onDesligado) onDesligado();
    } catch (error) {
      console.error(error);
      setErro('Erro ao conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {filial.status === 'Ativo' ? (
          <button className="p-2 rounded-lg bg-red-900/40 hover:bg-red-800 border border-red-800 transition">
            <Power className="w-4 h-4 text-red-200" />
          </button>
        ) : (
          <button className="p-2 rounded-lg bg-green-500 hover:bg-red-800 border border-red-800 transition">
            <Power className="w-4 h-4 text-red-200" />
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[370px]">
        <DialogHeader>
          <DialogTitle className="text-[var(--azul-marinho)] text-[25px]">
            {filial.status === 'Ativo' ? 'Desativar Filial' : 'Ativar Filial'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col !gap-y-2">
          <p>
            {filial.status === 'Ativo'
              ? 'Tem certeza que deseja desativar a filial:'
              : 'Tem certeza que deseja ativar a filial:'}
          </p>
          <span className="font-semibold">{filial.endereco_completo} ?</span>
        </div>

        {erro && (
          <p className="text-red-500 bg-red-500/10 border border-red-700 p-2 rounded-md mt-3 text-sm">
            {erro}
          </p>
        )}

        <DialogFooter className="mt-5 flex justify-end gap-3">
          <Button
            onClick={() => setOpen(false)}
            className="hover:bg-[var(--azul-marinho)] hover:text-white"
            variant="outline"
          >
            Cancelar
          </Button>

          <Button
            onClick={desligar}
            disabled={carregando}
            className="bg-red-700 hover:bg-red-600"
          >
            {carregando ? 'Salvando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
