'use client';

import { useState } from 'react';
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

const cssButton =
  'bg-[var(--azul-marinho)] hover:bg-[var(--azul-marinho)] text-white';
const cssInput =
  'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

function maskCNPJ(value) {
  let v = value.replace(/\D/g, '');
  v = v.slice(0, 14);
  v = v.replace(/^(\d{2})(\d)/, '$1.$2');
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
  v = v.replace(/(\d{4})(\d)/, '$1-$2');
  return v;
}

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

export default function EditarFornecedor({ fornecedor }) {
  const [open, setOpen] = useState(false);

  const [formData] = useState({
    nome: fornecedor?.nome,
    cnpj: fornecedor?.cnpj ? maskCNPJ(fornecedor.cnpj) : '',
    email: fornecedor?.email,
    endereco: fornecedor?.endereco,
    objeto_fornecido: fornecedor?.objeto_fornecido,
    custo: fornecedor?.custo,
    data_registro: fornecedor?.data_registro,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition">
          <Eye className="w-4 h-4 text-zinc-200" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Ver Dados do Fornecedor
          </DialogTitle>
          <DialogDescription>
            Veja as informações do fornecedor. Não é possível editar os campos
            abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 mt-2">
          <div className="flex flex-col">
            <label className="mb-1">Nome:</label>
            <Input value={formData.nome} disabled className={cssInput} />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">CNPJ:</label>
            <Input
              value={formData.cnpj}
              disabled
              className={cssInput}
              maxLength={18}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col">
              <label className="mb-1">Email:</label>
              <Input
                type="email"
                value={formData.email}
                disabled
                className={cssInput}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="mb-1">Endereço:</label>
              <Input value={formData.endereco} disabled className={cssInput} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col">
              <label className="mb-1">Objeto Fornecido:</label>
              <Input
                value={formData.objeto_fornecido}
                disabled
                className={cssInput}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="mb-1">Custo:</label>
              <Input
                type="text"
                step="0.01"
                value={Number(formData.custo).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                disabled
                className={cssInput}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Data de Registro:</label>
            <Input
              value={formatISO(formData.data_registro)}
              disabled
              className={cssInput}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="bg-[var(--azul-marinho)] hover:text-white text-white hover:bg-[#00263a]"
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
