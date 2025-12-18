'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { MoveLeft, Pencil } from 'lucide-react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { getCookie } from 'cookies-next';
import { Spinner } from '@/components/ui/spinner';
import Select from 'react-select';
import ListaVariacoes from '@/components/VerProdutoDialog/ListaVariacoesEditar';

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: '15px',
    borderColor: state.isFocused ? '#d9d9db' : '#d9d9db',
    borderWidth: '2px',
    padding: '2px',
    minHeight: '40px',
    boxShadow: state.isFocused ? 'none' : 'none',
    '&:hover': { borderColor: '#d9d9db' },
    backgroundColor: '#ffff',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#4a5565',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#4a5565',
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

export default function EditarProdutoDialog({ produto, setRecarregar }) {
  const [nome, setNome] = useState(produto?.nome || '');
  const [descricao, setDescricao] = useState(produto?.descricao || '');
  const [materiais, setMateriais] = useState(produto?.materiais || '');
  const [detalhes, setDetalhes] = useState(produto?.detalhes || '');
  const [nomeCor, setNomeCor] = useState(produto?.nome_cor || '');
  const [cor, setCor] = useState(produto?.cor || '#ffffff');
  const [desconto, setDesconto] = useState(produto?.desconto || null);
  const [idCategoria, setIdCategoria] = useState(produto?.id_categoria || '');
  const [valor, setValor] = useState(produto?.valor || '');
  const [custoProducao, setCustoProducao] = useState(
    produto?.custo_producao || ''
  );
  const [imagem, setImagem] = useState(null);
  const [desc, setDesc] = useState(!!produto?.desconto);
  const [page, setPage] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [open, setOpen] = useState(false);

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

  function resetarCampos() {
    if (produto) return;

    setNome('');
    setDescricao('');
    setMateriais('');
    setDetalhes('');
    setNomeCor('');
    setCor('#ffffff');
    setDesconto(null);
    setIdCategoria('');
    setValor('');
    setCustoProducao('');
    setImagem(null);
    setDesc(false);
    setPage(1);
  }

  const cssInput =
    'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

  const cssButton = 'bg-[var(--azul-marinho)] hover:bg-[var(--azul-marinho)]';

  async function editar() {
    try {
      setEnviando(true);
      setRecarregar(false);
      const precoLimpo = valor.replace(/\D/g, '');
      const precoFinal = precoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');
      const custoLimpo = custoProducao.replace(/\D/g, '');
      const custoFinal = custoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');

    
      const formData = new FormData();


      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('materiais', materiais);
      formData.append('detalhes', detalhes);
      formData.append('nome_cor', nomeCor);
      formData.append('cor', cor);
      if (desconto !== null && desconto !== undefined) {
        formData.append('desconto', desconto);
      }
      formData.append('id_categoria', idCategoria);
      formData.append('valor', precoFinal);
      formData.append('custo_producao', custoFinal);

      if (imagem && imagem.length > 0) {
        for (let i = 0; i < imagem.length; i++) {
          formData.append('imagem', imagem[i]);
        }
      } else if (!imagem && produto.imagem) {

      }

      const response = await fetch(
        `http://localhost:8080/produtos/${produto.id_produto}`,
        {
          method: 'PUT',
          cache: 'no-store',
          credentials: 'include',
          body: formData, 
        }
      );

      if (response.ok) {
        setRecarregar(true);
        setOpen(false);
      } else {
        alert('Erro');
      }
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    } finally {
      setEnviando(false);
    }
  }

  const categoriaOptions = categorias.map((c) => ({
    value: c.id_categoria,
    label: c.nome,
  }));

  const categoriaSelecionada =
    categoriaOptions.find((c) => c.value === idCategoria) || null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setPage(1);
        setEnviando(false);
        if (!isOpen) resetarCampos();
      }}
    >
      <form>
        <DialogTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition"
          >
            <Pencil className="w-4 h-4 text-zinc-200" />
          </button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-[425px]"
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

            <DialogTitle className="text-2xl flex items-center gap-1">
              <Pencil /> Editar {page > 3 ? 'Variação' : 'Produto'}
            </DialogTitle>
            <DialogDescription className="-mt-2">
              Edite os campos que gostaria de editar e não envie nenhum vazio
            </DialogDescription>
          </DialogHeader>

          <div className="gap-4">
            {page === 1 ? (
              <>
                <div className="flex gap-3 flex-col w-full mb-3">
                  <div className="flex flex-col">
                    <label className="mb-1">Nome *: </label>
                    <input
                      type="text"
                      className={cssInput}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1">Descrição *: </label>
                    <textarea
                      className={`${cssInput} pt-2 min-h-[100px]`}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1">Materiais *: </label>
                    <input
                      type="text"
                      className={cssInput}
                      value={materiais}
                      onChange={(e) => setMateriais(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1">Detalhes *: </label>
                    <textarea
                      type="text"
                      className={cssInput}
                      value={detalhes}
                      onChange={(e) => setDetalhes(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : page === 2 ? (
              <>
                <div className="flex gap-3 flex-col w-full">
                  <label className="mb-1">Selecione a cor *: </label>

                  <div className="flex flex-col items-center mb-3">
                    <HexColorPicker color={cor} onChange={setCor} />
                  </div>

                  <div className="flex gap-3 w-full">
                    <div className="flex flex-col w-1/2">
                      <label>Escreva o Hex *:</label>
                      <HexColorInput
                        color={cor}
                        onChange={setCor}
                        className={`${cssInput} w-full`}
                      />
                    </div>

                    <div className="flex flex-col w-1/2">
                      <label>Nome da cor *:</label>
                      <input
                        type="text"
                        className={`${cssInput} w-full`}
                        value={nomeCor}
                        onChange={(e) => setNomeCor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : page === 3 ? (
              <>
                <div className="flex gap-3 flex-col w-full mb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="subscribe"
                      className="border-2 border-gray shadow data-[state=checked]:bg-[var(--azul-marinho)] data-[state=checked]:text-white data-[state=checked]:border-[var(--azul-marinho)]"
                      checked={desc}
                      onCheckedChange={setDesc}
                      onClick={() => setDesconto(null)}
                    />
                    <span>Desconto{desc === false ? ' ?' : ':'}</span>

                    {desc && (
                      <div className="flex flex-col mt-3">
                        <input
                          type="number"
                          className={cssInput}
                          value={desconto || ''}
                          onChange={(e) => setDesconto(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1">Selecione a categoria *: </label>

                    <Select
                      styles={selectStyle}
                      value={categoriaSelecionada}
                      onChange={(op) => setIdCategoria(op.value)}
                      options={categoriaOptions}
                      placeholder="Selecione um"
                    />
                  </div>

                  <div className="flex w-full gap-3">
                    <div className="flex flex-col w-1/2">
                      <label className="mb-1">Preço *:</label>
                      <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                          R$
                        </span>
                        <input
                          type="text"
                          className={`${cssInput} w-full pl-10`}
                          value={formatarMoedaBR(valor)}
                          onChange={(e) => setValor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col w-1/2">
                      <label className="mb-1">Custo de Produção *:</label>
                      <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                          R$
                        </span>
                        <input
                          type="text"
                          className={`${cssInput} w-full pl-10`}
                          value={formatarMoedaBR(custoProducao)}
                          onChange={(e) => setCustoProducao(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1">Imagens:</label>
                    <input
                      type="file"
                      multiple
                      className={cssInput}
                      onChange={(e) => setImagem(e.target.files)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <ListaVariacoes
                produtoId={produto.id_produto}
                page={page}
                setPage={setPage}
              />
            )}
          </div>

          {page != 5 ? (
            <DialogFooter>
              {page >= 4 ? (
                <Button className={cssButton} onClick={() => setPage(page - 1)}>
                  Voltar
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="hover:bg-[var(--azul-marinho)] hover:text-white"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
              )}

              {page < 3 ? (
                <Button onClick={() => setPage(page + 1)} className={cssButton}>
                  Próximo
                </Button>
              ) : enviando === true ? (
                <Button
                  className={`${cssButton} w-auto flex justify-between`}
                  disabled
                  type="button"
                >
                  <Spinner className="size-4" />
                  Salvando...
                </Button>
              ) : page === 3 ? (
                <>
                  <Button
                    className={`${cssButton} w-auto flex justify-center`}
                    type="button"
                    onClick={() => setPage(page + 1)}
                    disabled={
                      !nome ||
                      !descricao ||
                      !materiais ||
                      !detalhes ||
                      !nomeCor ||
                      !cor ||
                      !idCategoria ||
                      !valor ||
                      !custoProducao
                    }
                  >
                    Editar Variações
                  </Button>

                  <Button
                    className={`${cssButton} w-auto flex justify-center`}
                    type="button"
                    onClick={editar}
                    disabled={
                      !nome ||
                      !descricao ||
                      !materiais ||
                      !detalhes ||
                      !nomeCor ||
                      !cor ||
                      !idCategoria ||
                      !valor ||
                      !custoProducao
                    }
                  >
                    {!nome ||
                      !descricao ||
                      !materiais ||
                      !detalhes ||
                      !nomeCor ||
                      !cor ||
                      !idCategoria ||
                      !valor ||
                      !custoProducao
                      ? 'Preencha os campos obrigatorios *'
                      : 'Salvar'}
                  </Button>
                </>
              ) : (
                <></>
              )}
            </DialogFooter>
          ) : (
            <></>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}
