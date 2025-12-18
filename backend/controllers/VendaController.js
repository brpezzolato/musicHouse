import { criarVenda, criarItemVenda, addLucroVenda, listarVendas, obterItemVenda, obterPagamentosPorId, listarVendasGeral } from '../models/Venda.js';
import { obterProdutoPorSku, obterVariacaoPorSku } from '../models/Produtos.js';
import {
  obterEstoquePorSkuEFranquia,
  atualizarEstoque,
  criarMovimentacaoEstoque
} from '../models/Estoque.js';
import { lerCadaSessao } from '../models/Caixa.js';
import { obterFuncionarioPorId } from '../models/Funcionario.js';


const criarVendaController = async (req, res) => {
  try {
    const {
      valor_total,
      desconto,
      id_pagamento,
      itensVenda,
      parcelas,
    } = req.body;
    let itemVendaData = {};
    let lucroVendaTotal = 0;
    const id_franquia = req.usuario.id_franquia;
    const id_funcionario = req.usuario.id_registro;
    const sessaoCaixaAberta = await lerCadaSessao(id_funcionario);

    const vendaData = {
      id_franquia: id_franquia,
      id_funcionario: id_funcionario,
      id_sessao_caixa: sessaoCaixaAberta.id_sessao_caixa,
      valor_total: valor_total,
      lucro: null,
      desconto: desconto,
      id_pagamento: id_pagamento,
      parcelamento: parcelas,
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
        id_franquia
      );
      const data = {
        quantidade: quantidadeAntiga.quantidade - cada.qtd,
      };
      await atualizarEstoque(id_franquia, produtoLido.sku, data);


      const estoque = await obterEstoquePorSkuEFranquia(produtoLido.sku, id_franquia);
      const quantidadeAnterior = estoque.quantidade;
      const quantidadeMovimentada = cada.qtd;
      const quantidadeAtual = quantidadeAnterior - quantidadeMovimentada



      const movimentacaoData = {
        id_estoque: estoque.id_estoque,
        id_franquia,
        id_funcionario,
        tipo_movimentacao: "Saida",
        quantidade_anterior: quantidadeAnterior,
        quantidade_movimentada: quantidadeMovimentada,
        quantidade_atual: quantidadeAtual,
      };

      await criarMovimentacaoEstoque(movimentacaoData);
    }

    if (parcelas) {
      lucroVendaTotal = lucroVendaTotal * 0.95;
    }
    const lucroVendaEnviar = { lucro: lucroVendaTotal };
    await addLucroVenda(vendaId, lucroVendaEnviar);

    res.status(201).json({
      mensagem: 'Venda criada com sucesso',
      venda: {
        id: vendaId,
        data: new Date(),
        valor_total,
        desconto,
        id_pagamento,
        parcelas,
        id_franquia,
        id_funcionario,
        itens: itensVenda
      }
    });
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({ menssagem: 'Erro ao criar venda' });
  }
};




const listarVendasController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia


    const vendas = await listarVendas(id_franquia);

    const vendasComItens = await Promise.all(
      vendas.map(async (venda) => {


        const item_venda = await obterItemVenda(venda.id_venda)
        const skuProduto =
          Array.isArray(item_venda) &&
            item_venda.length > 0 &&
            item_venda[0].sku_produto
            ? item_venda[0].sku_produto
            : item_venda[0]?.sku_variacao || null;


        const funcionario = await obterFuncionarioPorId(venda.id_funcionario)
        const pagamento = await obterPagamentosPorId(venda.id_pagamento);
        const tipoPagamento =
          Array.isArray(pagamento) && pagamento.length > 0
            ? pagamento[0].tipo
            : "Desconhecido";


        return {
          id_venda: venda.id_venda,
          id_franquia: venda.id_franquia,
          funcionario: funcionario.nome_completo,
          id_sessao_caixa: venda.id_sessao_caixa,
          valor_total: venda.valor_total,
          parcelamento: venda.parcelamento,
          lucro: venda.lucro,
          sku: skuProduto,
          desconto: venda.desconto,
          pagamento: tipoPagamento,
          status: venda.status,
          data_venda: venda.data_venda,
        };
      })
    );

    return res.status(200).json(vendasComItens);

  } catch (error) {
    console.error("Erro ao listar vendas:", error);
    res.status(500).json({ mensagem: "Erro ao listar vendas" });
  }
};




const listarVendasGeralController = async (req, res) => {
  try {
    const vendas = await listarVendasGeral();

    const vendasFormatadas = vendas.map(v => ({
      id_venda: v.id_venda,
      franquia: v.franquia,
      funcionario: v.funcionario,
      id_sessao_caixa: v.id_sessao_caixa,
      valor_total: v.valor_total,
      parcelamento: v.parcelamento,
      lucro: v.lucro,
      desconto: v.desconto,
      pagamento: v.pagamento,
      status: v.status,
      data_venda: v.data_venda,

    
      sku: v.sku_produto || v.sku_variacao || null
    }));

    return res.status(200).json(vendasFormatadas);

  } catch (error) {
    console.error("Erro ao listar vendas:", error);
    res.status(500).json({ mensagem: "Erro ao listar vendas" });
  }
};







export { criarVendaController, listarVendasController,listarVendasGeralController };