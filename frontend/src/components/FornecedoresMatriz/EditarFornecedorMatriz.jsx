'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
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

function unmaskCNPJ(value) {
  return value.replace(/\D/g, '');
}

function formatarMoedaBR(valor) {
  if (!valor) return '';
  valor = valor.replace(/\D/g, '');
  let numero = (parseInt(valor, 10) / 100).toFixed(2);
  numero = numero.replace('.', ',');
  numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return numero;
}

export default function EditarFornecedor({ fornecedor, onSuccess, setReload }) {
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

  useEffect(() => {
    if (fornecedor) {
      setFormData({
        nome: fornecedor.nome || '',
        cnpj: maskCNPJ(fornecedor.cnpj || ''),
        email: fornecedor.email || '',
        endereco: fornecedor.endereco || '',
        objeto_fornecido: fornecedor.objeto_fornecido || '',
        custo: fornecedor.custo,
      });
    }
  }, [fornecedor]);

  async function salvar() {
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
        cnpj: unmaskCNPJ(formData.cnpj),
        custo: Number(custoFinal),
      };

      const response = await fetch(
        `http://localhost:8080/fornecedores/${fornecedor.id_fornecedor}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        alert('Erro ao atualizar fornecedor na API');
      }

      if (onSuccess) onSuccess(payload);

      setReload(true);

      toast.success('Fornecedor atualizado com sucesso!', {
        description: 'As informações do fornecedor foram salvas.',
        style: { background: '#10b981', color: 'white', border: 'none' },
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
      setErro(error.message || 'Ocorreu um erro ao salvar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <button className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition">
            <Pencil className="w-4 h-4 text-zinc-200" />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Fornecedor</DialogTitle>
            <DialogDescription>
              Altere as informações do fornecedor conforme necessário e salve.
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
              onClick={salvar}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
