"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Select from "react-select";
import { createPortal } from "react-dom";

const selectStyle = {
  control: (base) => ({
    ...base,
    borderRadius: "16px",
    borderColor: "#264f64",
    borderWidth: "1px",
    backgroundColor: "#e4e7eb",
    minHeight: "32px", // menor
    padding: "0px 4px", // menor
    boxShadow: "none",
    cursor: "not-allowed",
    "&:hover": { borderColor: "#264f64" },
    fontSize: "0.80rem", // reduzido
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 6px",
    color: "#494e5c",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#494e5c",
    fontSize: "0.80rem", // menor
  }),

  placeholder: (base) => ({
    ...base,
    color: "#494e5c",
    fontSize: "0.80rem",
  }),

  menu: (base) => ({
    ...base,
    display: "none",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#494e5c",
    cursor: "not-allowed",
  }),

  option: (base) => ({
    ...base,
    fontSize: "0.80rem",
    backgroundColor: "#e4e7eb",
    color: "#494e5c",
    cursor: "not-allowed",
  }),
};

export default function BotaoVerFuncionario({ funcionario }) {
  const [open, setOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    const existing = document.getElementById("modal-root");
    if (existing) {
      setPortalRoot(existing);
      return;
    }
    const el = document.createElement("div");
    el.id = "modal-root";
    document.body.appendChild(el);
    setPortalRoot(el);

    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  const dados = {
    nome_completo: funcionario?.nome_completo || "",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    telefone: "(11) 99999-0000",
    data_nascimento: funcionario?.data_nascimento,
    data_criacao: "22/02/2008",
    sexo: "Masculino",
    estado_civil: "Solteiro",
    email: "email@exemplo.com",
    franquia: "Music House 2",
    credencial:
      funcionario?.cargo === "Gerente"
        ? "Gerente de Loja"
        : funcionario?.cargo || "",
    status: funcionario?.status || "Ativo",
  };

  const Label = ({ children }) => (
    <label className="text-[10px] font-semibold text-[#003049] ml-1">
      {children}
    </label>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
      >
        <Eye className="w-4 h-4 text-zinc-200" />
      </button>

      {open &&
        portalRoot &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] grid place-items-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-5 w-[450px] rounded-lg shadow-xl" // menor
            >
              <h2 className="text-lg font-bold text-[#003049] mb-1">
                Dados do Funcionário
              </h2>

              <div className="space-y-2 border-t border-slate-200 pt-3">

                {/* NOME */}
                <div className="flex flex-col">
                  <Label>Nome Completo</Label>
                  <input
                    disabled
                    value={dados.nome_completo}
                    className="p-1.5 w-full border border-[#003049] rounded bg-gray-200 text-gray-700 text-sm"
                  />
                </div>

                {/* CPF / RG */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <Label>CPF</Label>
                    <input
                      disabled
                      value={dados.cpf}
                      className="p-1.5 border border-[#003049] rounded bg-gray-200 text-gray-700 text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label>RG</Label>
                    <input
                      disabled
                      value={dados.rg}
                      className="p-1.5 border border-[#003049] rounded bg-gray-200 text-gray-700 text-sm"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex flex-col">
                  <Label>Email</Label>
                  <input
                    disabled
                    value={dados.email}
                    className="p-1.5 w-full border border-[#003049] rounded bg-gray-200 text-gray-700 text-sm"
                  />
                </div>

                {/* DATAS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <Label>Data de Nascimento</Label>
                    <input
                      disabled
                      value={dados.data_nascimento}
                      className="p-1.5 border border-[#003049] rounded bg-gray-200 text-gray-700 text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label>Data de Criação</Label>
                    <input
                      disabled
                      value={dados.data_criacao}
                      className="p-1.5 border border-[#003049] rounded bg-gray-200 text-gray-700 text-sm"
                    />
                  </div>
                </div>

                {/* SEXO E ESTADO CIVIL */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <LabelSexo</Label>
                    <Select
                      isDisabled
                      styles={selectStyle}
                      defaultValue={{ value: dados.sexo, label: dados.sexo }}
                      options={[{ value: dados.sexo, label: dados.sexo }]}

                   />
                  </div>

                  <div className="flex flex-col">
                    <Label>Estado Civil</Label>
                    <Select
                      isDisabled
                      styles={selectStyle}
                      defaultValue={{
                        value: dados.estado_civil,
                        label: dados.estado_civil,
                      }}
                      options={[
                        {
                          value: dados.estado_civil,
                          label: dados.estado_civil,
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* FRANQUIA E CREDENCIAL */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <Label>Franquia</Label>
                    <Select
                      isDisabled
                      styles={selectStyle}
                      defaultValue={{
                        value: dados.franquia,
                        label: dados.franquia,
                      }}
                      options={[
                        { value: dados.franquia, label: dados.franquia },
                      ]}
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label>Credencial</Label>
                    <Select
                      isDisabled
                      styles={selectStyle}
                      defaultValue={{
                        value: dados.credencial,
                        label: dados.credencial,
                      }}
                      options={[
                        { value: dados.credencial, label: dados.credencial },
                      ]}
                    />
                  </div>
                </div>

                {/* TELEFONE E STATUS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <Label>Telefone</Label>
                    <input
                      disabled
                      value={dados.telefone}
                      className="p-1.5 border border-[#003049] rounded bg-gray-200 text-gray-700 text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label>Status</Label>
                    <Select
                      isDisabled
                      styles={selectStyle}
                      defaultValue={{
                        value: dados.status,
                        label: dados.status,
                      }}
                      options={[
                        { value: dados.status, label: dados.status },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-1 bg-[#780000] text-white rounded-md hover:bg-[#520000] text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
}
