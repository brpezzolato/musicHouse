import { useState, useEffect } from 'react';
import { Pencil, Layers, Barcode, Package, AlertTriangle, Save } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const cssInput =
  'w-full -mb-3 border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

export default function DialogEditarEstoque({ nomeProduto, categoria, idEstoque, sku, quantidadeProduto, aviso, onAtualizado }) {
  const [open, setOpen] = useState(false);
  const [quantidade, setQuantidade] = useState(10);
  const [avisoMinimo, setAvisoMinimo] = useState(aviso);

  useEffect(() => {
    setQuantidade(quantidadeProduto);
    setAvisoMinimo(aviso);
  }, [quantidadeProduto, aviso, open]);


  const handleSave = async () => {
    // Verificar se a quantidade foi alterada
    if (quantidade === quantidadeProduto) {
      alert("A quantidade não foi alterada.");
      return;
    }

    try {

      const response = await fetch(`http://localhost:8080/estoque/atualizarEstoqueMatriz/${idEstoque}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        credentials: 'include',
        body: JSON.stringify({
          novaQuantidade: quantidade,
        }),
      });

      if (response.ok) {
        setOpen(false);
        if (onAtualizado) onAtualizado();
      } else {

        const data = await response.json();
        alert(`Erro ao atualizar estoque: ${data.mensagem}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      alert('Erro ao salvar as alterações.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition">
          <Pencil className="w-4 h-4 text-zinc-200" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white text-gray-800 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black -mb-3">
            Editar Estoque
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          {/* Card de Informações do Produto */}
          <div className="rounded-xl p-4 bg-gray-100 border border-gray-300 space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Produto</p>
              <p className="text-xl font-extrabold text-black">{nomeProduto}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-gray-600" />
                <span className="text-gray-600">Categoria:</span>
                <span className="text-black font-semibold">{categoria}</span>
              </div>

              <div className="flex items-center gap-2">
                <Barcode size={16} className="text-gray-600" />
                <span className="text-gray-600">SKU:</span>
                <span className="text-black font-semibold">{sku}</span>
              </div>

              <div className="flex items-center gap-2">
                <Package size={16} className="text-gray-600" />
                <span className="text-gray-600">Estoque atual:</span>
                <span className="text-black font-semibold">{quantidadeProduto} un</span>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-gray-600">Aviso:</span>
                <span className="text-red-500 font-semibold">{aviso} un</span>
              </div>
            </div>
          </div>

          {/* Campo de Edição da Quantidade */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-black">Nova Quantidade em Estoque:</label>
            <input
              type="text"
              value={quantidade}
              onChange={(e) => {
                const newValue = e.target.value.replace(/[^0-9]/g, '');
                setQuantidade(newValue);
              }}
              className="mt-1 p-3 border rounded"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="hover:bg-[var(--azul-marinho)] hover:text-white text-gray-600 border-gray-300">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            className="bg-[#003049] hover:bg-[#00263a] transition text-white"
          >
            <Save size={16} className="mr-2" /> Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
