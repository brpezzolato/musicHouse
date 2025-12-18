import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { button } from '@material-tailwind/react';
import { Trash2, MoveLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DialogDemo({ prod, setRecarregar }) {
  const [variacoes, setVariacoes] = useState([]);
  const [page, setPage] = useState(1);
  const [excluir, setExcluir] = useState(null);
  const [variacao, setVariacao] = useState(false);
  const [open, setOpen] = useState(false);
  const [recarregarDd, setRecarregarDd] = useState(false);

  async function pegarVariacoes() {
    try {
      const response = await fetch(
        `http://localhost:8080/produtos/variacao/${prod.id_produto}`
      );
      const data = await response.json();
      if (response.ok) {
        setVariacoes(data);
      } else {
        alert('Erro');
      }
    } catch (error) {
      console.error('Erro ao buscar variacoes por id produto:', error);
    }
  }

  useEffect(() => {
    pegarVariacoes();
  }, [prod, recarregarDd]);

  async function excluirItem() {
    if (!excluir) return;
    setRecarregar(false);

    if (variacao === true) {
      try {
        const response = await fetch(
          `http://localhost:8080/produtos/variacao/${excluir.id_variacao}`,
          { method: 'DELETE' }
        );

        if (!response.ok) {
          alert('Erro ao excluir variação');
          return;
        }

        setPage(1);
        setRecarregarDd((prev) => !prev);
      } catch (error) {
        console.error('Erro ao excluir variação:', error);
        alert('Erro ao excluir variação.');
      }
    }

    if (variacao === false) {
      try {
        const response = await fetch(
          `http://localhost:8080/produtos/${excluir.id_produto}`,
          { method: 'DELETE' }
        );

        if (!response.ok) {
          alert('Erro ao excluir produto');
          return;
        }

        setRecarregar(true);
        setOpen(false);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto.');
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full bg-red-900/50 hover:bg-red-800/60 border border-red-700 transition"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            {page === 2 ? (
              <button
                className="cursor-pointer"
                onClick={() => setPage(page - 1)}
              >
                <MoveLeft />
              </button>
            ) : (
              ''
            )}
            <DialogTitle className="text-2xl">
              Excluir Produto ou Variação
            </DialogTitle>
            <DialogDescription>
              Clique no item que deseja excluir.
            </DialogDescription>
          </DialogHeader>
          {page === 1 ? (
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-semibold">Produto:</p>
                <p
                  onClick={() => {
                    setPage(page + 1);
                    setExcluir(prod);
                    setVariacao(false);
                  }}
                  className="cursor-pointer underline"
                >
                  - {prod.nome}
                </p>
              </div>

              {variacoes.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">Variações:</p>
                  {variacoes.map((cada, index) => (
                    <p
                      key={index}
                      className="cursor-pointer underline"
                      onClick={() => {
                        setPage(page + 1);
                        setExcluir(cada);
                        setVariacao(true);
                      }}
                    >
                      - {prod.nome} - {cada.nome_cor}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col mt-4 mb-8">
                <p className="mb-2">
                  {variacao === true
                    ? 'Tem certeza que deseja excluir a variação:'
                    : 'Tem certeza que deseja excluir o produto:'}
                </p>
                <span className="font-semibold">
                  {prod.nome}
                  {variacao && ` (${excluir.nome_cor})`} ?
                </span>
              </div>
            </>
          )}

          <DialogFooter>
            {page === 1 ? (
              <>
                <DialogClose asChild>
                  <Button
                    type="submit"
                    className="bg-[var(--azul-marinho)] hover:bg-[#00263a] w-20"
                  >
                    Sair
                  </Button>
                </DialogClose>
              </>
            ) : (
              <>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="hover:bg-[var(--azul-marinho)] hover:text-white"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={() => {
                    excluirItem();
                  }}
                  className="bg-[var(--azul-marinho)] hover:bg-[#00263a]"
                >
                  Confirmar exclusão
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
