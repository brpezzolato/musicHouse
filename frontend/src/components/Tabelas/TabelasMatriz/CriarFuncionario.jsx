'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Select from 'react-select';

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: '99999px',
    borderColor: state.isFocused ? '#c0c0c0' : '#c0c0c0',
    padding: '2px',
    minHeight: '40px',
    boxShadow: state.isFocused ? '0 0 0 1px #c0c0c0' : 'none',
    '&:hover': { borderColor: '#c0c0c0' },
    backgroundColor: '#133649',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#a7a7a7bb',
    fontSize: '14px',
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

export default function CriarFuncionario({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [dadosIniciais, setDadosIniciais] = useState({});
  const [credencialOptions, setCredencialOptions] = useState([]);
  const [franquiaOptions, setFranquiaOptions] = useState([]);
  const [esperando, setEsperando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const getCookie = (name) => {
    if (typeof document === 'undefined') return '';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  async function carregarDadosIniciais() {
    const cookie = getCookie('token');
    try {
      const response = await fetch(
        `http://localhost:8080/funcionarios/detalhes`,
        {
          headers: {
            cookie: cookie,
          },
          cache: 'no-store',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDadosIniciais(data);

        if (data.todasFranquias) {
          const franquiasSelect = data.todasFranquias.map((cada, index) => ({
            value: cada.id_franquia,
            label: `${index === 0 ? 'Matriz - ' : 'Music House - '}${cada.cidade}`,
          }));
          setFranquiaOptions(franquiasSelect);
        } else {
          setFranquiaOptions([
            {
              value: data.id_franquia,
              label: `Music House ${data.filialEndereco}`,
            },
          ]);
        }

        if (data.id_credencial === 1) {
          setCredencialOptions([{ value: 1, label: 'Administrador Matriz' }]);
        } else {
          setCredencialOptions([
            { value: 2, label: 'Gerente de Loja' },
            { value: 3, label: 'Caixa' },
            { value: 4, label: 'Supervisor' },
          ]);
        }
      } else {
        console.log('Erro ao carregar Dados Iniciais:', response.statusText);
      }
    } catch (error) {
      console.log('Erro ao carregar Dados Iniciais:', error);
    }
  }

  useEffect(() => {
    if (open) carregarDadosIniciais();
  }, [open]);

  const [form, setForm] = useState({
    nome_completo: '',
    cpf: '',
    rg: '',
    telefone: '',
    data_nascimento: '',
    sexo: '',
    estado_civil: '',
    email: '',
    franquia: '',
    credencial: '',
    senha: '',
    status: '',
    fotoFuncionario: null,
  });

  const [masked, setMasked] = useState({
    cpf: '',
    rg: '',
    telefone: '',
    data_nascimento: '',
  });

  const maskCPF = (v) =>
    v
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const maskRG = (v) =>
    v
      .replace(/\D/g, '')
      .slice(0, 9)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})$/, '$1-$2');

  const maskTelefone = (v) =>
    v
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');

  const maskData = (v) =>
    v
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2');

  const handleMaskedChange = (field, value, masker) => {
    const onlyNumbers = value.replace(/\D/g, '');

    setMasked((prev) => ({
      ...prev,
      [field]: masker(onlyNumbers),
    }));

    if (field === 'cpf') {
      setForm((prev) => ({ ...prev, cpf: onlyNumbers.slice(0, 11) }));
      return;
    }
    if (field === 'rg') {
      setForm((prev) => ({ ...prev, rg: onlyNumbers.slice(0, 9) }));
      return;
    }

    setForm((prev) => ({ ...prev, [field]: onlyNumbers }));
  };

  const validate = () => {
    for (const key of Object.keys(form)) {
      if (
        key !== 'fotoFuncionario' &&
        key !== 'senha' &&
        key !== 'status' &&
        form[key] === ''
      ) {
        toast.warning('Preencha todos os campos obrigatórios.');
        return false;
      }
    }
    if (!form.email.includes('@')) {
      toast.warning("O email deve conter '@'.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    enviarFuncionario();
  };

  useEffect(() => {
    if (franquiaOptions.length === 1) {
      setForm((f) => ({ ...f, franquia: franquiaOptions[0].value }));
    }
  }, [franquiaOptions]);

  const sexoOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
  ];

  const naoMatrizCargos = [
    { value: 2, label: 'Gerente de Loja' },
    { value: 3, label: 'Caixa' },
    { value: 4, label: 'Supervisor' },
  ];

  const estadoCivilOptions = [
    { value: 'Solteiro', label: 'Solteiro' },
    { value: 'Casado', label: 'Casado' },
    { value: 'Divorciado', label: 'Divorciado' },
    { value: 'Viúvo', label: 'Viúvo' },
    { value: 'Outro', label: 'Outro' },
  ];

  async function enviarFuncionario() {
    setEsperando(true);
    setEnviado(true);

    const cookie = getCookie('token');
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
      const response = await fetch(`http://localhost:8080/funcionarios`, {
        method: 'POST',
        cache: 'no-store',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.mensagem || `Funcionário ${data.funcionarioId} criado!`
        );
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error('Erro ao criar: ' + (data.mensagem || 'Erro desconhecido'));
      }
    } catch (error) {
      console.log('Erro ao enviar novo funcionário:', error);
      toast.error('Erro de conexão ao enviar funcionário');
    } finally {
      setEsperando(false);
      setEnviado(false);
    }
  }

  const inputClassName =
    '-mb-1 mt-1 flex h-10 w-full rounded-md border border-zinc-400 bg-[#133649] px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50';
  const labelClassName = 'text-sm font-medium text-zinc-400 block -mt-1';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#c1121f] hover:bg-[#9f0e19] text-white">
          + Novo Funcionário
        </Button>
      </DialogTrigger>

      <DialogContent
        className="bg-[#072536]
        border-zinc-800
        text-zinc-200
        sm:max-w-[750px]
        max-h-[95vh]
        w-[95vw]
        rounded-xl
        p-6
        overflow-y-auto
        mx-auto
        my-1"
      >
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold -mb-3">
            Adicionar Funcionário
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-zinc-800 mt-2 py-4">
          <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>

            {/* Nome */}
            <div>
              <Label className={labelClassName}>Nome Completo</Label>
              <input
                type="text"
                required
                placeholder="Nome Completo"
                className={inputClassName}
                value={form.nome_completo}
                onChange={(e) =>
                  setForm({ ...form, nome_completo: e.target.value })
                }
              />
            </div>

            {/* CPF + RG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className={labelClassName}>CPF</Label>
                <input
                  required
                  type="text"
                  placeholder="000.000.000-00"
                  className={inputClassName}
                  value={masked.cpf}
                  onChange={(e) =>
                    handleMaskedChange('cpf', e.target.value, maskCPF)
                  }
                />
              </div>

              <div>
                <Label className={labelClassName}>RG</Label>
                <input
                  required
                  type="text"
                  placeholder="00.000.000-0"
                  className={inputClassName}
                  value={masked.rg}
                  onChange={(e) =>
                    handleMaskedChange('rg', e.target.value, maskRG)
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label className={labelClassName}>Email</Label>
              <input
                required
                type="email"
                placeholder="email@musichouse.com"
                className={inputClassName}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Franquia + Credencial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className={labelClassName}>Franquia</Label>
                <Select
                  className="mt-1"
                  options={franquiaOptions}
                  value={
                    franquiaOptions.find((x) => x.value == form.franquia) ||
                    null
                  }
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      franquia: selected?.value || '',
                      credencial: '',
                    })
                  }
                  isDisabled={franquiaOptions.length === 1}
                  placeholder="Selecione a Franquia"
                  styles={selectStyle}
                />
              </div>

              <div>
                <Label className={labelClassName}>Cargo</Label>
                <Select
                  className="mt-1"
                  options={
                    form.franquia != 1 ? naoMatrizCargos : credencialOptions
                  }
                  value={
                    (form.franquia != 1
                      ? naoMatrizCargos
                      : credencialOptions
                    ).find((x) => x.value == form.credencial) || null
                  }
                  onChange={(selected) =>
                    setForm({ ...form, credencial: selected?.value || '' })
                  }
                  isDisabled={form.franquia === ''}
                  placeholder="Selecione o Cargo"
                  styles={selectStyle}
                />
              </div>
            </div>

            {/* Sexo + Estado Civil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className={labelClassName}>Sexo</Label>
                <Select
                  className="mt-1"
                  options={sexoOptions}
                  value={sexoOptions.find((x) => x.value == form.sexo) || null}
                  onChange={(selected) =>
                    setForm({ ...form, sexo: selected?.value || '' })
                  }
                  placeholder="Selecione"
                  styles={selectStyle}
                />
              </div>

              <div>
                <Label className={labelClassName}>Estado Civil</Label>
                <Select
                  className="mt-1"
                  options={estadoCivilOptions}
                  value={
                    estadoCivilOptions.find(
                      (x) => x.value == form.estado_civil
                    ) || null
                  }
                  onChange={(selected) =>
                    setForm({ ...form, estado_civil: selected?.value || '' })
                  }
                  placeholder="Selecione"
                  styles={selectStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className={labelClassName}>Telefone</Label>
                <input
                  required
                  type="text"
                  placeholder="(00) 00000-0000"
                  className={inputClassName}
                  value={masked.telefone}
                  onChange={(e) =>
                    handleMaskedChange('telefone', e.target.value, maskTelefone)
                  }
                />
              </div>

              <div>
                <Label className={labelClassName}>Data Nascimento</Label>
                <input
                  required
                  type="text"
                  placeholder="DD/MM/AAAA"
                  className={inputClassName}
                  value={masked.data_nascimento}
                  onChange={(e) =>
                    handleMaskedChange(
                      'data_nascimento',
                      e.target.value,
                      maskData
                    )
                  }
                />
              </div>
            </div>

            <div>
              <Label className={labelClassName}>
                Foto do Funcionário (opcional)
              </Label>
              <input
                type="file"
                accept="image/*"
                className="-mb-3 flex h-10 w-full rounded-md border border-zinc-700 bg-[#133649] px-3 py-2 text-sm text-zinc-400 file:mr-4 file:py-0 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#c1121f] file:text-white hover:file:bg-[#9f0e19] focus:outline-none"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setForm({ ...form, fotoFuncionario: e.target.files[0] });
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t border-zinc-800 pt-4 -mb-5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={esperando && enviado}
                className="bg-[#c1121f] hover:bg-[#9f0e19] text-white min-w-[120px]"
              >
                {esperando && enviado ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Processando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
