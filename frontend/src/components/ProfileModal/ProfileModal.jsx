"use client";

import { X, Pencil, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function ProfileModal({ open, onClose }) {
  const [funcionario, setFuncionario] = useState([]);
  const [locCargo, setLocCargo] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function lerUsuario() {
    const cookie = getCookie("token");

    try {
      const response = await fetch(`http://localhost:8080/funcionarios/detalhes`, {
        headers: { cookie },
        cache: "no-store",
        credentials: "include",
      });
      if (response.ok) setFuncionario(await response.json());
    } catch (error) {
      console.log("Erro ao carregar funcionario:", error);
    }

    try {
      const response = await fetch(`http://localhost:8080/funcionarios/cargo`, {
        headers: { cookie },
        cache: "no-store",
        credentials: "include",
      });
      if (response.ok) setLocCargo(await response.json());
    } catch (error) {
      console.log("Erro ao carregar localizacao e cargo:", error);
    }

    setCarregando(false);
  }

  useEffect(() => {
    lerUsuario();
  }, []);

  if (carregando) return <></>;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[390px] p-0 overflow-hidden rounded-xl">

        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Perfil do Usuário</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-0 bg-transparent border-none shadow-none outline-none hover:bg-transparent active:bg-transparent"
        >
          <X size={24} className="text-white hover:text-red-400 transition" strokeWidth={2.5} />
        </button>

        <div className="h-28 bg-red-500 relative flex justify-center items-end -mt-4">
          <img
            src="/perfil/fundoPerfil.png"
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />

          <div className="absolute bottom-[-64px] z-[999]">
            <div className="relative w-32 h-32">
              <img
                src={
                  funcionario.fotoFuncionario
                    ? `http://localhost:8080${funcionario.fotoFuncionario}`
                    : '/notFound/semFoto.png'
                }
                alt="Foto"
                className="w-32 h-32 rounded-full border-8 border-white object-cover"
              />
            </div>
          </div>
        </div>


        <div className="pt-20 px-6 pb-8 text-center">
          <p className="text-gray-500 text-sm italic -mt-10">{locCargo.cargo}</p>
          <h2 className="text-2xl text-[#003049] font-semibold">
            {funcionario.nome_completo}
          </h2>
          <p className="text-gray-600">{funcionario.email}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm pl-18 pr-6">
            <p className="italic">
              <strong className="text-[#003049]">CPF:</strong> {funcionario.cpf}
            </p>
            <p className="italic">
              <strong className="text-[#003049]">RG:</strong> {funcionario.rg}
            </p>
            <p className="italic">
              <strong className="text-[#003049]">Sexo:</strong> {funcionario.sexo}
            </p>
            <p className="italic">
              <strong className="text-[#003049]">Tel:</strong> {funcionario.telefone}
            </p>
            <p className="italic">
              <strong className="text-[#003049]">IDR:</strong> {funcionario.id_registro}
            </p>
            <p className="italic">
              <strong className="text-[#003049]">DN:</strong>{" "}
              {funcionario.data_nascimento || "Não Registrado"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
