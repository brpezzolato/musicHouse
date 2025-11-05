'use client';

import { useEffect, useState } from 'react';
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
import { ScanLine, CreditCard, Barcode } from 'lucide-react';
import Select from 'react-select';

export default function PdvHome() {
  const [formaPgto, setFormaPgto] = useState(null);
  const [produtosBanco, setProdutosBanco] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
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

  async function carregarProdutos() {
    try {
      const response = await fetch(
        `http://localhost:8080/produtos/productVariation`
      );
      if (response.ok) {
        const data = await response.json();
        setProdutosBanco(data);
      } else {
        console.log('Erro ao carregar produtos:', response.statusText);
      }
    } catch (error) {
      console.log('Erro ao carregar produtos:', error);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  const opcoesProdutos = produtosBanco.map((produto) => ({
    value: produto.sku,
    label: `${produto.id_produto} - ${produto.nome} - ${produto.sku}`,
  }));

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
        <div className="flex flex-wrap justify-between items-center px-6 md:px-10 pt-6 gap-4">
          <Input
            placeholder="N° OPERADOR: ***000"
            className="bg-[#f5f5f5]/70 sm:w-64 border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-500"
            disabled
          />
          <div className="w-80">
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button className="bg-[var(--vermelho-vivo)] w-full hover:bg-[var(--vermelho-vivo)] hover:opacity-[0.9] cursor-pointer text-white text-base sm:text-lg font-semibold rounded-[15px] py-5 sm:py-6 transition-all">
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

        <Select
          classNamePrefix="select-produto"
          options={opcoesProdutos}
          value={
            opcoesProdutos.find(
              (option) => option.value === produtoSelecionado
            ) || null
          }
          onChange={(selecionado) => {
            setProdutoSelecionado(selecionado ? selecionado.value : null);
          }}
          placeholder="Escolha um instrumento"
          isSearchable
        />

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex flex-col lg:flex-row flex-1 px-4 md:px-10 py-5 gap-6 md:gap-8">
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
          <div className="w-full lg:w-[320px] flex flex-col gap-3">
            <div className="flex flex-col gap-y-[10px]">
              <label>Insira o produto: </label>
              <Input
                placeholder="Insira o produto"
                className="bg-[#f5f5f5]/80 border-none rounded-[15px] focus-visible:ring-0 focus-visible:ring-offset-0 py-4"
              />
              <Button className="bg-black w-full text-white rounded-[15px] hover:bg-neutral-800 hover:opacity-[0.9] cursor-pointer text-sm sm:text-base">
                Adicionar Produto
              </Button>
            </div>

            {/* PRODUTO EM DESTAQUE */}
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-3 border border-gray-200 p-3 rounded-md bg-white/90 text-center sm:text-left">
                <img
                  src="https://placehold.co/40x40?text=Guitarra"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    Guitarra
                  </p>
                  <p className="text-xs text-gray-500">
                    Guitarra Fender 62, corpo Maple Wood
                  </p>
                </div>
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
            <div className="flex justify-around mt-2 text-xs sm:text-sm text-gray-600 gap-3 ">
              <div
                onClick={() => {
                  setFormaPgto(1);
                }}
                className={`flex flex-col w-full bg-[#f7f7f7] pt-2 pb-2 ps-5 pe-5 items-center cursor-pointer hover:border-[var(--vermelho-vivo)] border-2 transition duration-[.3s] rounded-[15px]
                ${
                  formaPgto === 1
                    ? 'border-[var(--vermelho-vivo)]'
                    : 'border-transparent'
                }`}
              >
                <CreditCard size={16} />
                <span className="pt-1">Débito</span>
              </div>
              <div
                onClick={() => {
                  setFormaPgto(2);
                }}
                className={`flex flex-col w-full bg-[#f7f7f7] pt-2 pb-2 ps-5 pe-5 items-center cursor-pointer hover:border-[var(--vermelho-vivo)] border-2 transition duration-[.3s] rounded-[15px]
                ${
                  formaPgto === 2
                    ? 'border-[var(--vermelho-vivo)]'
                    : 'border-transparent'
                }`}
              >
                <CreditCard size={16} />
                <span className="pt-1">Crédito</span>
              </div>
              <div
                onClick={() => {
                  setFormaPgto(3);
                }}
                className={`flex flex-col w-full bg-[#f7f7f7] pt-2 pb-2 ps-5 pe-5 items-center cursor-pointer hover:border-[var(--vermelho-vivo)] border-2 transition duration-[.3s] rounded-[15px]
                ${
                  formaPgto === 3
                    ? 'border-[var(--vermelho-vivo)]'
                    : 'border-transparent'
                }`}
              >
                <ScanLine size={16} />
                <span className="pt-1">Pix</span>
              </div>
            </div>

            <button className="bg-[var(--vermelho-vivo)] rounded-[15px] text-white p-3">
              Fechar Pedido
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
