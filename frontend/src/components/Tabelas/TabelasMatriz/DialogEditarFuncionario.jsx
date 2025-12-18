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
import { Loader2, Pencil } from 'lucide-react';
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

const inputClassName =
    '-mb-1 mt-1 flex h-10 w-full rounded-md border border-zinc-400 bg-[#133649] px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50';
const labelClassName = 'text-sm font-medium text-zinc-400 block -mt-1';


// -----------------------------------------------------------
// Componente principal de Edição
// -----------------------------------------------------------

export default function DialogEditarFuncionario({ funcionario, onAtualizado }) {
    const [open, setOpen] = useState(false);
    const [credencialOptions, setCredencialOptions] = useState([]);
    const [franquiaOptions, setFranquiaOptions] = useState([]);
    const [fotoExistenteUrl, setFotoExistenteUrl] = useState(null);
    const [esperando, setEsperando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    // FORMULARIO - Estado inicial vazio/padrão
    const [form, setForm] = useState({
        nome_completo: '',
        cpf: '',
        rg: '',
        telefone: '',
        data_nascimento: '',
        sexo: '',
        estado_civil: '',
        email: '',
        franquia: '', // id_franquia
        credencial: '', // id_credencial
        fotoFuncionario: null, // File object ou string 'REMOVER_FOTO'
    });

    const [masked, setMasked] = useState({
        cpf: '',
        rg: '',
        telefone: '',
        data_nascimento: '',
    });

    // MÁSCARAS (Idênticas ao CriarFuncionario)
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
                // Converte para o formato ISO 'AAAA-MM-DD' para o estado form
                setForm((prev) => ({ ...prev, data_nascimento: `${yyyy}-${mm}-${dd}` }));
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
        setForm({ ...form, fotoFuncionario: e.target.files[0] });
    }

    function handleRemovePhoto() {
        // Marcador especial para indicar ao backend que a foto deve ser removida
        setForm({ ...form, fotoFuncionario: 'REMOVER_FOTO' });
        setFotoExistenteUrl(null);
        document.getElementById('fotoFuncionarioInput').value = '';
    }

    const getCookie = (name) => {
        if (typeof document === 'undefined') return '';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    };

    // FUNÇÃO PARA CARREGAR DADOS EXISTENTES E OPÇÕES (Combinando as lógicas)
    async function carregarDadosDoFuncionarioEOpcoes() {
        if (!funcionario?.id_registro) return;
        const cookie = getCookie('token');

        try {
            // 1. Carregar dados do funcionário específico
            const resFuncionario = await fetch(
                `http://localhost:8080/funcionarios/${funcionario.id_registro}`,
                {
                    headers: { cookie: cookie },
                    cache: 'no-store',
                    credentials: 'include',
                }
            );
            const dataFuncionario = await resFuncionario.json();

            if (!resFuncionario.ok) {
                toast.error('Erro ao carregar dados do funcionário.');
                return;
            }
            
            // 2. Carregar opções (Franquias e Credenciais - lógica do CriarFuncionario)
            const resDetalhes = await fetch(
                `http://localhost:8080/funcionarios/detalhes`,
                {
                    headers: { cookie: cookie },
                    cache: 'no-store',
                    credentials: 'include',
                }
            );
            const dataDetalhes = await resDetalhes.json();


            // --- Processamento de Opções ---
            if (dataDetalhes.todasFranquias) {
                const franquiasSelect = dataDetalhes.todasFranquias.map((cada, index) => ({
                    value: cada.id_franquia,
                    label: `${index === 0 ? 'Matriz - ' : 'Music House - '}${cada.cidade}`,
                }));
                setFranquiaOptions(franquiasSelect);
            } else {
                setFranquiaOptions([
                    {
                        value: dataDetalhes.id_franquia,
                        label: `Music House ${dataDetalhes.filialEndereco}`,
                    },
                ]);
            }

            if (dataDetalhes.id_credencial === 1) {
                setCredencialOptions([{ value: 1, label: 'Administrador Matriz' }]);
            } else {
                setCredencialOptions([
                    { value: 2, label: 'Gerente de Loja' },
                    { value: 3, label: 'Caixa' },
                    { value: 4, label: 'Supervisor' },
                ]);
            }

            // --- Preenchimento do Formulário ---
            const d = dataFuncionario;

            const cpfLimpo = d.cpf ? String(d.cpf).replace(/\D/g, '') : '';
            const rgLimpo = d.rg ? String(d.rg).replace(/\D/g, '') : '';
            const telefoneLimpo = d.telefone
                ? String(d.telefone).replace(/\D/g, '')
                : '';

            let dataIso = d.data_nascimento
                ? String(d.data_nascimento).split('T')[0]
                : '';

            let maskedDataDisplay = '';
            if (dataIso) {
                const parts = dataIso.split('-');
                if (parts.length === 3) {
                    const [y, m, d] = parts;
                    maskedDataDisplay = `${d}/${m}/${y}`;
                }
            }
            
            if (d.fotoFuncionario) {
                setFotoExistenteUrl(`http://localhost:8080${d.fotoFuncionario}`);
            } else {
                setFotoExistenteUrl(null);
            }

            setForm({
                nome_completo: d.nome_completo || '',
                email: d.email || '',
                cpf: cpfLimpo,
                rg: rgLimpo,
                telefone: telefoneLimpo,
                data_nascimento: dataIso || '', // YYYY-MM-DD
                sexo: d.sexo || '',
                estado_civil: d.estado_civil || '',
                credencial:
                    d.id_credencial !== undefined && d.id_credencial !== null
                        ? Number(d.id_credencial)
                        : '',
                franquia: d.id_franquia !== undefined && d.id_franquia !== null
                        ? Number(d.id_franquia)
                        : '',
                fotoFuncionario: d.fotoFuncionario || null,
            });

            setMasked({
                cpf: maskCPF(cpfLimpo),
                rg: maskRG(rgLimpo),
                telefone: maskTelefone(telefoneLimpo),
                data_nascimento: maskedDataDisplay || '',
            });


        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            toast.error('Erro ao carregar dados iniciais para edição.');
        }
    }

    useEffect(() => {
        if (open) {
            carregarDadosDoFuncionarioEOpcoes();
        }
    }, [open, funcionario?.id_registro]);

    // VALIDAÇÃO (Idêntica ao CriarFuncionario, removendo senha e status)
    const validate = () => {
        // Campos obrigatórios (excluindo fotoFuncionario)
        const camposObrigatorios = [
            'nome_completo', 'cpf', 'rg', 'telefone', 'data_nascimento', 
            'sexo', 'estado_civil', 'email', 'franquia', 'credencial'
        ];

        for (const key of camposObrigatorios) {
            if (form[key] === '' || form[key] === null || form[key] === undefined) {
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


    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setEsperando(true);
        setEnviado(true);

        const cookie = getCookie('token');
        const formData = new FormData();

        // 1. Processar e adicionar campos de texto (usando valores limpos/formatados)
        const rgLimpo = form.rg ? String(form.rg).replace(/\D/g, '').slice(0, 9) : '';
        const cpfLimpo = form.cpf ? String(form.cpf).replace(/\D/g, '').slice(0, 11) : '';
        const telLimpo = form.telefone ? String(form.telefone).replace(/\D/g, '').slice(0, 11) : '';
        
        // A data já deve estar no formato YYYY-MM-DD no form.data_nascimento
        const dataConvertida = form.data_nascimento; 

        formData.append('nome_completo', form.nome_completo || '');
        formData.append('email', form.email || '');
        formData.append('cpf', cpfLimpo);
        formData.append('rg', rgLimpo);
        formData.append('telefone', telLimpo);
        formData.append('data_nascimento', dataConvertida || '');
        formData.append('sexo', form.sexo || '');
        formData.append('estado_civil', form.estado_civil || '');
        formData.append('credencial', form.credencial || '');
        formData.append('franquia', form.franquia || ''); 

      
        if (form.fotoFuncionario instanceof File) {
           
            formData.append('fotoFuncionario', form.fotoFuncionario);
        } else if (form.fotoFuncionario === 'REMOVER_FOTO') {
            
            formData.append('fotoFuncionario', 'REMOVER_FOTO_ESPECIFICO');
        } else if (form.fotoFuncionario === null && fotoExistenteUrl) {
      
        }

        try {
            const res = await fetch(
                `http://localhost:8080/funcionarios/${funcionario.id_registro}`,
                {
                    method: 'PUT', // ALTERADO PARA PUT
                    body: formData,
                    headers: { cookie: cookie },
                    cache: 'no-store',
                    credentials: 'include',
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error('Erro ao atualizar: ' + (data.mensagem || 'Erro desconhecido'));
                return;
            }

            toast.success(data.mensagem || `Funcionário #${funcionario.id_registro} atualizado!`);
            if (onAtualizado) onAtualizado();
            setOpen(false);

        } catch (err) {
            console.error('Erro ao conectar ao servidor:', err);
            toast.error('Erro de conexão ao atualizar funcionário.');
        } finally {
            setEsperando(false);
            setEnviado(false);
        }
    }


    // OPÇÕES DO SELECT (Idênticas ou adaptadas do CriarFuncionario)
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition">
                    <Pencil className="w-4 h-4 text-zinc-200" />
                </button>
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
                        Editar Funcionário #{funcionario?.id_registro}
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
                                name="nome_completo"
                                className={inputClassName}
                                value={form.nome_completo}
                                onChange={handleChange}
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
                                    name="cpf"
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
                                    name="rg"
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
                                name="email"
                                className={inputClassName}
                                value={form.email}
                                onChange={handleChange}
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
                                            credencial: '', // Limpar credencial ao mudar franquia
                                        })
                                    }
                                    placeholder="Selecione a Franquia"
                                    styles={selectStyle}
                                />
                            </div>

                            <div>
                                <Label className={labelClassName}>Cargo</Label>
                                <Select
                                    className="mt-1"
                                    options={
                                        // Filtra as opções de cargo se for Matriz (id=1) ou não
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

                        {/* Telefone + Data Nascimento */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className={labelClassName}>Telefone</Label>
                                <input
                                    required
                                    type="text"
                                    placeholder="(00) 00000-0000"
                                    name="telefone"
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
                                    name="data_nascimento"
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

                        {/* FOTO */}
                        <div className="space-y-2">
                            <Label className={labelClassName}>
                                Foto do Funcionário (opcional)
                            </Label>
                            <input
                                type="file"
                                id="fotoFuncionarioInput"
                                accept="image/*"
                                className="-mb-3 flex h-10 w-full rounded-md border border-zinc-700 bg-[#133649] px-3 py-2 text-sm text-zinc-400 file:mr-4 file:py-0 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#c1121f] file:text-white hover:file:bg-[#9f0e19] focus:outline-none"
                                onChange={handleFileChange}
                            />
                        </div>


                        {/* Botões de Ação */}
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
                                    'Salvar Alterações'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}