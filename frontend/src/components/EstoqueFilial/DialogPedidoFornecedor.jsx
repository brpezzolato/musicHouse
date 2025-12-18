'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, AlertCircle } from 'lucide-react';
import Select from 'react-select';
import { Input } from "@/components/ui/input";
import {
  Package,
  Barcode,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { getCookie } from 'cookies-next/client';

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

export default function DialogPedidoFornecedor({
  id, categoria, produto, sku, quantidadeProduto, aviso
}) {
  const [open, setOpen] = useState(false);
  const [quantidade, setQuantidade] = useState(10);
  const [observacao, setObservacao] = useState("");
  const [prioridade, setPrioridade] = useState("Média");
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const token = getCookie('token');
    setCookie(token);
  }, []);

  const handleConfirmarPedido = async () => {
    if (!cookie) {
      setApiError("Token de autenticação não encontrado. Faça login novamente.");
      return;
    }

    if (!quantidade || parseInt(quantidade) <= 0) {
      setApiError("A quantidade deve ser um número positivo.");
      return;
    }

    setApiError(null);

    try {
      setLoading(true);

      const movimentacaoData = {
        quantidade_movimentada: parseInt(quantidade),
        observacao: observacao,
        prioridade: prioridade,
        tipo_movimentacao: "entrada",
      };

      const response = await fetch(
        `http://localhost:8080/estoque/pedidosMatriz/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: 'no-store',
          credentials: 'include',
          body: JSON.stringify(movimentacaoData),
        }
      );

      let result;
      try {
        result = await response.json();
      } catch (e) {
        result = { message: `Resposta do servidor não pôde ser lida (Status: ${response.status})` };
      }

      if (!response.ok) {
        setApiError(result.menssagem || "Ocorreu um erro desconhecido ao processar o pedido.");
        return; 
      }


      setOpen(false);
      console.log("Pedido confirmado com sucesso:", result);
    } catch (error) {
      console.error("Erro ao confirmar pedido:", error);
      setApiError(error.message || "Ocorreu um erro desconhecido ao processar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  const prioridadeOptions = [
    { value: "Alta", label: "Alta" },
    { value: "Média", label: "Média" },
    { value: "Baixa", label: "Baixa" },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpenState) => {
        setOpen(newOpenState);
        if (!newOpenState) {
          setApiError(null); // Se o dialog for fechado, limpa o erro
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition">
          <Package className="w-5 h-5 text-zinc-200" />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#0d0d0d] text-zinc-200 border border-zinc-700 max-w-xl rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 text-xl font-bold tracking-wide">
            Pedido a matriz
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-xl p-4 bg-[#161616] border border-zinc-700 space-y-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase font-semibold">Produto</p>
            <p className="text-lg font-bold text-white">{produto}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-zinc-400" />
              <span className="text-zinc-400">Categoria:</span>
              <span className="text-white font-semibold">{categoria}</span>
            </div>

            <div className="flex items-center gap-2">
              <Barcode size={16} className="text-zinc-400" />
              <span className="text-zinc-400">SKU:</span>
              <span className="text-white font-semibold">{sku}</span>
            </div>

            <div className="flex items-center gap-2">
              <Package size={16} className="text-zinc-400" />
              <span className="text-zinc-400">Estoque atual:</span>
              <span className="text-white font-semibold">{quantidadeProduto} un</span>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-400" />
              <span className="text-zinc-400">Estoque mínimo:</span>
              <span className="text-yellow-400 font-semibold">{aviso} un</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 mt-4">
          <div>
            <label className="text-sm text-zinc-400 font-semibold">Quantidade a ser adicionada</label>
            <Input
              type="text"
              value={quantidade}
              onChange={(e) => {
                const newValue = e.target.value.replace(/[^0-9]/g, '');
                setQuantidade(newValue);
              }}
              className="mt-1 bg-[#161616] border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 font-semibold">Observação</label>
            <Input
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="mt-1 bg-[#161616] border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 font-semibold">Prioridade</label>

            <Select
              options={prioridadeOptions}
              value={prioridadeOptions.find((opt) => opt.value === prioridade)}
              onChange={(opt) => setPrioridade(opt.value)}
              styles={selectStyle}
              placeholder="Selecione a prioridade"
              className="mt-1"
            />
          </div>
        </div>

        {apiError && (
          <div
            role="alert"
            className="flex items-center p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 mt-4"
          >
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-sm">{apiError}</span>
          </div>
        )}

        <DialogFooter className="mt-4 flex justify-between">
          <Button
            onClick={() => {
              setOpen(false);
            }}
            className="bg-transparent text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirmarPedido}
            disabled={loading}
            className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processando...</>
            ) : "Confirmar Pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
