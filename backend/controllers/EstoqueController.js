import {
  listarEstoques,
  obterEstoquePorId,
  criarEstoque,
  atualizarEstoque,
  excluirEstoque,
  listarEstoquesFranquia,
  obterEstoquePorSkuEFranquia,
  criarMovimentacaoEstoque,
  criarPedidoMatriz,
  listarPedidosMatriz,
  atualizarPedidoAprovado,
  obterPedidoPorId,
  atualizarPedidoRecusado,
  obterEstoquePorIdMatriz,
  listarPedidosFilial,
  obterPedidoPorIdFranquiaEstoque,
  listarMovimentacoesEstoque
} from '../models/Estoque.js';
import {
  obterProdutoPorSku,
  obterVariacaoPorSku,
  obterProdutoPorId,
} from '../models/Produtos.js';
import { listarSkus } from '../models/Produtos.js';
import { listarFranquiaPorId } from '../models/Franquias.js';
import { obterCategoriaPorId } from '../models/CategoriasProdutos.js';

const listarEstoquesController = async (req, res) => {
  try {
    const estoques = await listarEstoques();
    res.json(estoques);
  } catch (err) {
    console.error('Erro ao listar estoques:', err);
    res.status(500).json({ mensagem: 'Erro ao listar estoques' });
  }
};

const listarEstoquesFranquiaController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const produtosEstoque = await listarEstoquesFranquia(id_franquia);

    if (!produtosEstoque || produtosEstoque.length === 0) {
      return res
        .status(404)
        .json({ mensagem: 'Nenhum produto encontrado no estoque.' });
    }

    const produtosComNomesPromises = produtosEstoque.map(
      async (itemEstoque) => {
        const sku = itemEstoque.sku;
        let nomeProdutoCompleto = null;
        let isVariacao = false;
        let produtoPai = null;
        let categoriaNome = 'N/A';

        let produtoDetalhe = await obterProdutoPorSku(sku);

        if (produtoDetalhe && produtoDetalhe.nome) {
          nomeProdutoCompleto = produtoDetalhe.nome;
          produtoPai = produtoDetalhe;
        } else {
          const variacaoDetalhe = await obterVariacaoPorSku(sku);

          if (variacaoDetalhe && variacaoDetalhe.id_produto) {
            isVariacao = true;

            produtoPai = await obterProdutoPorId(variacaoDetalhe.id_produto);

            if (produtoPai && produtoPai.nome && variacaoDetalhe.nome_cor) {
              nomeProdutoCompleto = `${produtoPai.nome} (${variacaoDetalhe.nome_cor})`;
            } else if (produtoPai && produtoPai.nome) {
              nomeProdutoCompleto = produtoPai.nome;
            } else if (variacaoDetalhe.nome_cor) {
              nomeProdutoCompleto = `Variação: ${variacaoDetalhe.nome_cor}`;
            }
          }
        }

        if (produtoPai && produtoPai.id_categoria) {
          const categoriaDetalhe = await obterCategoriaPorId(
            produtoPai.id_categoria
          );
          if (categoriaDetalhe && categoriaDetalhe.nome) {
            categoriaNome = categoriaDetalhe.nome;
          }
        }

        const nomeFinal =
          nomeProdutoCompleto || 'Produto / Variação não identificados';

        return {
          id_estoque: itemEstoque.id_estoque,
          produto: nomeFinal,
          sku: sku,
          quantidade: itemEstoque.quantidade,
          aviso: itemEstoque.aviso,
          is_variacao: isVariacao,
          categoria: categoriaNome,
        };
      }
    );

    const produtosFormatados = await Promise.all(produtosComNomesPromises);

    return res.status(200).json(produtosFormatados);
  } catch (err) {
    console.error('Erro ao listar estoques da franquia:', err);
    return res
      .status(500)
      .json({ mensagem: 'Erro ao listar estoques da franquia' });
  }
};

const obterEstoquePorIdController = async (req, res) => {
  try {
    const estoque = await obterEstoquePorId(req.params.id);
    if (!estoque) {
      return res.status(404).json({ mensagem: 'Estoque não encontrado' });
    }
    res.json(estoque);
  } catch (err) {
    console.error('Erro ao obter estoque:', err);
    res.status(500).json({ mensagem: 'Erro ao obter estoque' });
  }
};

const criarEstoqueController = async (req, res) => {
  try {
    const { id_franquia, sku, quantidade, aviso } = req.body;

    const skus = await listarSkus();
    const existeSku = skus.find((q) => q === sku);
    const jaExiste = await obterEstoquePorSkuEFranquia(sku, id_franquia);

    if (existeSku === undefined) {
      return res.status(400).json({ mensagem: 'Sku não existe' });
    }
    if (jaExiste) {
      return res.status(400).json({
        mensagem:
          'Já tem estoque para este produto, favor alterar na parte de uptade',
      });
    }

    const estoqueData = { id_franquia, sku, quantidade, aviso };
    const id = await criarEstoque(estoqueData);
    res.status(201).json({ mensagem: 'Estoque criado com sucesso', id });
  } catch (error) {
    console.error('Erro ao criar estoque:', error);
    res.status(500).json({ mensagem: 'Erro ao criar estoque' });
  }
};

const excluirEstoqueController = async (req, res) => {
  try {
    const id_estoque = req.params.id;
    await excluirEstoque(id_estoque);

    res.status(200).json({ mensagem: 'Estoque excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir estoque:', error);
    res.status(500).json({ mensagem: 'Erro ao excluir estoque' });
  }
};

const criarPedidoMatrizController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const id_funcionario = req.usuario.id_registro;
    const id_estoque = req.params.id_estoque;

    const pedido = await obterPedidoPorIdFranquiaEstoque(id_franquia, id_estoque)

    if (pedido) {
      return res.status(400).json({ menssagem: 'Já existe um pedido pendente para esse produto' })
    }
    const { quantidade_movimentada, observacao, prioridade } = req.body;

    const pedidoData = {
      id_estoque,
      id_franquia,
      id_funcionario,
      quantidade: quantidade_movimentada,
      observacao,
      prioridade,
    };

    await criarPedidoMatriz(pedidoData);
    res.status(201).json({ menssagem: 'Pedido criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar pedido a matriz', error);
    res.status(500).json({ menssagem: 'Erro ao criar pedido a matriz' });
  }
};

const listarPedidosMatrizController = async (req, res) => {
  try {
    const pedidos = await listarPedidosMatriz();



    const pedidosComDetalhes = await Promise.all(
      pedidos.map(async (pedido) => {
        const { id_estoque, id_franquia } = pedido;

        const estoque = await obterEstoquePorId(id_estoque);
        if (!estoque) {
          throw new Error(
            `Estoque não encontrado para o pedido ${pedido.id_pedido}`
          );
        }

        const sku = estoque.sku;
        let nomeProdutoCompleto = null;
        let isVariacao = false;
        let produtoPai = null;
        let categoriaNome = 'N/A';

        let produtoDetalhe = await obterProdutoPorSku(sku);

        if (produtoDetalhe && produtoDetalhe.nome) {
          nomeProdutoCompleto = produtoDetalhe.nome;
          produtoPai = produtoDetalhe;
        } else {
          const variacaoDetalhe = await obterVariacaoPorSku(sku);

          if (variacaoDetalhe && variacaoDetalhe.id_produto) {
            isVariacao = true;

            produtoPai = await obterProdutoPorId(variacaoDetalhe.id_produto);

            if (produtoPai && produtoPai.nome && variacaoDetalhe.nome_cor) {
              nomeProdutoCompleto = `${produtoPai.nome} (${variacaoDetalhe.nome_cor})`;
            } else if (produtoPai && produtoPai.nome) {
              nomeProdutoCompleto = produtoPai.nome;
            } else if (variacaoDetalhe.nome_cor) {
              nomeProdutoCompleto = `Variação: ${variacaoDetalhe.nome_cor}`;
            }
          }
        }

        if (produtoPai && produtoPai.id_categoria) {
          const categoriaDetalhe = await obterCategoriaPorId(
            produtoPai.id_categoria
          );
          if (categoriaDetalhe && categoriaDetalhe.nome) {
            categoriaNome = categoriaDetalhe.nome;
          }
        }

        const nomeFinal =
          nomeProdutoCompleto || 'Produto / Variação não identificados';

        const franquia = await listarFranquiaPorId(id_franquia);
        if (!franquia) {
          throw new Error(
            `Franquia não encontrada para o pedido ${pedido.id_pedido}`
          );
        }

        return {
          id_pedido: pedido.id_pedido,
          id_estoque: pedido.id_estoque,
          observacao: pedido.observacao,
          prioridade: pedido.prioridade,
          status: pedido.status,
          quantidade: pedido.quantidade,
          produto: {
            nome: nomeFinal,
            categoria: categoriaNome,
            sku: sku,
          },
          franquia: {
            cidade: franquia.cidade,
            rua: franquia.endereco_completo,
          },
        };
      })
    );

    res.status(200).json(pedidosComDetalhes);
  } catch (error) {
    console.error('Erro ao listar pedidos da matriz', error);
    res.status(500).json({ mensagem: 'Erro ao listar pedidos da matriz' });
  }
};


const listarPedidosFilialController = async (req, res) => {
  try {

    const id_franquia = req.usuario.id_franquia

    const pedidos = await listarPedidosFilial(id_franquia);

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum pedido encontrado para esta filial' });
    }

    const pedidosComDetalhes = await Promise.all(
      pedidos.map(async (pedido) => {

        const { id_estoque } = pedido;

        const estoque = await obterEstoquePorId(id_estoque);
        if (!estoque) {
          throw new Error(
            `Estoque não encontrado para o pedido ${pedido.id_pedido || pedido.id}`
          );
        }

        const sku = estoque.sku;
        let nomeProdutoCompleto = 'Produto Desconhecido';
        let nomeVariacao = null;
        let produtoPai = null;
        let categoriaNome = 'N/A';

        let produtoDetalhe = await obterProdutoPorSku(sku);

        if (produtoDetalhe) {

          produtoPai = produtoDetalhe;
          nomeProdutoCompleto = produtoDetalhe.nome || produtoDetalhe.titulo || nomeProdutoCompleto;
        } else {

          const variacaoDetalhe = await obterVariacaoPorSku(sku);

          if (variacaoDetalhe && variacaoDetalhe.id_produto) {
            nomeVariacao = variacaoDetalhe.nome_cor || variacaoDetalhe.nome_variacao;


            produtoPai = await obterProdutoPorId(variacaoDetalhe.id_produto);

            if (produtoPai) {
              const nomeBase = produtoPai.nome || produtoPai.titulo || nomeProdutoCompleto;
              if (nomeVariacao) {
                nomeProdutoCompleto = `${nomeBase} (${nomeVariacao})`;
              } else {
                nomeProdutoCompleto = nomeBase;
              }
            } else {

              nomeProdutoCompleto = nomeVariacao ? `Variação: ${nomeVariacao}` : nomeProdutoCompleto;
            }
          }
        }


        if (produtoPai && produtoPai.id_categoria) {
          const categoriaDetalhe = await obterCategoriaPorId(
            produtoPai.id_categoria
          );
          if (categoriaDetalhe && categoriaDetalhe.nome) {
            categoriaNome = categoriaDetalhe.nome;
          }
        }


        return {

          id_pedido: pedido.id_pedido || pedido.id,
          data_pedido: pedido.data_pedido || null,
          observacao: pedido.observacao,
          prioridade: pedido.prioridade,
          status: pedido.status,
          quantidade: pedido.quantidade,
          produto: nomeProdutoCompleto,
          variacao: nomeVariacao,
          sku: estoque.sku,
          categoria: categoriaNome,



        };
      })
    );


    res.status(200).json(pedidosComDetalhes);

  } catch (error) {
    console.error('Erro ao listar pedidos da filial:', error);
    res.status(500).json({ mensagem: 'Erro ao listar pedidos da filial. Consulte logs do servidor.' });
  }
};



const criarMovimentacaoEstoqueController = async (req, res) => {
  try {
    const id_franquiaMatriz = req.usuario.id_franquia;
    const id_funcionario = req.usuario.id_registro;
    const id_estoque = req.params.id_estoque;
    const id_pedido = req.params.id_pedido;
    const pedido = await obterPedidoPorId(id_pedido);

    const quantidade = pedido.quantidade;
    const id_franquiaPedido = pedido.id_franquia;

    const estoque = await obterEstoquePorId(id_estoque);

    if (!estoque) {
      return res.status(404).json({ mensagem: 'Estoque não encontrado.' });
    }

    // CORREÇÃO: Variável estoqueMatriz agora é declarada com 'let'
    let estoqueMatriz = await obterEstoquePorIdMatriz(id_franquiaMatriz, estoque.sku);
    console.log(id_franquiaMatriz)

    if (quantidade > estoqueMatriz.quantidade) {
      return res.status(400).json({ mensagem: 'Não foi possível realizar a movimentação devido à quantidade insuficiente no estoque.' });
    }



    const quantidade_anterior = Number(estoque.quantidade);
    let quantidade_atual;

    quantidade_atual = quantidade_anterior + Number(quantidade);
    console.log(quantidade_atual);

    const movimentacaoDataFilial = {
      id_estoque,
      id_franquia: id_franquiaPedido,
      id_funcionario,
      tipo_movimentacao: 'Entrada',
      quantidade_anterior,
      quantidade_movimentada: quantidade,
      quantidade_atual,
    };

    await criarMovimentacaoEstoque(movimentacaoDataFilial);
    await atualizarEstoque(id_franquiaPedido, estoque.sku, { quantidade: quantidade_atual });
    await atualizarPedidoAprovado(id_pedido);




    const estoqueMatrizAtualizado = estoqueMatriz.quantidade - quantidade;


    estoqueMatriz = await obterEstoquePorSkuEFranquia(estoque.sku, id_franquiaMatriz)

    const movimentacaoDataMatriz = {

      id_estoque: estoqueMatriz.id_estoque,
      id_franquia: id_franquiaMatriz,
      id_funcionario,
      tipo_movimentacao: 'Saida',
      quantidade_anterior: estoqueMatriz.quantidade,
      quantidade_movimentada: quantidade,
      quantidade_atual: estoqueMatrizAtualizado,
    };

    await criarMovimentacaoEstoque(movimentacaoDataMatriz);
    await atualizarEstoque(id_franquiaMatriz, estoque.sku, { quantidade: estoqueMatrizAtualizado });

    return res.status(201).json({ mensagem: 'Movimentação no estoque registrada com sucesso.' });
  } catch (error) {
    console.error('Erro ao criar movimentação no estoque:', error);
    res.status(500).json({ mensagem: 'Erro ao criar movimentação no estoque.' });
  }
};

const atualizarEstoqueMatrizController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia
    const id_estoque = req.params.id_estoque
    const id_funcionario = req.usuario.id_registro;
    const { novaQuantidade } = req.body;


    const estoque = await obterEstoquePorId(id_estoque)

    const quantidade_anterior = Number(estoque.quantidade);
    let quantidade_atual;

    quantidade_atual = quantidade_anterior + Number(novaQuantidade);




    const movimentacaoData = {
      id_estoque,
      id_franquia: id_franquia,
      id_funcionario,
      tipo_movimentacao: 'Entrada',
      quantidade_anterior,
      quantidade_movimentada: novaQuantidade,
      quantidade_atual,
    };

    await criarMovimentacaoEstoque(movimentacaoData);
    await atualizarEstoque(id_franquia, estoque.sku, { quantidade: quantidade_atual });


    res.status(200).json({ menssagem: 'pedido recusado com sucesso' })
  } catch (error) {
    console.log('erro ao atualizar estoque da matriz', error)
    res.status(500).json({ menssagem: 'erro ao atualizar estoque da matriz' })
  }
}






const atualizarPedidoRecusadoController = async (req, res) => {
  try {
    const id_pedido = req.params.id_pedido
    await atualizarPedidoRecusado(id_pedido)
    res.status(200).json({ menssagem: 'pedido recusado com sucesso' })
  } catch (error) {
    console.log('erro ao recusar pedido da matriz', error)
    res.status(500).json({ menssagem: 'erro ao recusar pedido da matriz' })
  }
}










const listarMovimentacoesEstoqueController = async (req, res) => {
  try {
    const movs = await listarMovimentacoesEstoque();

    const formatado = movs.map(m => ({
      id_movimentacao: m.id_movimentacao,
      franquia: m.franquia_cidade,
      tipo: m.tipo_movimentacao,
      quantidade: m.quantidade_movimentada,
      data: m.data_movimentacao,
      sku: m.sku,
      produto: m.produto_normal || m.produto_variacao
    }));

    return res.status(200).json(formatado);

  } catch (error) {
    console.error("Erro ao obter movimentações do estoque", error);
    res.status(500).json({ mensagem: "Erro ao obter movimentações do estoque" });
  }
};








export {
  listarEstoquesController,
  obterEstoquePorIdController,
  criarEstoqueController,
  excluirEstoqueController,
  listarEstoquesFranquiaController,
  criarMovimentacaoEstoqueController,
  criarPedidoMatrizController,
  listarPedidosMatrizController,
  atualizarPedidoRecusadoController,
  atualizarEstoqueMatrizController,
  listarPedidosFilialController,
  listarMovimentacoesEstoqueController
};
