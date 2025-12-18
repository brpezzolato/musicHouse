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
import { Loader2 } from 'lucide-react';
import Select from 'react-select';

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: '99999px',
    borderColor: state.isFocused ? '#403a3f' : '#403a3f',
    padding: '2px',
    minHeight: '40px',
    boxShadow: state.isFocused ? '0 0 0 1px #403a3f' : 'none',
    '&:hover': { borderColor: '#403a3f' },
    backgroundColor: '#27272a',
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


export default function ModalAddFuncionario({ onSuccess }) {
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
            label: `${index === 0 ? 'Matriz - ' : 'Music House - '}${cada.cidade}`
          }));
          setFranquiaOptions(franquiasSelect);
        } else {
          setFranquiaOptions([{
            value: data.id_franquia,
            label: `Music House ${data.filialEndereco}`
          }]);
        }

        if (data.id_credencial === 1) {
          setCredencialOptions([{
            value: 1,
            label: 'Administrador Matriz'
          }]);
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
    if (open) {
      carregarDadosIniciais();
    }
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
    v.replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const maskRG = (v) =>
    v.replace(/\D/g, '').slice(0, 9)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})$/, '$1-$2');

  const maskTelefone = (v) =>
    v.replace(/\D/g, '').slice(0, 11)
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');

  const maskData = (v) =>
    v.replace(/\D/g, '').slice(0, 8)
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2');

  const handleMaskedChange = (field, value, masker) => {
    const onlyNumbers = value.replace(/\D/g, '');

    setMasked((prev) => ({
      ...prev,
      [field]: masker(onlyNumbers),
    }));

    if (field === "cpf") {
      setForm((prev) => ({ ...prev, cpf: onlyNumbers.slice(0, 11) }));
      return;
    }
    if (field === "rg") {
      setForm((prev) => ({ ...prev, rg: onlyNumbers.slice(0, 9) }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: onlyNumbers }));
  };

  const validate = () => {
    for (const key of Object.keys(form)) {
      if (key !== 'fotoFuncionario' && key !== 'senha' && key !== 'status' && form[key] === '') {
        alert('Preencha todos os campos obrigatórios.');
        return false;
      }
    }
    if (!form.email.includes('@')) {
      alert("O email deve conter '@'.");
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

    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
      const response = await fetch(
        `http://localhost:8080/funcionarios`,
        {
          method: 'POST',
          headers: {
            cookie: cookie,

          },
          cache: 'no-store',
          credentials: 'include',
          body: formData,
        }
      );
      const data = await response.json();

      if (response.ok) {

        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        alert('Erro ao criar: ' + (data.mensagem || 'Erro desconhecido'));
      }
    } catch (error) {
      console.log('Erro ao enviar novo funcionario:', error);
      alert('Erro ao enviar novo funcionario:', error);
    } finally {
      setEsperando(false);
      setEnviado(false);
    }
  }

  const inputClassName = "flex h-10 w-full rounded-md border border-zinc-700 bg-[#27272a] px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#c1121f] -mb-2 disabled:cursor-not-allowed disabled:opacity-50";
  const labelClassName = "text-sm font-medium text-zinc-400 mb-0.5 block";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded bg-zinc-900 py-3 px-4 text-sm text-white hover:bg-bg-zinc-300 ml-2 font-semibold transition-colors">
          + Adicionar Funcionário
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#18181b] border-zinc-800 text-zinc-200 sm:max-w-[600px] sm:max-h-[80vh] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold -mt-1 -mb-2">
            Adicionar Funcionário
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-zinc-800 mt-2 py-2">
          <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className={labelClassName}>Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Nome Completo"
                  className={inputClassName}
                  value={form.nome_completo}
                  onChange={(e) => setForm({ ...form, nome_completo: e.target.value })}
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelClassName}>Email</label>
                <input
                  required
                  type="email"
                  placeholder="email@musichouse.com"
                  className={inputClassName}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* CPF + RG */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClassName}>CPF</label>
                <input
                  required
                  type="text"
                  placeholder="000.000.000-00"
                  className={inputClassName}
                  value={masked.cpf}
                  onChange={(e) => handleMaskedChange('cpf', e.target.value, maskCPF)}
                />
              </div>
              <div>
                <label className={labelClassName}>RG</label>
                <input
                  required
                  type="text"
                  placeholder="00.000.000-0"
                  className={inputClassName}
                  value={masked.rg}
                  onChange={(e) => handleMaskedChange('rg', e.target.value, maskRG)}
                />
              </div>
              <div>
                <label className={labelClassName}>Telefone</label>
                <input
                  required
                  type="text"
                  placeholder="(00) 00000-0000"
                  className={inputClassName}
                  value={masked.telefone}
                  onChange={(e) => handleMaskedChange('telefone', e.target.value, maskTelefone)}
                />
              </div>
            </div>

            {/* Sexo + Estado Civil */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClassName}>Sexo</label>
                <Select
                  options={sexoOptions}
                  value={sexoOptions.find((opt) => opt.value === form.sexo)}
                  onChange={(selectedOption) => setForm({ ...form, sexo: selectedOption.value })}
                  styles={selectStyle}
                  placeholder="Selecione"
                />
              </div>
              <div>
                <label className={labelClassName}>Estado Civil</label>
                <Select
                  options={estadoCivilOptions}
                  value={estadoCivilOptions.find((opt) => opt.value === form.estado_civil)}
                  onChange={(selectedOption) => setForm({ ...form, estado_civil: selectedOption.value })}
                  styles={selectStyle}
                  placeholder="Selecione"
                />
              </div>

              <div>
                <label className={labelClassName}>Data Nascimento</label>
                <input
                  required
                  type="text"
                  placeholder="DD/MM/AAAA"
                  className={inputClassName}
                  value={masked.data_nascimento}
                  onChange={(e) => handleMaskedChange('data_nascimento', e.target.value, maskData)}
                />
              </div>
            </div>

            {/* Franquia + Credencial */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClassName}>Franquia</label>
                <Select
                  options={franquiaOptions}
                  value={franquiaOptions.find((opt) => opt.value === form.franquia)}
                  onChange={(selectedOption) => setForm({ ...form, franquia: selectedOption.value })}
                  styles={selectStyle}
                  placeholder="Selecione a Franquia"
                  isDisabled={franquiaOptions.length === 1}
                  menuPlacement="top"
                />
              </div>
              <div>
                <label className={labelClassName}>Cargo</label>
                <Select
                  options={form.franquia !== 1 ? naoMatrizCargos : credencialOptions}
                  value={(form.franquia !== 1 ? naoMatrizCargos : credencialOptions).find(
                    (opt) => opt.value === form.credencial
                  )}
                  onChange={(selectedOption) => setForm({ ...form, credencial: selectedOption.value })}
                  styles={selectStyle}
                  placeholder="Selecione o Cargo"
                />
              </div>
            </div>

            {/* Foto */}
            <div>
              <label className={labelClassName}>Foto do Funcionário (opcional)</label>
              <input
                type="file"
                accept="image/*"
                className="flex w-full rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-400 file:mr-4 file:py-0 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-semibold  file:text-white focus:outline-none"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setForm({ ...form, fotoFuncionario: e.target.files[0] });
                  }
                }}
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 mt-2 border-t border-zinc-800 pt-2">
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
                {(esperando && enviado) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
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