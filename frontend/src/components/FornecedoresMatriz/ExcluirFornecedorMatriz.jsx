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
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DialogExcluirFornecedor({ fornecedor, setReload }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function excluir() {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/fornecedores/${fornecedor.id_fornecedor}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        alert('Falha ao excluir o fornecedor.');
      }
      toast.success('Fornecedor excluído com sucesso!');
      setOpen(false);
      if (setReload) setReload((prev) => !prev);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-red-900/40 hover:bg-red-800 border border-red-800 transition">
          <Trash2 className="w-4 h-4 text-red-200" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="text-[var(--azul-marinho)] text-[25px]">
            Excluir Fornecedor
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-2 mt-2">
          <p>Tem certeza que deseja excluir o fornecedor:</p>
          <span className="font-semibold text-red-700">{fornecedor.nome}</span>
          <span className="text-sm text-gray-600">CNPJ: {fornecedor.cnpj}</span>
          <span className="text-sm text-gray-600">
            Objeto fornecido: {fornecedor.objeto_fornecido}
          </span>
        </div>

        <DialogFooter className="mt-5 flex justify-end gap-3">
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            className="hover:bg-[var(--azul-marinho)] hover:text-white"
            variant="outline"
          >
            Cancelar
          </Button>

          <Button
            disabled={loading}
            onClick={() => excluir()}
            className="bg-[var(--azul-marinho)] hover:bg-[#00263a]"
          >
            {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
