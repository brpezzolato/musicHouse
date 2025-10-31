'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
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

export default function PdvHome() {
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: 'Guitarra',
      preco: 900,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Guitarra',
      desc: 'Guitarra Fender 62, corpo Maple Wood',
    },
    {
      id: 2,
      nome: 'Microfone',
      preco: 100,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Microfone',
      desc: 'Microfone de qualidade para voz e instrumentos',
    },
    {
      id: 3,
      nome: 'Bateria',
      preco: 900,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Bateria',
      desc: 'Bateria Pearl 26, corpo Maple Wood',
    },
    {
      id: 4,
      nome: 'Baixo',
      preco: 1200,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Baixo',
      desc: 'Baixo Fender Jazz Bass 70s',
    },
    {
      id: 5,
      nome: 'Teclado',
      preco: 1500,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Teclado',
      desc: 'Teclado Yamaha PSR-E373 com 61 teclas sensíveis ao toque',
    },
    {
      id: 6,
      nome: 'Violão',
      preco: 800,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Violão',
      desc: 'Violão Giannini Nylon Clássico',
    },
    {
      id: 7,
      nome: 'Saxofone',
      preco: 2500,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Saxofone',
      desc: 'Saxofone Alto Yamaha YAS-280, acabamento dourado',
    },
    {
      id: 8,
      nome: 'Violino',
      preco: 1100,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Violino',
      desc: 'Violino acústico Stradivarius Student 4/4',
    },
    {
      id: 9,
      nome: 'Amplificador',
      preco: 700,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Amplificador',
      desc: 'Amplificador Fender Frontman 25R 25W',
    },
    {
      id: 10,
      nome: 'Piano Digital',
      preco: 3200,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Piano',
      desc: 'Piano digital Casio CDP-S360 com 88 teclas',
    },
    {
      id: 11,
      nome: 'Fone de Ouvido',
      preco: 300,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Fone',
      desc: 'Fone de ouvido AKG K240 Studio profissional',
    },
    {
      id: 12,
      nome: 'Pedal de Efeito',
      preco: 450,
      qtd: 1,
      img: 'https://placehold.co/40x40?text=Pedal',
      desc: 'Pedal Boss DS-1 Distortion clássico para guitarra',
    },
  ]);

  const total = produtos.reduce((acc, p) => acc + p.preco * p.qtd, 0);
  const tax = total * 0.05;
  const totalFinal = total + tax;

  const removerProduto = (id) =>
    setProdutos(produtos.filter((p) => p.id !== id));

  return (
    <>
      <style>{`
        body {
         background-image: url('./pdv/fundo.png'); 
         background-size: cover;
         background-repeat: no-repeat;
         background-position: center;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">
        {/* TOPO */}
        <div className="flex flex-wrap justify-between items-center px-6 md:px-10 pt-6 gap-4">
          <Input
            placeholder="N° OPERADOR: ***000"
            className="bg-[#f5f5f5]/70 w-full sm:w-64 border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-500"
            disabled
          />
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex flex-col lg:flex-row flex-1 px-4 md:px-10 py-6 gap-6 md:gap-8">
          {/* COLUNA ESQUERDA */}
          <div className="flex-1 bg-white/95 rounded-md shadow-sm border border-gray-100 p-4 md:p-6 backdrop-blur-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-3 text-center font-semibold border-b pb-3 text-gray-800">
              <span>Nome</span>
              <span>Preço</span>
              <span>Qtd</span>
            </div>

            <div className="mt-3 flex flex-col gap-3 h-[300px] sm:h-[400px] md:h-[400px] overflow-y-auto">
              {produtos.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-md px-4 py-3 shadow-sm hover:bg-gray-100 transition"
                >
                  {/* Nome + imagem */}
                  <div className="flex items-center gap-3 sm:w-1/3 mb-2 sm:mb-0">
                    <img src={p.img} className="w-10 h-10 object-contain" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">
                        {p.nome}
                      </p>
                      <p className="text-xs text-gray-500">{p.desc}</p>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="sm:w-1/3 text-left sm:text-center font-medium text-gray-800 text-sm">
                    R${' '}
                    {p.preco.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>

                  {/* Quantidade + botão */}
                  <div className="flex justify-end sm:justify-center items-center gap-3 sm:w-1/3 mt-1 sm:mt-0">
                    <span className="text-gray-700 text-sm">{p.qtd}</span>
                    <Trash2
                      className="text-red-500 cursor-pointer hover:scale-110 transition"
                      onClick={() => removerProduto(p.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="w-full lg:w-[320px] flex flex-col gap-4">
            <Input
              placeholder="Insira o produto"
              className="bg-[#f5f5f5]/80 border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button className="bg-black text-white rounded-none hover:bg-neutral-800 hover:opacity-[0.9] cursor-pointer py-5 text-sm sm:text-base">
              Adicionar Produto
            </Button>

            <img
              src="/logos/logoEscritaVermelha.png"
              alt="Logo Music House"
              className="w-36 sm:w-48 mx-auto mt-3"
            />

            {/* PRODUTO EM DESTAQUE */}
            <div className="flex flex-col sm:flex-row items-center gap-3 border border-gray-200 p-3 rounded-md bg-white/90 text-center sm:text-left">
              <img
                src="https://placehold.co/40x40?text=Guitarra"
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="font-semibold text-sm text-gray-800">Guitarra</p>
                <p className="text-xs text-gray-500">
                  Guitarra Fender 62, corpo Maple Wood
                </p>
              </div>
            </div>

            {/* RESUMO DO CAIXA */}
            <div className="bg-gray-50/90 p-4 rounded-md shadow-sm text-sm">
              <div className="flex justify-between mb-1 text-gray-700 text-sm sm:text-base">
                <span>Sub Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-700 text-sm sm:text-base">
                <span>Tax 5%</span>
                <span>R$ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 text-gray-800 text-sm sm:text-base">
                <span>Total Amount</span>
                <span className="text-[var(--vermelho-vivo)]">
                  R$ {totalFinal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* MÉTODOS DE PAGAMENTO */}
            <div className="flex justify-around mt-2 text-xs sm:text-sm text-gray-600">
              <div className="flex flex-col items-center cursor-pointer hover:text-[var(--vermelho-vivo)] transition">
                💵
                <span>Cash</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:text-[var(--vermelho-vivo)] transition">
                💳
                <span>Card</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:text-[var(--vermelho-vivo)] transition">
                📱
                <span>QR Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="w-full bg-[var(--vermelho-vivo)] text-center py-3 sm:py-4">
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button className="bg-[var(--vermelho-vivo)] hover:bg-[var(--vermelho-vivo)] hover:opacity-[0.9] cursor-pointer text-white text-base sm:text-lg font-semibold rounded-none w-full py-5 sm:py-6 transition-all">
                  FECHAR CAIXA
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fechar o caixa</DialogTitle>
                  <DialogDescription>
                    Digite suas informações para fechar o caixa
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <label>Name</label>
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue="Pedro Duarte"
                    />
                  </div>
                  <div className="grid gap-3">
                    <label>Username</label>
                    <Input
                      id="username-1"
                      name="username"
                      defaultValue="@peduarte"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>
    </>
  );
}
