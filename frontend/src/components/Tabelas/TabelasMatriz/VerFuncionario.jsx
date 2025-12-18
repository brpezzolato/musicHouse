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

export default function DialogEditarFuncionario({ funcionario, onAtualizado }) {
  const [open, setOpen] = useState(false);
  const [franquia, setFranquia] = useState(null); 

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
    credencial: '', // Aqui você terá o id_credencial
    foto: null,
    franquia: '',
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
        const resFuncionario = await fetch(
          `http://localhost:8080/funcionarios/${funcionario.id_registro}`
        );
        const dataFuncionario = await resFuncionario.json();

        if (resFuncionario.ok) {
          const cpfLimpo = dataFuncionario.cpf ? String(dataFuncionario.cpf).replace(/\D/g, '') : '';
          const rgLimpo = dataFuncionario.rg ? String(dataFuncionario.rg).replace(/\D/g, '') : '';
          const telefoneLimpo = dataFuncionario.telefone
            ? String(dataFuncionario.telefone).replace(/\D/g, '')
            : '';

          let dataIso = dataFuncionario.data_nascimento
            ? String(dataFuncionario.data_nascimento).split('T')[0]
            : '';

          let maskedDataDisplay = '';
          if (dataIso) {
            const parts = dataIso.split('-');
            if (parts.length === 3) {
              const [y, m, d] = parts;
              maskedDataDisplay = `${d}/${m}/${y}`;
            }
          }

          // Carregar dados do funcionário
          setForm({
            nome_completo: dataFuncionario.nome_completo || '',
            email: dataFuncionario.email || '',
            cpf: cpfLimpo,
            rg: rgLimpo,
            telefone: telefoneLimpo,
            data_nascimento: dataIso || '',
            sexo: dataFuncionario.sexo || '',
            estado_civil: dataFuncionario.estado_civil || '',
            credencial: dataFuncionario.id_credencial || '', // Agora estamos atribuindo o id_credencial
            foto: null,
            franquia: dataFuncionario.franquia || '',
          });

          setMasked({
            cpf: maskCPF(cpfLimpo),
            rg: maskRG(rgLimpo),
            telefone: maskTelefone(telefoneLimpo),
            data_nascimento: maskedDataDisplay || '',
          });

          const resFranquia = await fetch(
            `http://localhost:8080/franquias/${dataFuncionario.id_franquia}`
          );
          const dataFranquia = await resFranquia.json();
          if (resFranquia.ok) {
            setFranquia(dataFranquia.cidade); 
          }
        }
      } catch (err) {
        console.error(err);
      }
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
    { value: 1, label: 'Administrador' },
    { value: 2, label: 'Gerente' },
    { value: 3, label: 'Caixa' },
    { value: 4, label: 'Supervisor' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition">
          <Eye className="w-4 h-4 text-zinc-200" />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#072536] text-white border border-zinc-700 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Ver Dados do Funcionário #{funcionario?.id_registro}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1">Nome Completo</Label>
              <Input
                placeholder="Nome Completo"
                name="nome_completo"
                value={form.nome_completo}
                onChange={handleChange}
                className="bg-[#133649] border-[#c0c0c0] border-2 text-white"
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
                className="bg-[#133649] border-[#c0c0c0] border-2 text-white"
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
                className="bg-[#133649] border-[#c0c0c0] border-2 text-white"
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
                className="bg-[#133649] border-[#c0c0c0] border-2 text-white"
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
                className="bg-[#133649] border-[#c0c0c0] border-2 text-white"
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
              className="bg-[#133649] border-[#c0c0c0] border-2 text-white"
              disabled
            />
          </div>

          {/* Franquia */}
          <div>
            <Label className="mb-1">Franquia</Label>
            <Input
              placeholder="Franquia"
              name="franquia"
              value={franquia || 'Carregando...'} 
              className="bg-[#133649] border-[#c0c0c0] border-2 text-white"
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
                  (option) => option.value === form.credencial
                )}
                onChange={(opt) =>
                  setForm({ ...form, credencial: opt ? opt.value : '' })
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
