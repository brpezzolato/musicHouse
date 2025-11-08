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
import { toast } from 'sonner';
import {
  TruckElectric,
  TriangleAlertIcon,
  MoveLeft,
  ScanLine,
  CreditCard,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import NextStep from '@/components/ui/next-step-brpe';

export default function DialogDemo({ formaPgto, itens }) {
  const botaoCss =
    'bg-[var(--vermelho-vivo)] rounded-[15px] w-full text-white h-10 hover:bg-[#CCc1121]';
  const [page, setPage] = useState(1);
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

  if (formaPgto) {
    return (
      <>
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button className={botaoCss}>
                Finalizar Pedido <TruckElectric />
              </Button>
            </DialogTrigger>
            {page === 1 ? (
              <DialogContent
                className="sm:max-w-[40vw] h-auto flex flex-col"
                showCloseButton={false}
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader className="h-fit">
                  {page === 1 ? (
                    <DialogClose asChild>
                      <button>
                        <MoveLeft />
                      </button>
                    </DialogClose>
                  ) : (
                    <button
                      onClick={() => {
                        setPage(1);
                      }}
                    >
                      <MoveLeft />
                    </button>
                  )}
                  <DialogTitle className="text-[30px]">
                    Resumo do Pedido - {pgtoFormatado}
                  </DialogTitle>
                  <DialogDescription>
                    Verifique os itens do pedido e a forma de pagamento
                    selecionada, depois avance para a próxima etapa.
                  </DialogDescription>
                </DialogHeader>

                <div className=""></div>
                <div className="flex h-full">
                  <div className="flex flex-col gap-y-2">
                    {itens.map((produto, index) => (
                      <div key={index} className="flex flex-row">
                        <p className="">
                          {produto.qtd}x - {produto.nome} -{' '}
                          {parseInt(produto.preco * produto.qtd).toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            }
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className=""></div>
                </div>
                <div></div>
                <div></div>
                <DialogFooter className="items-end">
                  <DialogClose
                    onClick={() => {
                      setPage(1);
                    }}
                    asChild
                  >
                    <button className="px-4 py-2">Cancelar</button>
                  </DialogClose>
                  <NextStep
                    onClick={() => {
                      setPage(2);
                    }}
                  />
                </DialogFooter>
              </DialogContent>
            ) : (
              <DialogContent
                className="sm:max-w-[40vw] h-auto flex flex-col"
                showCloseButton={false}
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader className="h-fit">
                  {page === 1 ? (
                    <DialogClose asChild>
                      <button>
                        <MoveLeft />
                      </button>
                    </DialogClose>
                  ) : (
                    <button
                      onClick={() => {
                        setPage(1);
                      }}
                    >
                      <MoveLeft />
                    </button>
                  )}
                  <DialogTitle className="text-[30px]">
                    Processando Pagamento
                  </DialogTitle>
                  <DialogDescription>
                    Oriente o cliente a inserir o cartão ou escanear o QR Code
                    do Pix e verifique a confirmação antes de concluir.
                  </DialogDescription>
                </DialogHeader>
                <div className=""></div>
                <div className="flex justify-center">
                  <div className="w-120">
                    <video
                      src="/pdv/pagAnimation.mp4"
                      autoPlay
                      muted
                      loop
                    ></video>
                  </div>
                </div>
                <div></div>
                <div></div>
                <DialogFooter className="items-end">
                  <DialogClose
                    onClick={() => {
                      setPage(1);
                    }}
                    asChild
                  >
                    <button className="px-4 py-2">Cancelar</button>
                  </DialogClose>
                  <NextStep
                    onClick={() => {
                      setPage(2);
                    }}
                  />
                </DialogFooter>
              </DialogContent>
            )}
          </form>
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <Button
          className={botaoCss}
          onClick={() =>
            toast.custom(
              () => (
                <div className="bg-[#f5f5f5] rounded-2xl pt-3 ps-4 pb-3 w-[420px] shadow-[0_0_35px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center gap-2">
                    <TriangleAlertIcon className="size-7 mr-2" />
                    <div>
                      <div className="font-semibold">
                        Selecione uma forma de pagamento
                      </div>
                      <div className="text-sm opacity-90">
                        Certifique-se da forma de pagamento selecionada
                      </div>
                    </div>
                  </div>
                </div>
              ),
              { duration: 30000, position: 'top-right' }
            )
          }
        >
          Finalizar Pedido <TruckElectric />
        </Button>
      </>
    );
  }
}
