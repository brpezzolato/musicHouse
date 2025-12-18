'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Select from 'react-select';
import { Pencil, Trash2 } from "lucide-react";


export default function BotaoEditarFuncionario() {
    const [open, setOpen] = useState(false);
    const [portalRoot, setPortalRoot] = useState(null);

    const dadosIniciais = {
        id_credencial: 2,
        cidadeFilial: "São Paulo"
    };

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

    const franquiaOptions = [
        { value: 1, label: "Matriz - São Paulo" },
        { value: 2, label: "Music House - Santos" },
        { value: 3, label: "Music House - Campinas" },
    ];

    const credencialOptions = [
        { value: 2, label: 'Gerente de Loja' },
        { value: 3, label: 'Caixa' },
        { value: 4, label: 'Supervisor' },
    ];

    const statusOptions = [
        { value: 1, label: 'Ativo' },
        { value: 2, label: 'Inativo' },
    ];


    useEffect(() => {
        const existing = document.getElementById('modal-root');
        if (existing) {
            setPortalRoot(existing);
            return;
        }
        const el = document.createElement('div');
        el.id = 'modal-root';
        document.body.appendChild(el);
        setPortalRoot(el);
        return () => {
            if (el.parentNode) el.parentNode.removeChild(el);
        };
    }, []);

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

    // -------------------- Máscaras --------------------
    const maskCPF = (v) =>
        v.replace(/\D/g, '')
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    const maskRG = (v) =>
        v.replace(/\D/g, '')
            .slice(0, 9)
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1})$/, '$1-$2');

    const maskTelefone = (v) =>
        v.replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);

    const maskData = (v) =>
        v.replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .slice(0, 10);

    const handleMaskedChange = (field, value, masker) => {
        setMasked((prev) => ({ ...prev, [field]: masker(value) }));

        setForm((prev) => ({
            ...prev,
            [field]: value.replace(/\D/g, ''),
        }));
    };

    const handleSubmit = () => {
        console.log('FORMULÁRIO FINAL', form);
        alert("Funcionário cadastrado (simulação)");
        setOpen(false);
    };

    // -------------------- Estilo React-Select --------------------
    const selectStyle = {
        control: (base, state) => ({
            ...base,
            borderRadius: '99999px',
            borderColor: state.isFocused ? '#003049' : '#003049',
            padding: '2px',
            minHeight: '40px',
            boxShadow: state.isFocused ? '0 0 0 1px #003049' : 'none',
            '&:hover': { borderColor: '#003049' },
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 8px',
        }),
        singleValue: (base) => ({
            ...base,
            color: '#003049',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#5a7a95',
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

    // -------------------- FUMAÇA AZUL PARA INPUTS --------------------
    const inputFocus =
  "border border-[#003049] p-2 rounded-md focus:ring-1 focus:ring-[#003049] focus:outline-none";

    // -------------------- MODAL --------------------
    const modalContent = (
        <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9999] grid h-screen w-screen place-items-center backdrop-blur-md bg-black/10"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 p-6 w-2/5 min-w-[320px] max-w-[40%] rounded-lg bg-white shadow-lg"
            >
                <div className="flex items-center pb-4 text-xl font-bold text-[#003049]">
                    Editar Funcionário
                </div>

                {/* FORM */}
                <div className="border-t border-slate-200 py-2 text-slate-700">
                    <div className="grid grid-cols-1 gap-4">

                        {/* Nome */}
                        <input
                            type="text"
                            required
                            placeholder="Nome Completo"
                            className={inputFocus}
                            value={form.nome_completo}
                            onChange={(e) =>
                                setForm({ ...form, nome_completo: e.target.value })
                            }
                        />

                        {/* CPF + RG */}
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="CPF"
                                className={inputFocus}
                                value={masked.cpf}
                                onChange={(e) =>
                                    handleMaskedChange('cpf', e.target.value, maskCPF)
                                }
                            />

                            <input
                                type="text"
                                placeholder="RG"
                                className={inputFocus}
                                value={masked.rg}
                                onChange={(e) =>
                                    handleMaskedChange('rg', e.target.value, maskRG)
                                }
                            />
                        </div>

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="Email"
                            className={inputFocus}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />

                        {/* Franquia + Credencial + Status */}
                        <div className="grid grid-cols-3 gap-3">
                            <Select
                                styles={selectStyle}
                                options={franquiaOptions}
                                placeholder="Franquia"
                                onChange={(opt) =>
                                    setForm({ ...form, franquia: opt.value, credencial: '' })
                                }
                            />

                            <Select
                                styles={selectStyle}
                                options={credencialOptions}
                                placeholder="Credencial"
                                onChange={(opt) =>
                                    setForm({ ...form, credencial: opt.value })
                                }
                            />

                            <Select
                                styles={selectStyle}
                                options={statusOptions}
                                placeholder="Status"
                                onChange={(opt) =>
                                    setForm({ ...form, status: opt.value })
                                }
                            />
                        </div>

                        {/* Sexo + Estado Civil */}
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                styles={selectStyle}
                                options={sexoOptions}
                                placeholder="Sexo"
                                onChange={(opt) => setForm({ ...form, sexo: opt.value })}
                            />

                            <Select
                                styles={selectStyle}
                                options={estadoCivilOptions}
                                placeholder="Estado Civil"
                                onChange={(opt) =>
                                    setForm({ ...form, estado_civil: opt.value })
                                }
                            />
                        </div>

                        {/* Telefone + Data */}
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Telefone"
                                className={inputFocus}
                                value={masked.telefone}
                                onChange={(e) =>
                                    handleMaskedChange('telefone', e.target.value, maskTelefone)
                                }
                            />

                            <input
                                type="text"
                                placeholder="Data de Nascimento"
                                className={inputFocus}
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

                        {/* Foto + Senha */}
                        <label className="grid grid-cols-2 gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                className={inputFocus}
                                onChange={(e) =>
                                    setForm({ ...form, fotoFuncionario: e.target.files[0] })
                                }
                            />

                            <input
                                type="text"
                                required
                                placeholder="Senha"
                                className={inputFocus}
                                value={form.senha}
                                onChange={(e) =>
                                    setForm({ ...form, senha: e.target.value })
                                }
                            />
                        </label>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-md py-2 px-4 text-sm text-slate-600 hover:bg-slate-100"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="rounded-md bg-[#780000] py-2 px-4 text-sm text-white ml-2 hover:bg-[#520000]"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="flex flex-col justify-end font-semibold">
                <button
                    onClick={() => setOpen(true)}
                    className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                >
                    <Pencil className="w-4 h-4 text-white" />
                </button>
            </div>

            {portalRoot && open && createPortal(modalContent, portalRoot)}
        </>
    );
}
