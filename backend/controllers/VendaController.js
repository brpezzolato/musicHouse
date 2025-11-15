import { criarVenda, criarItemVenda, addLucroVenda } from '../models/Venda.js';
import { obterProdutoPorSku, obterVariacaoPorSku } from '../models/Produtos.js';
import {
  obterEstoquePorSkuEFranquia,
  atualizarEstoque,
} from '../models/Estoque.js';

const criarVendaController = async (req, res) => {
  try {
    const {
      id_franquia,
      id_funcionario,
      id_sessao_caixa,
      valor_total,
      desconto,
      id_pagamento,
      itensVenda,
    } = req.body;
    let itemVendaData = {};
    let lucroVendaTotal = 0;

    const vendaData = {
      id_franquia: id_franquia || 1,
      id_funcionario: id_funcionario || 1,
      id_sessao_caixa: id_sessao_caixa || 1,
      valor_total: valor_total,
      lucro: null,
      desconto: desconto,
      id_pagamento: id_pagamento,
    };

    const venda = await criarVenda(vendaData);
    const vendaId = parseInt(venda);

    for (const cada of itensVenda) {
      let produtoLido;
      if (cada.eVariacao === true) {
        produtoLido = await obterVariacaoPorSku(cada.sku);
        itemVendaData = {
          id_venda: vendaId,
          sku_variacao: cada.sku,
          quantidade: cada.qtd,
          preco_unitario:
            cada.desconto != null ? cada.valorComDesconto : cada.preco,
          valor_total:
            cada.desconto != null
              ? cada.valorComDesconto * cada.qtd
              : cada.preco * cada.qtd,
          lucro:
            cada.desconto != null
              ? (cada.valorComDesconto - produtoLido.custo_producao) * cada.qtd
              : (cada.preco - produtoLido.custo_producao) * cada.qtd,
        };
      } else {
        produtoLido = await obterProdutoPorSku(cada.sku);
        itemVendaData = {
          id_venda: vendaId,
          sku_produto: produtoLido.sku,
          quantidade: cada.qtd,
          preco_unitario:
            cada.desconto != null ? cada.valorComDesconto : cada.preco,
          valor_total:
            cada.desconto != null
              ? cada.valorComDesconto * cada.qtd
              : cada.preco * cada.qtd,
          lucro:
            cada.desconto != null
              ? (cada.valorComDesconto - produtoLido.custo_producao) * cada.qtd
              : (cada.preco - produtoLido.custo_producao) * cada.qtd,
        };
      }
      lucroVendaTotal += itemVendaData.lucro;
      await criarItemVenda(itemVendaData);
      const quantidadeAntiga = await obterEstoquePorSkuEFranquia(
        produtoLido.sku,
        id_franquia || 1
      );
      const data = {
        quantidade: quantidadeAntiga.quantidade - cada.qtd,
      };
      await atualizarEstoque(id_franquia || 1, produtoLido.sku, data);
    }

    const lucroVendaEnviar = { lucro: lucroVendaTotal };
    await addLucroVenda(vendaId, lucroVendaEnviar);

    res.status(201).json({ menssagem: 'Venda criado com sucesso', vendaId });
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({ menssagem: 'Erro ao criar venda' });
  }
};

export { criarVendaController };
