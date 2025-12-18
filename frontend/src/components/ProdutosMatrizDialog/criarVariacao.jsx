'use client';

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
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { CirclePlus, MoveLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { getCookie } from 'cookies-next';
import { Spinner } from '@/components/ui/spinner';

function formatarMoedaBR(valor) {
  if (!valor) return '';
  valor = valor.replace(/\D/g, '');
  let numero = (parseInt(valor, 10) / 100).toFixed(2);
  numero = numero.replace('.', ',');
  numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return numero;
}

const cssButton = 'bg-[var(--azul-marinho)] hover:bg-[var(--azul-marinho)]';
const cssInput =
  'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

export default function DialogCriarVaria({ produto }) {
  const [page, setPage] = useState(1);
  const [nomeCor, setNomeCor] = useState('');
  const [cor, setCor] = useState('#ffffff');
  const [valor, setValor] = useState('');
  const [custoProducao, setCustoProducao] = useState('');
  

  const [imagem, setImagem] = useState([]); 
  
  const [desc, setDesc] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [desconto, setDesconto] = useState(null);
  const [open, setOpen] = useState(false);

  function resetarCampos() {
    setNomeCor('');
    setCor('#ffffff');
    setDesconto(null);
    setValor('');
    setCustoProducao('');
    setImagem([]); 
    setDesc(false);
    setPage(1);
  }

  useEffect(() => {

  }, []);

  async function criarVariacao() {
    try {
      setEnviando(true);
      const precoLimpo = valor.replace(/\D/g, '');
      const precoFinal = precoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');
      const custoLimpo = custoProducao.replace(/\D/g, '');
      const custoFinal = custoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');

      const cookie = getCookie('token');

     
      const formData = new FormData();
      formData.append('id_produto', produto.id_produto);
      formData.append('nome_cor', nomeCor);
      formData.append('cor', cor);
      formData.append('valor', precoFinal);
      formData.append('custo_producao', custoFinal);
      
      if (desconto !== null && desconto !== undefined) {
        formData.append('desconto', desconto);
      }
      
      if (imagem.length > 0) {
        imagem.forEach((file) => {
       
          formData.append('imagem', file);
        });
      }

      const response = await fetch('http://localhost:8080/produtos/variacao', {
        method: 'POST',
        headers: {
        
          cookie: cookie,
        },
        cache: 'no-store',
        credentials: 'include',
        body: formData, 
      });

      if (response.ok) {
      
        console.log('Variação criada com sucesso');
        resetarCampos();
        setOpen(false);
      } else {
      
        console.error('Erro ao criar variação:', await response.json());
      }
    } catch (error) {
      console.error('Erro ao criar nova variação:', error);
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
      <form>
        <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-[#00263a] hover:bg-[#063147] border border-zinc-700 transition">
          <CirclePlus className="w-4 h-4 text-zinc-200" />
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
            <DialogTitle className="max-w-78 text-[23px] -mt-2">
              Criar Variação para
              <span className="!text-[#00263A] font-bold">
                {' '}
                '{produto.nome}'
              </span>
            </DialogTitle>

            <DialogDescription className="-mt-1">
              Todos os campos obrigatórios contém *
            </DialogDescription>
          </DialogHeader>
          <div>
            {page === 1 ? (
              <>
                <div className="flex gap-3 flex-col w-full mb-3">
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
                      multiple // Permite múltiplos arquivos
                      className={cssInput}
                      // MUDANÇA 4: Captura a lista de arquivos como um array
                      onChange={(e) => setImagem(Array.from(e.target.files))}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full mt-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="subscribe"
                      className="border-2 border-gray shadow data-[state=checked]:bg-[var(--azul-marinho)] data-[state=checked]:text-white data-[state=checked]:border-[var(--azul-marinho)]"
                      checked={desc}
                      onCheckedChange={setDesc}
                      onClick={() => setDesconto(null)}
                    />
                    <span>Desconto{desc === false ? ' ?' : ':'}</span>
                  </div>

                  {desc && (
                    <div className="flex flex-col mt-3">
                      <input
                        type="number"
                        className={`${cssInput} w-full`}
                        value={desconto || ''}
                        onChange={(e) => setDesconto(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3 flex-col w-full">
                  <label className="mb-1">Selecione a cor: </label>
                  <div className="flex flex-col items-center mb-3 mt-3">
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
            )}
          </div>
          <DialogFooter className="items-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="hover:bg-[var(--azul-marinho)] hover:text-white"
              >
                Cancelar
              </Button>
            </DialogClose>
            {page === 1 ? (
              <Button
                className={cssButton}
                onClick={() => {
                
                   if (valor && custoProducao && imagem.length >= 4) {
                      setPage(2);
                   } else {
                 
                      console.error("Erro: Preencha Preço, Custo e selecione no mínimo 4 imagens.");
                   }
                }}
                disabled={!valor || !custoProducao || imagem.length < 4}
              >
                Próxima
              </Button>
            ) : enviando === true ? (
              <Button
                className={`${cssButton} w-auto flex justify-between`}
                disabled
                type="button"
              >
                <Spinner className="size-4" /> Criar nova variação
              </Button>
            ) : (
              <Button
                className={`${cssButton} w-auto flex justify-center`}
                type="button"
                onClick={criarVariacao}
                disabled={
                  !nomeCor ||
                  !cor 
                
                }
              >
                {!nomeCor || !cor 
                  ? 'Preencha todos os campos com *'
                  : 'Criar nova variação'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}