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
import { CirclePlus, MoveLeft } from 'lucide-react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { getCookie } from 'cookies-next';
import { Spinner } from '@/components/ui/spinner';
import Select from 'react-select';

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

export default function DialogDemo({ setRecarregar }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [materiais, setMateriais] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [nomeCor, setNomeCor] = useState('');
  const [cor, setCor] = useState('#ffffff');
  const [desconto, setDesconto] = useState(null);
  const [idCategoria, setIdCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [custoProducao, setCustoProducao] = useState('');
  
  // MUDANÇA 1: Inicializa como array vazio para múltiplas imagens
  const [imagem, setImagem] = useState([]); 
  
  const [desc, setDesc] = useState(false);
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
      // NOTE: Troquei alert() por console.error ou uma UI de feedback
      if (response.ok) {
        setCategorias(data);
      } else {
        console.error('Erro ao carregar categorias:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }

  useEffect(() => {
    pegarDados();
  }, []);

  function resetarCampos() {
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
    setImagem([]); // Resetar para array vazio
    setDesc(false);
    setPage(1);
  }

  const cssInput =
    'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

  const cssButton = 'bg-[var(--azul-marinho)] hover:bg-[var(--azul-marinho)]';

  async function criar() {
    try {
      setEnviando(true);
      setRecarregar(false);
      const precoLimpo = valor.replace(/\D/g, '');
      const precoFinal = precoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');
      const custoLimpo = custoProducao.replace(/\D/g, '');
      const custoFinal = custoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');

      const cookie = getCookie('token');

      // CORREÇÃO 2: Usar FormData para enviar arquivos e dados de formulário
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('materiais', materiais);
      formData.append('detalhes', detalhes);
      formData.append('nome_cor', nomeCor);
      formData.append('cor', cor);
      
      // Adiciona desconto se for um número válido
      if (desconto !== null && desconto !== undefined) {
        formData.append('desconto', desconto);
      }

      formData.append('id_categoria', idCategoria);
      formData.append('valor', precoFinal);
      formData.append('custo_producao', custoFinal);
      
      // MUDANÇA 4: Itera sobre o array de imagens e as anexa ao FormData
      // O backend deve usar upload.array("imagem", 4)
      if (imagem.length > 0) {
         imagem.forEach((file, index) => {
            // O nome do campo DEVE ser "imagem", conforme sua rota no backend (upload.array("imagem"))
            formData.append('imagem', file); 
         });
      }
      
      const response = await fetch('http://localhost:8080/produtos', {
        method: 'POST',
        headers: {
          // REMOVER Content-Type: application/json. O browser o define como multipart/form-data
          // boundary quando FormData é enviado.
          cookie: cookie,
        },
        cache: 'no-store',
        credentials: 'include',
        body: formData, // Envia o objeto FormData
      });

      if (response.ok) {
        // NOTE: Troquei alert() por console.log ou UI de feedback
        console.log('Criado com sucesso'); 
        resetarCampos();
        setRecarregar(true);
        setOpen(false);
      } else {
        // NOTE: Troquei alert() por console.error ou UI de feedback
        console.error('Erro ao criar produto:', await response.json());
      }
    } catch (error) {
      console.error('Erro ao exibir novo produto:', error);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setEnviando(false);
        if (!isOpen) resetarCampos();
      }}
    >
      {/* Atenção: A tag <form> aqui é apenas visual. 
        A submissão é controlada pelo JS (onClick={criar}).
        Se você usasse onSubmit={criar} no <form>, 
        você deveria usar e.preventDefault(). 
      */}
      <div>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)} className={cssButton}>
            <CirclePlus /> Criar Produtos
          </Button>
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

            <DialogTitle className="text-2xl">Criar novo produto</DialogTitle>
            <DialogDescription className="-mt-1">
              Todos os campos obrigatórios contém *
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
                  <label className="mb-1">Selecione a cor: </label>
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
            ) : (
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
                      placeholder="Selecione um"
                      options={categorias.map((cada) => ({
                        value: cada.id_categoria,
                        label: cada.nome,
                      }))}
                      value={
                        idCategoria
                          ? {
                              value: idCategoria,
                              label:
                                categorias.find(
                                  (c) => c.id_categoria === idCategoria
                                )?.nome || 'Selecione um',
                            }
                          : null
                      }
                      onChange={(opt) => setIdCategoria(opt ? opt.value : '')}
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
                    <label className="mb-1">Imagens (Mínimo 4) *:</label>
                    <input
                      type="file"
                      multiple // MUDANÇA 2: Habilita a seleção de múltiplos arquivos
                      className={cssInput}
                      // MUDANÇA 3: Captura a lista de arquivos como um array
                      onChange={(e) => setImagem(Array.from(e.target.files))}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="hover:bg-[var(--azul-marinho)] hover:text-white"
              >
                Cancelar
              </Button>
            </DialogClose>

            {page < 3 ? (
              <Button 
                onClick={() => setPage(page + 1)} 
                className={cssButton}
                disabled={page === 1 ? !nome || !descricao || !materiais || !detalhes : page === 2 ? !nomeCor || !cor : false}
              >
                Próximo
              </Button>
            ) : enviando === true ? (
              <Button
                className={`${cssButton} w-auto flex justify-between`}
                disabled
                type="button"
              >
                <Spinner className="size-4" /> Criar novo produto
              </Button>
            ) : (
              <Button
                className={`${cssButton} w-auto flex justify-center`}
                type="button"
                // MUDANÇA 5: A validação agora checa se o array de imagem tem pelo menos 4 itens
                disabled={
                  !nome ||
                  !descricao ||
                  !materiais ||
                  !detalhes ||
                  !nomeCor ||
                  !cor ||
                  !idCategoria ||
                  !valor ||
                  !custoProducao ||
                  imagem.length < 4 // NOVA CONDIÇÃO DE VALIDAÇÃO
                }
                onClick={criar}
              >
                {!nome ||
                !descricao ||
                !materiais ||
                !detalhes ||
                !nomeCor ||
                !cor ||
                !idCategoria ||
                !valor ||
                !custoProducao ||
                imagem.length < 4
                  ? 'Preencha todos os campos com *'
                  : 'Criar novo produto'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}