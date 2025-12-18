'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MoveLeft, Eye } from 'lucide-react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import ListaVariacoes from '@/components/VerProdutoDialog/ListaVariacoes';

export default function EditarProdutoDialog({ produto }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [materiais, setMateriais] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [nomeCor, setNomeCor] = useState('');
  const [cor, setCor] = useState('');
  const [desconto, setDesconto] = useState(null);
  const [idCategoria, setIdCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [custoProducao, setCustoProducao] = useState('');
  const [desc, setDesc] = useState(!!produto?.desconto);
  const [page, setPage] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [nomeCorVariacao, setNomeCorVariacao] = useState('');

  function formatarMoedaBR(valor) {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    let numero = (parseInt(valor, 10) / 100).toFixed(2);
    numero = numero.replace('.', ',');
    numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return numero;
  }

  async function pegarDados() {
    try {
      const response = await fetch('http://localhost:8080/categorias');
      const data = await response.json();
      if (response.ok) {
        setCategorias(data);
      } else {
        alert('Erro');
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }

  useEffect(() => {
    if (produto) {
      setNome(produto.nome || '');
      setDescricao(produto.descricao || '');
      setMateriais(produto.materiais || '');
      setDetalhes(produto.detalhes || '');
      setNomeCor(produto.nome_cor || '');
      setCor(produto.cor || '#ffffff');
      setDesconto(produto.desconto || null);
      setIdCategoria(produto.id_categoria || '');
      setValor(produto.valor || '');
      setCustoProducao(produto.custo_producao || '');
      setDesc(!!produto.desconto);
    }
  }, [produto]);

  useEffect(() => {
    pegarDados();
  }, []);

  const cssInput =
    'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

  const cssButton = 'bg-[var(--azul-marinho)] hover:bg-[var(--azul-marinho)]';

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setPage(1);
      }}
    >
      <form>
        <DialogTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition"
          >
            <Eye className="w-4 h-4 text-zinc-200" />
          </button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-[425px] min-h-[400px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            {page > 1 ? (
              <button
                className="cursor-pointer"
                onClick={() => setPage(page - 1)}
              >
                <MoveLeft />
              </button>
            ) : null}

            <DialogTitle className="text-2xl">
              {page <= 3 ? 'Detalhes de ' : 'Variações de '}
              <span className="text-[var(--azul-marinho)] font-bold">
                '{produto.nome}'
              </span>
            </DialogTitle>
            {page <= 4 ? (
              ''
            ) : (
              <DialogDescription className="text-md mt-1">
                <span className="font-semibold">{nomeCorVariacao}</span>
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="gap-4">
            {page === 1 ? (
              <>
                <div className="flex gap-3 flex-col w-full mb-3">
                  <div className="flex flex-col">
                    <label className="mb-1">Nome: </label>
                    <input
                      type="text"
                      className={cssInput}
                      value={nome}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1">Descrição: </label>
                    <textarea
                      className={`${cssInput} pt-2 min-h-[100px]`}
                      value={descricao}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1">Materiais: </label>
                    <input
                      type="text"
                      className={cssInput}
                      value={materiais}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1">Detalhes: </label>
                    <textarea
                      type="text"
                      className={cssInput}
                      value={detalhes}
                      disabled
                    />
                  </div>
                </div>
              </>
            ) : page === 2 ? (
              <>
                <div className="flex gap-3 flex-col w-full">
                  <label className="mb-1">Cor do material: </label>

                  <div className="flex flex-col items-center mb-3">
                    <div className="pointer-events-none opacity-60">
                      <HexColorPicker color={cor} onChange={() => {}} />
                    </div>
                  </div>

                  <div className="flex gap-3 w-full">
                    <div className="flex flex-col w-1/2">
                      <label>Cor em HEX:</label>
                      <HexColorInput
                        color={cor}
                        className={`${cssInput} w-full`}
                        onChange={() => {}}
                        disabled
                      />
                    </div>

                    <div className="flex flex-col w-1/2">
                      <label>Nome da cor:</label>
                      <input
                        type="text"
                        className={`${cssInput} w-full`}
                        value={nomeCor}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : page === 3 ? (
              <>
                <div className="flex gap-3 flex-col w-full mb-3">
                  <div className="opacity-60 pointer-events-none">
                    <div className="flex items-center gap-2 ">
                      <Checkbox
                        id="subscribe"
                        className="border-2 border-gray shadow data-[state=checked]:bg-[var(--azul-marinho)] data-[state=checked]:text-white data-[state=checked]:border-[var(--azul-marinho)]"
                        checked={desc}
                        disabled
                      />
                      <span>Desconto{desc === false ? ' ?' : ':'}</span>
                    </div>

                    {desc && (
                      <div className="flex flex-col mt-3">
                        <input
                          type="text"
                          className={cssInput}
                          value={desconto ? `${desconto}% OFF` : ''}
                          disabled
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col w-1/2">
                      <label className="mb-1">Categoria: </label>
                      <select className={cssInput} value={idCategoria} disabled>
                        <option value={null}>Selecione um</option>
                        {categorias.map((cada) => (
                          <option
                            key={cada.id_categoria}
                            value={cada.id_categoria}
                          >
                            {cada.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label className="mb-1">Sku: </label>
                      <input
                        type="text"
                        value={`# ${produto.sku}`}
                        className={cssInput}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-3">
                    <div className="flex flex-col w-1/2">
                      <label className="mb-1">Preço:</label>
                      <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                          R$
                        </span>
                        <input
                          type="text"
                          className={`${cssInput} w-full pl-10`}
                          value={formatarMoedaBR(valor)}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex flex-col w-1/2">
                      <label className="mb-1">Custo de Produção:</label>
                      <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                          R$
                        </span>
                        <input
                          type="text"
                          className={`${cssInput} w-full pl-10`}
                          value={formatarMoedaBR(custoProducao)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <ListaVariacoes
                produtoId={produto.id_produto}
                page={page}
                setPage={setPage}
                setNomeCorVariacao={setNomeCorVariacao}
              />
            )}
          </div>

          <DialogFooter className="flex items-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="hover:bg-[var(--azul-marinho)] hover:text-white"
              >
                Sair
              </Button>
            </DialogClose>

            {page < 5 && page != 4 ? (
              <Button onClick={() => setPage(page + 1)} className={cssButton}>
                {page === 3 ? 'Ver Variações' : 'Próximo'}
              </Button>
            ) : page === 5 ? (
              <Button onClick={() => setPage(page - 1)} className={cssButton}>
                Voltar
              </Button>
            ) : (
              <DialogClose asChild>
                <Button className="bg-[var(--azul-marinho)] hover:bg-[var(--azul-marinho)] hover:text-white">
                  Fechar
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
