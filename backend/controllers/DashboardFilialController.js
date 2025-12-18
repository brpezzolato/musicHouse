import {
  formasPagamento,
  faturamentoMensal,
  vendasDoDia,
  caixasAbertos,
  funcionariosFranquia,
  estoqueProdutos,
  faturamentoUltimos7Dias,
  obterVendasFilial,
  obterItemVendaFilial,
  listarMovimentacoesEstoque,
  faturamentoConsolidadoFilial

} from '../models/DashboardFilial.js';
import { obterDespesaPorId } from '../models/Despesas.js';
import { obterProdutoPorId, obterProdutoPorSku, obterVariacaoPorSku } from '../models/Produtos.js';
import { obterEstoquePorId } from '../models/Estoque.js'
const formasPagamentoController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const pagamentos = await formasPagamento(id_franquia);
    res.status(200).json(pagamentos);
  } catch (error) {
    console.error('Erro no controller de formas de pagamento:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar formas de pagamento' });
  }
};

const faturamentoMensalController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const faturamento = await faturamentoMensal(id_franquia);
    res.status(200).json(faturamento);
  } catch (error) {
    console.error('Erro no controller de faturamento mensal:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar faturamento mensal' });
  }
};

const vendasDoDiaController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;

    const resultado = await vendasDoDia(id_franquia);

    const totalLucro = resultado.reduce((acc, venda) => {
      return acc + Number(venda.lucro || 0);
    }, 0);

    res.status(200).json({
      totalLucro: totalLucro,
    });
  } catch (error) {
    console.error('Erro no controller de vendas do dia:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar vendas do dia' });
  }
};

const caixasAbertosController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const caixas = await caixasAbertos(id_franquia);

    res.status(200).json({ caixas_abertos: caixas.length });
  } catch (error) {
    console.error('Erro no controller de caixas abertos:', error);
    res.status(500).json({ menssagem: 'Erro ao buscar caixas abertos' });
  }
};

const funcionariosFranquiaController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const funcionarios = await funcionariosFranquia(id_franquia);
    res.status(200).json({ funcionarios_ativos: funcionarios.length });
  } catch (error) {
    console.error('Erro no controller de funcionários da franquia:', error);
    res
      .status(500)
      .json({ mensagem: 'Erro ao buscar funcionários da franquia' });
  }
};

const estoqueProdutosController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const produtos = await estoqueProdutos(id_franquia);
    res.status(200).json({ produtosEstoque: produtos.length });
  } catch (error) {
    console.error('Erro no controller de produtos sem estoque:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos sem estoque' });
  }
};


const faturamentoUltimos7DiasController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const faturamento = await faturamentoUltimos7Dias(id_franquia);
    res.status(200).json(faturamento);
  } catch (error) {
    console.error('Erro ao calcular faturamento dos últimos 7 dias:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar faturamento dos últimos 7 dias' });
  }
};

const produtosMaisVendidosDaSemanaController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;

    const vendas = await obterVendasFilial(id_franquia);

    // 1. Coletar SKUs e Quantidades
    const vendaDetalhada = await Promise.all(vendas.map(async (venda) => {
      const item_venda = await obterItemVendaFilial(venda.id_venda);

      return item_venda.map(item => ({
 
        sku: item.sku_produto || item.sku_variacao,
        isVariacao: !!item.sku_variacao,
        quantidade: item.quantidade,
      }));
    }));

    const produtos = vendaDetalhada.flat();

    const agrupados = produtos.reduce((acc, { sku, isVariacao, quantidade }) => {
      if (!sku) return acc;

      if (acc[sku]) {
        acc[sku].quantidade += quantidade;
      } else {
        acc[sku] = {
          sku,
          isVariacao,
          quantidade,
        };
      }
      return acc;
    }, {});

    const produtosArray = Object.values(agrupados)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);


    const produtosComNome = await Promise.all(
      produtosArray.map(async (produto) => {
        const { sku, isVariacao, quantidade } = produto;
        let nomeCompleto = '';
        let produtoBaseSku = sku;

        try {
          if (isVariacao) {

            const variacao = await obterVariacaoPorSku(sku);

            if (variacao) {
              produtoBaseSku = variacao.id_produto;


              const produtoBase = await obterProdutoPorId(produtoBaseSku);

              if (produtoBase) {

                nomeCompleto = `${produtoBase.nome} (${variacao.nome_cor})`;
              } else {
                nomeCompleto = `Variação de SKU ${sku}`;
              }
            } else {

              nomeCompleto = `Variação SKU ${sku} (Dados Incompletos)`;
            }
          } else {

            const produtoBase = await obterProdutoPorSku(sku);
            nomeCompleto = produtoBase ? produtoBase.nome : `Produto SKU ${sku}`;
          }

        } catch (err) {
          console.error(`Erro ao buscar nome para SKU ${sku}:`, err);
          nomeCompleto = `Erro na busca do nome (SKU ${sku})`;
        }


        return {
          sku,
          quantidade,
          nome: nomeCompleto,
        };
      })
    );




    res.status(200).json(produtosComNome);
  } catch (error) {
    console.error('Erro ao obter produtos mais vendidos da semana:', error);
    res.status(500).json({ mensagem: 'Erro ao obter produtos mais vendidos da semana' });
  }
};




const listarMovimentacoesEstoqueController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;


    const movimentacoes = await listarMovimentacoesEstoque(id_franquia);

    const ultimasMovimentacoes = movimentacoes
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 5);

    const movimentacaoDetalhada = await Promise.all(
      ultimasMovimentacoes.map(async (mov) => {


        const estoque = await obterEstoquePorId(mov.id_estoque);



        let produtoNome = "";
        let sku = estoque.sku;

        let produto = await obterProdutoPorSku(sku)

        if (!produto) {

          const variacao = await obterVariacaoPorSku(sku);
          const produtoBase = await obterProdutoPorId(variacao.id_produto);

          produtoNome = `${produtoBase.nome} (${variacao.nome_cor})`;
        } else {

          const produto = await obterProdutoPorSku(sku);
          produtoNome = produto.nome;
        }

        return {
          id_movimentacao: mov.id_movimentacao,
          tipo: mov.tipo_movimentacao,
          quantidade: mov.quantidade_movimentada,
          data: mov.data_movimentacao,
          sku: sku,
          produto: produtoNome
        };
      })
    );

    res.status(200).json(movimentacaoDetalhada);

  } catch (error) {
    console.error("Erro ao obter movimentações do estoque", error);
    res.status(500).json({
      mensagem: "Erro ao obter movimentações do estoque"
    });
  }
};







const faturamentoConsolidadoFilialController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia

    if (!id_franquia) {
      return res.status(400).json({
        mensagem: "O ID da franquia é obrigatório."
      });
    }

    const data = await faturamentoConsolidadoFilial(id_franquia);

    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar faturamento consolidado:", error);
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar faturamento consolidado" });
  }
};






export {
  formasPagamentoController,
  vendasDoDiaController,
  faturamentoMensalController,
  caixasAbertosController,
  funcionariosFranquiaController,
  estoqueProdutosController,
  faturamentoUltimos7DiasController,
  produtosMaisVendidosDaSemanaController,
  listarMovimentacoesEstoqueController,
  faturamentoConsolidadoFilialController


};
