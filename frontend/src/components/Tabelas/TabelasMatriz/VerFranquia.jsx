'use client';

import { useEffect, useState } from 'react';
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
import { toast } from 'sonner';

const cssInput =
  'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

export default function VerFranquia({ filial }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  function formatarISO(isoString) {
    const data = new Date(isoString);
    return data.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  }

  const [formData, setFormData] = useState({
    codigo_postal: filial.codigo_postal,
    endereco_completo: filial.endereco_completo,
    cidade: filial.cidade,
    email_contato: filial.email_contato,
    telefone_contato: filial.telefone_contato,
    data_registro: formatarISO(filial.data_registro),
    data_ultima_atualizacao: formatarISO(filial.atualizado_em),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition mr-2">
            <Eye className="w-4 h-4 text-zinc-200" />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Informações da Filial
            </DialogTitle>
            <DialogDescription>
              Visualize os dados da filial. Nenhuma alteração pode ser feita
              neste modo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="flex flex-col">
              <label className="mb-1 -mt-2">CEP:</label>
              <input
                type="text"
                maxLength={8}
                className={`${cssInput} w-full`}
                value={formData.codigo_postal}
                disabled
              />
              {erro && erro}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 -mt-2">Endereço Completo:</label>
              <input
                type="text"
                className={`${cssInput} w-full`}
                value={formData.endereco_completo}
                disabled
              />
            </div>

            <div className="flex w-full gap-3">
              <div className="flex flex-col w-1/2">
                <label className="mb-1 -mt-2">Cidade:</label>
                <input
                  type="text"
                  className={`${cssInput} w-full`}
                  value={formData.cidade}
                  disabled
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-1 -mt-2">Telefone:</label>
                <input
                  type="text"
                  className={`${cssInput} w-full`}
                  value={formData.telefone_contato}
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 -mt-2">Email:</label>
              <input
                type="email"
                className={`${cssInput} w-full`}
                value={formData.email_contato}
                disabled
              />
            </div>
          </div>
          <div className="flex w-full gap-3">
            <div className="flex flex-col w-1/2">
              <label className="mb-1 -mt-2">Data de Registro:</label>
              <input
                type="text"
                className={`${cssInput} w-full`}
                value={formData.data_registro || ''}
                disabled
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label className="mb-1 -mt-2">Última Atualização:</label>
              <input
                type="text"
                className={`${cssInput} w-full`}
                value={formData.data_ultima_atualizacao || ''}
                disabled
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button className="text-white hover:text-white p-2 pl-4 pr-4 rounded-lg bg-[#003049] hover:bg-[#00263a] transition">
                Fechar
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
