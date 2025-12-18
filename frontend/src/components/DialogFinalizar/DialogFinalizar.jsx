'use client';

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
import { TruckElectric, MoveLeft, ScanLine, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import NextStep from '@/components/ui/next-step-brpe';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import SelectParcelameto from './SelectParcelameto';
import NotaFiscal from './NotaFiscal';
import { getCookie } from 'cookies-next/client';

import { gerarNotaFiscalPDF } from './NotaFiscalPDF';

let fakeCountDaVenda;

export default function DialogDemo({ formaPgto, itens, total, desconto }) {
  const botaoCss =
    'bg-[var(--vermelho-vivo)] rounded-[15px] w-full text-white h-10 hover:bg-[#CCc1121] cursor-pointer';

  const [page, setPage] = useState(1);
  const [processandoPgto, setProcessandoPgto] = useState(true);
  const [sucessoPgto, setSucessoPgto] = useState(null);
  const [parcela, setParcela] = useState(null);
  const [dadosVenda, setDadosVenda] = useState(null);
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const [dadosFranquia, setDadosFranquia] = useState(null);
  const [dadosFuncionario, setDadosFuncionario] = useState(null);

  const pgtoFormatado =
    formaPgto === 1 ? (
      <span className="text-[var(--vermelho-vivo)]">
        Débito <CreditCard className="inline size-7" />
      </span>
    ) : formaPgto === 2 ? (
      <span className="text-[var(--vermelho-vivo)]">
        Crédito <CreditCard className="inline size-7" />
      </span>
    ) : (
      <span className="text-[var(--vermelho-vivo)]">
        Pix <ScanLine className="inline size-7" />
      </span>
    );

  useEffect(() => {
    if (page === 2) {
      fakeCountDaVenda = setTimeout(async () => {
        await fechamentoDePedido();
        setProcessandoPgto(false);
      }, 5000);
    } else {
      clearTimeout(fakeCountDaVenda);
      setProcessandoPgto(true);
    }
  }, [page]);

  async function fechamentoDePedido() {
    const cookie = getCookie('token');

    try {
      const data = {
        id_pagamento: formaPgto,
        valor_total: total,
        desconto: desconto || 0,
        itensVenda: itens,
        parcelas: parcela,
      };

      const response = await fetch('http://localhost:8080/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: cookie,
        },
        cache: 'no-store',
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const resposta = await response.json();

        setSucessoPgto(true);
        setDadosVenda({
          idVenda: resposta.venda.id,
          total,
          desconto,
          formaPgto,
          parcela,
          itens,
        });

        fetch(`http://localhost:8080/franquias/${resposta.venda.id_franquia}`, {
          headers: { cookie },
          credentials: 'include',
        })
          .then((r) => r.json())
          .then(setDadosFranquia);

        fetch(
          `http://localhost:8080/funcionarios/${resposta.venda.id_funcionario}`,
          {
            headers: { cookie },
            credentials: 'include',
          }
        )
          .then((r) => r.json())
          .then(setDadosFuncionario);
      } else {
        setSucessoPgto(false);
      }
    } catch (error) {
      console.log('Erro ao tentar criar venda:', error);
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={botaoCss}
            disabled={formaPgto === null || itens.length === 0}
          >
            Finalizar Pedido <TruckElectric />
          </Button>
        </DialogTrigger>

        {page === 3 && dadosVenda && (
          <DialogContent
            className="sm:max-w-[40vw] h-auto flex flex-col bg-white"
            showCloseButton={false}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader className="h-fit flex flex-row justify-between">
              <img
                src="/logos/CasaVermelha.png"
                alt="Music House"
                className="w-28 mt-auto"
              />
              <DialogTitle className="sr-only">Nota Fiscal</DialogTitle>

              <p>
                <b>Data: </b> {dataAtual}
              </p>
            </DialogHeader>

            <NotaFiscal
              dados={dadosVenda}
              dadosFranquia={dadosFranquia}
              dadosFuncionario={dadosFuncionario}
              parcela={parcela}
            />

            <DialogFooter className="items-end mt-6">
              <DialogClose asChild>
                <Button
                  className={botaoCss}
                  onClick={() => {
                    window.location.reload();
                    localStorage.clear();
                  }}
                >
                  Fechar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}

        {page === 1 && (
          <DialogContent
            className="sm:max-w-[40vw] h-auto flex flex-col"
            showCloseButton={false}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader className="h-fit">
              <DialogClose asChild>
                <button className="w-fit" onClick={() => setParcela(null)}>
                  <MoveLeft />
                </button>
              </DialogClose>

              <DialogTitle className="text-[30px]">
                Resumo do Pedido - {pgtoFormatado}
              </DialogTitle>

              <DialogDescription>
                Verifique os itens do pedido e a forma de pagamento selecionada.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-y-2 max-h-[220px] overflow-y-auto">
              {itens.map((produto, index) => (
                <div key={index} className="flex flex-row">
                  <p>
                    {produto.qtd}x - {produto.nome} -{' '}
                    {parseInt(produto.preco * produto.qtd).toLocaleString(
                      'pt-BR',
                      { style: 'currency', currency: 'BRL' }
                    )}
                  </p>
                </div>
              ))}
            </div>

            {formaPgto === 2 && (
              <SelectParcelameto total={total} onChangePdv={setParcela} />
            )}

            <DialogFooter className="items-end">
              <DialogClose
                onClick={() => {
                  setPage(1);
                  setParcela(null);
                }}
                asChild
              >
                <button className="px-4 py-2">Cancelar</button>
              </DialogClose>

              <NextStep onClick={() => setPage(2)} />
            </DialogFooter>
          </DialogContent>
        )}

        {page === 2 && (
          <DialogContent
            className="sm:max-w-[40vw] h-auto flex flex-col bg-[#fbfbfb]"
            showCloseButton={false}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            {processandoPgto ? (
              <>
                <DialogHeader className="h-fit">
                  <button onClick={() => setPage(1)}>
                    <MoveLeft />
                  </button>

                  <DialogTitle className="text-[30px]">
                    Processando Pagamento
                  </DialogTitle>

                  <DialogDescription>
                    Aguarde enquanto confirmamos a transação.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center">
                  <div className="w-58">
                    <video src="/pdv/pagAnimation.mp4" autoPlay muted loop />
                  </div>
                </div>
              </>
            ) : (
              <>
                <DialogHeader className="h-fit">
                  <DialogTitle className="text-[30px]">
                    {sucessoPgto ? 'Pagamento Aprovado' : 'Pagamento Recusado'}
                  </DialogTitle>

                  <DialogDescription>
                    {sucessoPgto
                      ? 'Clique no botão de emitir nota fiscal.'
                      : 'Tente novamente com outra forma de pagamento.'}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center">
                  <video
                    src={sucessoPgto ? '/pdv/sucesso.mp4' : '/pdv/error.mp4'}
                    autoPlay
                    muted
                    loop
                    className="w-67"
                  />
                </div>
              </>
            )}

            <DialogFooter className="items-end">
              {processandoPgto ? (
                <Button
                  size="lg"
                  disabled
                  className="border-2 border-[var(--vermelho-vivo)] bg-[var(--vermelho-vivo)] text-white w-full rounded-[15px] pt-3 pb-3"
                >
                  <Spinner />
                  Aguarde Processando pagamento
                </Button>
              ) : (
                <>
                  {sucessoPgto === true && dadosFranquia && dadosFuncionario ? (
                    <Button
                      size="lg"
                      className={botaoCss}
                      onClick={async () => {
                        await gerarNotaFiscalPDF(
                          dadosVenda,
                          dadosFranquia,
                          dadosFuncionario,
                          itens,
                          parcela
                        );
                        setPage(3);
                      }}
                    >
                      Emitir nota fiscal
                    </Button>
                  ) : (
                    <Button
                      disabled
                      size="lg"
                      className="bg-gray-400 text-white w-full rounded-[15px]"
                    >
                      Carregando dados...
                    </Button>
                  )}
                </>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
