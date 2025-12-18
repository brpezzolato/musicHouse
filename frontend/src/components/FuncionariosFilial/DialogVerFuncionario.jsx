'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Eye } from 'lucide-react';
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
    backgroundColor: isSelected ? '#003049' : isFocused ? '#C1121F' : 'white',
    color: isFocused || isSelected ? 'white' : '#003049',
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '6px',
    overflow: 'hidden',
  }),
};

export default function DialogEditarFuncionario({ funcionario, onAtualizado }) {
  const [open, setOpen] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

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

  const [form, setForm] = useState({
    nome_completo: '',
    email: '',
    cpf: '',
    rg: '',
    telefone: '',
    data_nascimento: '',
    sexo: '',
    estado_civil: '',
    credencial: '',
    foto: null,
  });

  const [masked, setMasked] = useState({
    cpf: '',
    rg: '',
    telefone: '',
    data_nascimento: '',
  });

  useEffect(() => {
    if (!open || !funcionario?.id_registro) return;

    async function carregarDados() {
      try {
        const res = await fetch(
          `http://localhost:8080/funcionarios/${funcionario.id_registro}`
        );
        const data = await res.json();

        if (res.ok) {
          const cpfLimpo = data.cpf ? String(data.cpf).replace(/\D/g, '') : '';
          const rgLimpo = data.rg ? String(data.rg).replace(/\D/g, '') : '';
          const telefoneLimpo = data.telefone
            ? String(data.telefone).replace(/\D/g, '')
            : '';

          let dataIso = data.data_nascimento
            ? String(data.data_nascimento).split('T')[0]
            : '';

          let maskedDataDisplay = '';
          if (dataIso) {
            const parts = dataIso.split('-');
            if (parts.length === 3) {
              const [y, m, d] = parts;
              maskedDataDisplay = `${d}/${m}/${y}`;
            }
          }

          setForm({
            nome_completo: data.nome_completo || '',
            email: data.email || '',
            cpf: cpfLimpo,
            rg: rgLimpo,
            telefone: telefoneLimpo,
            data_nascimento: dataIso || '',
            sexo: data.sexo || '',
            estado_civil: data.estado_civil || '',
            credencial:
              data.id_credencial !== undefined && data.id_credencial !== null
                ? Number(data.id_credencial)
                : '',
            foto: null,
          });

          setMasked({
            cpf: maskCPF(cpfLimpo),
            rg: maskRG(rgLimpo),
            telefone: maskTelefone(telefoneLimpo),
            data_nascimento: maskedDataDisplay || '',
          });
        }
      } catch (err) {}
    }

    carregarDados();
  }, [open, funcionario?.id_registro]);

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

    if (field === 'telefone') {
      setForm((prev) => ({ ...prev, telefone: onlyNumbers.slice(0, 11) }));
      return;
    }

    if (field === 'data_nascimento') {
      const nums = onlyNumbers.slice(0, 8);
      if (nums.length === 8) {
        const dd = nums.slice(0, 2);
        const mm = nums.slice(2, 4);
        const yyyy = nums.slice(4, 8);
        setForm((prev) => ({
          ...prev,
          data_nascimento: `${yyyy}-${mm}-${dd}`,
        }));
      } else {
        setForm((prev) => ({ ...prev, data_nascimento: '' }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [field]: onlyNumbers }));
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    setForm({ ...form, foto: e.target.files[0] });
  }

  async function handleSubmit(e) {
    e.preventDefault();
  }

  const sexoOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
  ];

  const estadoCivilOptions = [
    { value: 'Solteiro', label: 'Solteiro' },
    { value: 'Casado', label: 'Casado' },
    { value: 'Divorciado', label: 'Divorciado' },
    { value: 'Viúvo', label: 'Viúvo' },
    { value: 'Outro', label: 'Outro' },
  ];

  const credencialOptions = [
    { value: 2, label: 'Gerente' },
    { value: 3, label: 'Caixa' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition">
          <Eye className="w-4 h-4 text-zinc-200" />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#18181b] text-white border border-zinc-700 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Ver Dados do Funcionário #{funcionario?.id_registro}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* NOME + EMAIL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1">Nome Completo</Label>
              <Input
                placeholder="Nome Completo"
                name="nome_completo"
                value={form.nome_completo}
                onChange={handleChange}
                className="bg-[#27272a] border-zinc-700 text-white"
                disabled
              />
            </div>

            <div>
              <Label className="mb-1">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="email@musichouse.com"
                value={form.email}
                onChange={handleChange}
                className="bg-[#27272a] border-zinc-700 text-white"
                disabled
              />
            </div>
          </div>

          {/* CPF / RG / TELEFONE */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="mb-1">CPF</Label>
              <Input
                placeholder="000.000.000-00"
                name="cpf"
                value={masked.cpf}
                onChange={(e) =>
                  handleMaskedChange('cpf', e.target.value, maskCPF)
                }
                className="bg-[#27272a] border-zinc-700 text-white"
                disabled
              />
            </div>

            <div>
              <Label className="mb-1">RG</Label>
              <Input
                placeholder="00.000.000-0"
                name="rg"
                value={masked.rg}
                onChange={(e) =>
                  handleMaskedChange('rg', e.target.value, maskRG)
                }
                className="bg-[#27272a] border-zinc-700 text-white"
                disabled
              />
            </div>

            <div>
              <Label className="mb-1">Telefone</Label>
              <Input
                placeholder="(00) 00000-0000"
                name="telefone"
                value={masked.telefone}
                onChange={(e) =>
                  handleMaskedChange('telefone', e.target.value, maskTelefone)
                }
                className="bg-[#27272a] border-zinc-700 text-white"
                disabled
              />
            </div>
          </div>

          {/* DATA DE NASCIMENTO */}
          <div>
            <Label className="mb-1">Data de Nascimento</Label>
            <Input
              placeholder="DD/MM/AAAA"
              name="data_nascimento"
              value={masked.data_nascimento}
              onChange={(e) =>
                handleMaskedChange('data_nascimento', e.target.value, maskData)
              }
              className="bg-[#27272a] border-zinc-700 text-white"
              disabled
            />
          </div>

          {/* SELECTS */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Sexo</Label>
              <Select
                options={sexoOptions}
                value={sexoOptions.find((x) => x.value === form.sexo)}
                onChange={(opt) =>
                  setForm({ ...form, sexo: opt ? opt.value : '' })
                }
                styles={selectStyle}
                placeholder="Selecione"
                isDisabled
                className="mt-1"
              />
            </div>

            <div>
              <Label>Estado Civil</Label>
              <Select
                options={estadoCivilOptions}
                value={estadoCivilOptions.find(
                  (x) => x.value === form.estado_civil
                )}
                onChange={(opt) =>
                  setForm({ ...form, estado_civil: opt ? opt.value : '' })
                }
                styles={selectStyle}
                placeholder="Selecione"
                isDisabled
                className="mt-1"
              />
            </div>

            <div>
              <Label>Cargo</Label>
              <Select
                options={credencialOptions}
                value={credencialOptions.find(
                  (x) => x.value === form.credencial
                )}
                onChange={(opt) =>
                  setForm({ ...form, credencial: opt ? Number(opt.value) : '' })
                }
                styles={selectStyle}
                placeholder="Selecione o Cargo"
                isDisabled
                className="mt-1"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="bg-[#c1121f] hover:bg-[#9f0e19] text-white hover:text-white"
            >
              Fechar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
