'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
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

function formatarMoedaBR(valor) {
  if (!valor) return '';
  valor = valor.replace(/\D/g, '');
  let numero = (parseInt(valor, 10) / 100).toFixed(2);
  numero = numero.replace('.', ',');
  numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return numero;
}

export default function CriarFornecedor({ onSuccess, setReload }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    endereco: '',
    objeto_fornecido: '',
    custo: '',
  });

  async function criar() {
    setErro('');
    setLoading(true);
    setReload(false);

    try {
      if (
        !formData.nome ||
        !formData.cnpj ||
        !formData.email ||
        !formData.endereco ||
        !formData.objeto_fornecido ||
        !formData.custo
      ) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      const custoLimpo = formData.custo.replace(/\D/g, '');
      const custoFinal = custoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');

      const payload = {
        ...formData,
        cnpj: formData.cnpj,
        custo: Number(custoFinal),
      };

      const response = await fetch('http://localhost:8080/fornecedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert('Erro ao cadastrar fornecedor na API');
      }

      if (onSuccess) onSuccess(payload);
      setReload(true);

      toast.success('Fornecedor criado com sucesso!', {
        description: 'O novo fornecedor foi adicionado à lista.',
        style: { background: '#10b981', color: 'white', border: 'none' },
      });

      setFormData({
        nome: '',
        cnpj: '',
        email: '',
        endereco: '',
        objeto_fornecido: '',
        custo: '',
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
      setErro(error.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="border bg-[#003049] text-white hover:bg-[#002737] transition-colors">
            Cadastrar Fornecedor
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Cadastro de Fornecedor
            </DialogTitle>
            <DialogDescription>
              Informe os dados necessários para criar um novo fornecedor. Revise
              as informações antes de salvar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 mt-2">
            <div className="flex flex-col">
              <label className="mb-1">Nome *</label>
              <Input
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className={cssInput}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">CNPJ *</label>
              <Input
                value={formData.cnpj}
                onChange={(e) =>
                  setFormData({ ...formData, cnpj: maskCNPJ(e.target.value) })
                }
                className={cssInput}
                maxLength={18}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col">
                <label className="mb-1">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={cssInput}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="mb-1">Endereço *</label>
                <Input
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  className={cssInput}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col">
                <label className="mb-1">Objeto Fornecido *</label>
                <Input
                  value={formData.objeto_fornecido}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      objeto_fornecido: e.target.value,
                    })
                  }
                  className={cssInput}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="mb-1">Custo *</label>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                    R$
                  </span>
                  <Input
                    value={formatarMoedaBR(formData.custo)}
                    onChange={(e) =>
                      setFormData({ ...formData, custo: e.target.value })
                    }
                    className={`${cssInput} pl-10`}
                  />
                </div>
              </div>
            </div>

            {erro && <p className="text-red-500 text-sm">{erro}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="hover:bg-[var(--azul-marinho)] hover:text-white"
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="button"
              className={cssButton}
              disabled={loading}
              onClick={criar}
            >
              {loading ? 'Salvando...' : 'Salvar Fornecedor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
