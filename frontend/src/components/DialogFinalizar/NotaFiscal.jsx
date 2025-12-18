'use client';

import { forwardRef } from 'react';

const NotaFiscal = forwardRef(function NotaFiscal(
  { dados, dadosFranquia, dadosFuncionario, parcela },
  ref
) {
  if (!dados) return null;

  const { itens, total, formaPgto, desconto } = dados;

  const formaTexto =
    formaPgto === 1 ? 'Débito' : formaPgto === 2 ? 'Crédito' : 'Pix';

  const listaItens = itens || [];

  return (
    <div
      ref={ref}
      className="w-full bg-white p-1 rounded-xl shadow-lg text-gray-800"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <p className="text-[30px]">Nota Fiscal</p>

        <div className="text-right text-sm leading-tight">
          <p>
            <b>ID Compra:</b> {dados.idVenda}
          </p>
          <p>
            <b>Pagamento:</b> {formaTexto}
          </p>
          <p>
            <b>Local:</b> {dadosFranquia?.endereco_completo}
          </p>
          <p>
            <b>Func Resp:</b> {dadosFuncionario?.nome_completo}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="max-h-[220px] overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--vermelho-vivo)] text-white">
              <th className="p-4">SKU</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Qtd</th>
              <th className="p-4">Total</th>
            </tr>
          </thead>

          <tbody>
            {listaItens.map((produto, index) => (
              <tr key={index} className="odd:bg-gray-100 text-center">
                <td className="py-2">{produto.sku}</td>
                <td className="py-2 max-w-[150px] truncate whitespace-nowrap overflow-hidden">
                  {produto.nome}
                </td>
                <td className="py-2">
                  {Number(produto.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
                <td className="py-2">{produto.qtd}</td>
                <td className="py-2">
                  {Number(produto.preco * produto.qtd).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div className="text-right mt-8">
        {formaPgto === 2 && (
          <p className="text-xs">
            <b>Parcelas:</b> {parcela}
          </p>
        )}

        {desconto > 0 && (
          <p className="text-sm text-gray-500">
            Desconto aplicado:{' '}
            {Number(desconto).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        )}

        <p className="text-lg font-semibold">
          Total:{' '}
          <span className="text-[var(--vermelho-vivo)]">
            {Number(total).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </p>
      </div>

      {/* Rodapé */}
      <div className="mt-12 text-xs text-center opacity-70 flex justify-between">
        <div className="text-left">
          <p>Termos e condições</p>
          <p>
            A Music House se responsabiliza ate certo ponto, o resto é história,
            se vira mlk.
          </p>
        </div>

        <div>
          <p>MUSIC HOUSE</p>
          <p>Responsável pela compra</p>
        </div>
      </div>
    </div>
  );
});

export default NotaFiscal;
