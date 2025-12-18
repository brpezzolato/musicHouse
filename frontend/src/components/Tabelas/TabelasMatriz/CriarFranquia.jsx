'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
import Select from "react-select";

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: '15px',
    borderColor: state.isFocused ? '#d9d9db' : '#d9d9db',
    padding: '0 6px',
    height: '20px',
    borderWidth: '2px',
    boxShadow: state.isFocused ? 'none' : 'none',
    '&:hover': { borderColor: '#d9d9db' },
    backgroundColor: '#fff',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#697b85',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#b5b5b5',
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isFocused
      ? '#C1121F'
      : isSelected
        ? '#003049'
        : 'white',
    color: isFocused || isSelected ? 'white' : '#003049',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#003049',
      color: 'white',
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '6px',
    overflow: 'hidden',
  }),
};


const cssButton = 'bg-[var(--azul-marinho)] hover:bg-[var(--azul-marinho)]';
const cssInput =
  'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

export default function CriarFranquia({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);
  const [erro2, setErro2] = useState('');

  const [formData, setFormData] = useState({
    codigo_postal: '',
    endereco: '',
    bairro: '',
    rua: '',
    numero: '',
    cidade: '',
    email_contato: '',
    telefone_contato: '',
    status: 'Ativo',
  });

  useEffect(() => {
    if (formData.codigo_postal?.length === 8) {
      recuperarEndereco();
    }

    setErro('');

    setFormData((prev) => ({
      ...prev,
      endereco: '',
      cidade: '',
    }));
  }, [formData.codigo_postal]);

  async function recuperarEndereco() {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${formData.codigo_postal}/json/`
      );

      const data = await response.json();

      if (data.erro != 'true') {
        setFormData((resto) => ({
          ...resto,
          endereco: `${data.logradouro} - ${data.bairro}`,
          cidade: `${data.localidade} - ${data.uf}`,
          rua: data.logradouro,
          bairro: data.bairro,
        }));
      } else {
        setErro('CEP inválido');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function criar() {
    setLoading(true);
    setErro2('');

    try {
      if (
        !formData.codigo_postal ||
        !formData.endereco ||
        !formData.cidade ||
        !formData.email_contato ||
        !formData.telefone_contato ||
        !formData.numero ||
        !formData.status
      ) {
        setErro2('Por Favor, Preencha todos os campos');
        return;
      }

      const res = await fetch('http://localhost:8080/franquias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setOpen(false);

        setFormData({
          codigo_postal: '',
          endereco: '',
          bairro: '',
          rua: '',
          numero: '',
          cidade: '',
          email_contato: '',
          telefone_contato: '',
          status: 'Ativo',
        });

        toast.success('Franquia criada com sucesso!', {
          description: 'A nova unidade já está disponível na lista.',
          style: { background: '#10b981', color: 'white', border: 'none' },
        });

        if (onSuccess) onSuccess();
      } else {
        toast.error('Erro ao criar franquia', {
          description: 'Verifique os dados e tente novamente.',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro de conexão', {
        description: 'Não foi possível contatar o servidor.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            className="border bg-[#003049] text-white hover:bg-[#002737] hover:text-white transition-colors"
            variant="outline"
          >
            Cadastrar Filial
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Cadastro de nova Filial
            </DialogTitle>
            <DialogDescription>
              Informe os dados necessários para criar uma nova filial. Revise as
              informações antes de salvar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="flex w-full gap-3">
              <div className="flex flex-col w-1/2">
                <label className="mb-1">CEP *:</label>
                <input
                  type="text"
                  maxLength={8}
                  className={`${cssInput} w-full`}
                  value={formData.codigo_postal}
                  onChange={(e) => {
                    const cep = e.target.value.replace(/\D/g, '').slice(0, 8);

                    setFormData((prev) => ({
                      ...prev,
                      codigo_postal: cep,
                      endereco: '',
                      cidade: '',
                    }));
                  }}
                />
                {erro && (
                  <p className="mt-1 -mb-2 text-sm text-red-500">{erro}</p>
                )}
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-1">Telefone *:</label>
                <input
                  type="text"
                  className={`${cssInput} w-full`}
                  value={formData.telefone_contato}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefone_contato: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1">Cidade (Automático):</label>
              <input
                type="text"
                className={`${cssInput} w-full`}
                value={formData.cidade}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Endereço Completo (Automático):</label>
              <input
                type="text"
                className={`${cssInput} w-full`}
                value={formData.endereco}
                readOnly
              />
            </div>

            <div className="flex w-full gap-3">
              <div className="flex flex-col w-1/2">
                <label className="mb-1">Número *:</label>
                <input
                  type="number"
                  maxLength={8}
                  className={`${cssInput} w-full`}
                  value={formData.numero}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      numero: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-1">Status *:</label>
                <Select
                  styles={selectStyle}
                  options={[
                    { value: "Ativo", label: "Ativo" },
                    { value: "Inativo", label: "Inativo" },
                  ]}
                  value={{
                    value: formData.status,
                    label: formData.status,
                  }}
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      status: selected.value,
                    })
                  }
                />

              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Email *:</label>
              <input
                type="email"
                className={`${cssInput} w-full`}
                value={formData.email_contato}
                onChange={(e) =>
                  setFormData({ ...formData, email_contato: e.target.value })
                }
              />
            </div>
            {erro2 && <p className="text-red-500 text-sm">{erro2}</p>}
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
              type="submit"
              className={cssButton}
              disabled={loading}
              onClick={() => {
                criar();
              }}
            >
              {loading ? 'Salvando...' : 'Salvar nova Filial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
