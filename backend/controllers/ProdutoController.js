import { fileURLToPath } from 'url';
import path from 'path';
import {
  atualizarProduto,
  criarProduto,
  listarVariacoes,
  excluirProduto,
  listarProdutos,
  obterProdutoPorId,
  buscarProdutosPorTermo,
  maisVendidos,
  listarProdutosPorCategoria,
  obterProdutoPorSku,
  obterVariacoesPorProdutoId,
  obterVariacaoPorSku,
  criarVariacao,
  listarVariacoesPorIdProduto,
  obterVariacaoPorId,
  atualizarVariacao,
  excluirTodasVariacaoIdProduto,
  excluirVariacao,
} from '../models/Produtos.js';
import {
  obterCategoriaPorId,
  listarCategoria,
} from '../models/CategoriasProdutos.js';
import generateSku from '../utils/gerarSku.js';
import {
  criarEstoque,
  obterEstoquePorSkuEFranquia,
  obterEstoquePorSku,
  excluirPedidoPoridEstoque,
  excluirEstoquePorSku
} from '../models/Estoque.js';
import { listarFranquias } from '../models/Franquias.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listarProdutosController = async (req, res) => {
  try {
    const produtos = await listarProdutos();
    res.status(200).json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    res.status(500).json({ menssagem: 'Erro ao listar produtos' });
  }
};

const listarProdutosVariacoesController = async (req, res) => {
  try {
    const produtos = await listarProdutos();
    const variacoes = await listarVariacoes();
    const franquia = req.usuario.id_franquia;
    const variacoesComNomes = [];
    const produtosComEstoque = [];

    for (const cada of variacoes) {
      const produtoLido = await obterProdutoPorId(cada.id_produto);
      const estoque = await obterEstoquePorSkuEFranquia(cada.sku, franquia);

      if (estoque.quantidade > 0) {
        variacoesComNomes.push({
          ...cada,
          nome: `${produtoLido.nome} (${cada.nome_cor})`,
          eVariacao: true,
          id_variacao: cada.id_variacao,
        });
      }
    }

    for (const cada of produtos) {
      const estoque = await obterEstoquePorSkuEFranquia(cada.sku, franquia);

      if (estoque.quantidade > 0) {
        produtosComEstoque.push({
          ...cada,
        });
      }
    }

    const todos = produtosComEstoque.concat(variacoesComNomes);

    res.status(200).json(todos);
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar produtos' });
  }
};

const listarProdutosBuscaController = async (req, res) => {
  try {
    const termo = req.query.termo;
    const produtos = await buscarProdutosPorTermo(termo);
    res.status(200).json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    res.status(500).json({ menssagem: 'Erro ao listar produtos' });
  }
};

const obterProdutoPorIdController = async (req, res) => {
  try {
    const produto = await obterProdutoPorId(req.params.id);
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ mensagem: `Produto não encontrado` });
    }
  } catch (err) {
    console.error('Erro ao obter produto por ID: ', err);
    res.status(500).json({ menssagem: 'Erro ao obter produto por ID' });
  }
};

const obterVariacaoPorIdController = async (req, res) => {
  try {
    const produto = await obterVariacaoPorId(req.params.id);
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ mensagem: `Variação não encontrado` });
    }
  } catch (err) {
    console.error('Erro ao obter Variacao por ID: ', err);
    res.status(500).json({ menssagem: 'Erro ao obter Variação por ID' });
  }
};

const obterProdutoPorSkuController = async (req, res) => {
  try {
    const produto = await obterProdutoPorSku(req.params.id);
    const variacao = await obterVariacaoPorSku(req.params.id);
    if (produto) {
      const produtoFormatado = {
        id_produto: produto.id_produto,
        sku: produto.sku,
        nome: produto.nome + ` (${produto.nome_cor})`,
        valor: Number(produto.valor),
        desconto: produto.desconto || null,
        valorComDesconto: produto.valor * ((100 - produto.desconto) / 100),
        imagem: produto.imagem,
        descricao: produto.descricao,
        eVariacao: false,
      };
      res.json(produtoFormatado);
      console.log(produtoFormatado);
    } else if (variacao) {
      const produto = await obterProdutoPorId(variacao.id_produto);
      const variacaoFormatada = {
        id_produto: produto.id_produto,
        sku: variacao.sku,
        nome: produto.nome + ` (${variacao.nome_cor})`,
        valor: Number(variacao.valor),
        desconto: variacao.desconto || null,
        valorComDesconto: variacao.valor * ((100 - variacao.desconto) / 100),
        imagem: variacao.imagem,
        descricao: produto.descricao,
        eVariacao: true,
      };
      res.json(variacaoFormatada);
    } else {
      res.status(404).json({ mensagem: `Produto não encontrado` });
    }
  } catch (err) {
    console.error('Erro ao obter produto por ID: ', err);
    res.status(500).json({ menssagem: 'Erro ao obter produto por ID' });
  }
};

const obterProdutoPorIdCatalogoController = async (req, res) => {
  try {
    const produto = await obterProdutoPorId(req.params.id);
    const produtoVariacao = await obterVariacoesPorProdutoId(req.params.id);
    const categoria = await obterCategoriaPorId(produto.id_categoria);
    const franquiaId = req.usuario.id_franquia;
    const estoqueVari = [];

    // OBJETOS DE VARIACOES FORMATADOS PARA RECEBIMENTO DO FRONT
    for (const variacao of produtoVariacao) {
      const estoque = await obterEstoquePorSkuEFranquia(
        variacao.sku,
        franquiaId
      );
      estoqueVari.push({
        id: variacao.id_variacao,
        name: variacao.nome_cor,
        cor: variacao.cor,
        valor: Number(variacao.valor).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        desconto: variacao?.desconto,
        valorComDesconto:
          variacao.desconto != null
            ? Number(
              variacao.valor * ((100 - variacao.desconto) / 100)
            ).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
            : null,
        sku: variacao.sku,
        imagens: variacao.imagem.split(',').map((img) => img.trim()),
        eVariacao: true,
        classes: `checked:outline-gray`,
        outOfStock: estoque.quantidade === 0 ? true : false,
        estoque: estoque.quantidade,
      });
    }

    // OBJETO FORMATADO PARA O FRONT-END RECEBER FACILITADO
    if (produto) {
      const estoquee = await obterEstoquePorSkuEFranquia(
        produto.sku,
        franquiaId
      );
      const produtoFormatado = {
        name: produto.nome,
        sku: produto.sku,
        estoque: estoquee.quantidade,
        price: Number(produto.valor).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        desconto: parseInt(produto?.desconto),
        valorComDesconto:
          produto.desconto != null
            ? Number(
              produto.valor * ((100 - produto.desconto) / 100)
            ).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
            : null,
        href: `/catalogo/produto/${produto.id_produto}`,
        breadcrumbs: [
          { id: 1, name: 'Home', href: '/catalogo' },
          {
            id: 2,
            name: categoria.nome,
            href: `/catalogo/categoria/${categoria.id_categoria}`,
          },
        ],
        colors: [
          {
            id: 0,
            name: produto.nome_cor,
            eVariacao: false,
            cor: produto.cor,
            classes: `checked:outline-gray`,
            outOfStock: estoquee.quantidade === 0 ? true : false,
          },
          ...estoqueVari,
        ],
        highlights: produto.materiais
          .split(',')
          .map((materiais) => materiais.trim()),
        details: produto.detalhes,
        description: produto.descricao,
        slides: produto.imagem.split(',').map((imagem) => imagem.trim()),
      };

      res.status(200).json(produtoFormatado);
    } else {
      res.status(404).json({ mensagem: `Produto não encontrado` });
    }
  } catch (err) {
    console.error('Erro ao obter produto por ID: ', err);
    res.status(500).json({ menssagem: 'Erro ao obter produto por ID' });
  }
};

const criarProdutoController = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      materiais,
      detalhes,
      nome_cor,
      cor,
      desconto,
      id_categoria,
      valor,
      custo_producao,
    } = req.body;

    const filiais = await listarFranquias();


    let imagemProduto = null;


    if (req.files && req.files.length > 0) {
      imagemProduto = req.files.map(file => file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      )).join(',');
    } else if (req.file) {
      imagemProduto = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    }

    const sku = await generateSku();

    const produtoData = {
      sku,
      nome,
      descricao,
      materiais,
      detalhes,
      nome_cor,
      cor,
      desconto: Number(desconto) || null,
      id_categoria,
      valor,
      custo_producao: custo_producao || null,
      imagem: imagemProduto
    };

    for (const cada of filiais) {
      let data = {
        id_franquia: cada.id_franquia,
        sku: sku,
        quantidade: cada.id_franquia === 1 ? 10 : 0,
        aviso: 10,
      };

      await criarEstoque(data);
    }
    const produtoId = await criarProduto(produtoData);
    return res.status(201).json({
      mensagem: 'Produto criado com sucesso',
      produtoId,
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar produto' });
  }
};

const criarVariacaoController = async (req, res) => {
  try {
    const {
      id_produto,
      nome_cor,
      cor,
      desconto,
      valor,
      custo_producao,

    } = req.body;
    const filiais = await listarFranquias();

    let imagemProduto = '';


    if (req.files && req.files.length > 0) {

      imagemProduto = req.files
        .map(file => file.path.replace(
          __dirname.replace('\\controllers', ''),
          ''
        ))
        .join(',');
    }

    const sku = await generateSku();
    const variacaoData = {
      sku,
      id_produto,
      nome_cor,
      cor,
      desconto: desconto || null,
      valor,
      custo_producao,
      imagem: imagemProduto
    };

    for (const cada of filiais) {
      let data = {
        id_franquia: cada.id_franquia,
        sku: sku,
        quantidade: cada.id_franquia === 1 ? 10 : 0,
        aviso: 10,
      };

      await criarEstoque(data);
    }

    const variacaoId = await criarVariacao(variacaoData);

    return res.status(201).json({
      mensagem: 'Variação criada com sucesso',
      variacaoId,
    });
  } catch (error) {
    console.error('Erro ao criar variacao:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar Variação' });
  }
};


const atualizarProdutoController = async (req, res) => {
  try {
    const produtoId = req.params.id;
    const {
      nome,
      descricao,
      materiais,
      detalhes,
      nome_cor,
      cor,
      desconto,
      id_categoria,
      valor,
      custo_producao,
      imagem,
    } = req.body;
    let imagemProduto = null;


    if (req.files && req.files.length > 0) {
      imagemProduto = req.files.map(file => file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      )).join(',');
    } else if (req.file) {
      imagemProduto = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    }
    const produtoData = {
      nome,
      descricao,
      materiais,
      detalhes,
      nome_cor,
      cor,
      desconto: desconto || null,
      id_categoria,
      valor,
      custo_producao,
      imagem: imagemProduto
    };

    await atualizarProduto(produtoId, produtoData);
    res.status(200).json({ menssagem: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar Produto:', error);
    res.status(500).json({ menssagem: 'Erro ao atualizar produto' });
  }
};
const atualizarVariacaoController = async (req, res) => {
  try {
    const variacaoId = req.params.id;
    const { valor, custo_producao, desconto, nome_cor, cor } = req.body;

 
    let imagemProduto = null;


    if (req.files && req.files.length > 0) {
      imagemProduto = req.files.map(file => file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      )).join(',');
    } else if (req.file) {
      imagemProduto = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    }

    const variacaoData = {
      valor,
      custo_producao,
      desconto: desconto === 0 ? null : desconto,
      nome_cor,
      cor,
      imagem: imagemProduto
    };

    await atualizarVariacao(variacaoId, variacaoData);
    res.status(200).json({ menssagem: 'Variação atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar Variacao:', error);
    res.status(500).json({ menssagem: 'Erro ao atualizar Variação' });
  }
};


const excluirProdutoController = async (req, res) => {
  try {
    const produtoId = req.params.id;
    const produto = await obterProdutoPorId(produtoId);
    if (!produto) {
      return res
        .status(404)
        .json({ mensagem: 'Nenhum produto encontrado com esse id' });
    }

    const sku = produto.sku;

    const estoque = await obterEstoquePorSku(sku);
    await excluirPedidoPoridEstoque(estoque.id_estoque);
    await excluirEstoquePorSku(sku);


    const variacoes = await obterVariacoesPorProdutoId(produtoId);
    for (let variacao of variacoes) {
      const estoqueVariacao = await obterEstoquePorSku(variacao.sku);
      await excluirPedidoPoridEstoque(estoqueVariacao.id_estoque);
      await excluirEstoquePorSku(variacao.sku);
    }


    await excluirTodasVariacaoIdProduto(produtoId);

    await excluirProduto(produtoId);

    res.status(200).json({ mensagem: 'Produto, variações e pedidos excluídos com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ mensagem: 'Erro ao excluir produto' });
  }
};



const excluirVariacaoController = async (req, res) => {
  try {
    const variacaoId = req.params.id;

    const variacaoProduto = await obterVariacaoPorId(variacaoId);
    if (!variacaoProduto) {
      return res
        .status(404)
        .json({ mensagem: 'Nenhuma variação encontrada com esse id' });
    }

    const sku = variacaoProduto.sku;


    const estoque = await obterEstoquePorSku(sku);


    if (!estoque) {
      return res
        .status(404)
        .json({ mensagem: 'Estoque relacionado à variação não encontrado' });
    }


    await excluirPedidoPoridEstoque(estoque.id_estoque);


    await excluirEstoquePorSku(sku);

    await excluirVariacao(variacaoId);

    res.status(200).json({ mensagem: 'Variação e seus pedidos excluídos com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir variação:', error);
    res.status(500).json({ mensagem: 'Erro ao excluir variação' });
  }
};


const maisVendidosController = async (req, res) => {
  try {
    const produtos = await maisVendidos();
    res.status(200).json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos mais vendidos: ', err);
    res
      .status(500)
      .json({ menssagem: 'Erro ao listar produtos mais vendidos' });
  }
};

const listarProdutosPorCategoriaController = async (req, res) => {
  try {
    const id_categoria = req.query.categoria;
    const produtos = await listarProdutosPorCategoria(Number(id_categoria));
    res.status(200).json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    res.status(500).json({ menssagem: 'Erro ao listar produtos' });
  }
};

const listarProdutosMatrizController = async (req, res) => {
  try {
    const produtos = await listarProdutos();
    const categorias = await listarCategoria();

    const produtosComCategorias = produtos.map((cada) => {
      const categoria = categorias.find(
        (c) => c.id_categoria === cada.id_categoria
      );

      return {
        ...cada,
        categoria: categoria ? categoria.nome : null,
        iconeCategoria: categoria.iconeSite,
      };
    });

    res.status(200).json(produtosComCategorias);
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    res.status(500).json({ menssagem: 'Erro ao listar produtos' });
  }
};

const listarVariacoesPorIdProdutoController = async (req, res) => {
  try {
    const id = req.params.id;

    const variacoes = await listarVariacoesPorIdProduto(id);

    res.status(200).json(variacoes);
  } catch (err) {
    console.error('Erro ao listar variacoes por id produto: ', err);
    res
      .status(500)
      .json({ menssagem: 'Erro ao listar listar variacoes por id produto' });
  }
};

export {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
  excluirProdutoController,
  listarProdutosBuscaController,
  maisVendidosController,
  listarProdutosPorCategoriaController,
  obterProdutoPorIdCatalogoController,
  listarProdutosVariacoesController,
  obterProdutoPorSkuController,
  listarProdutosMatrizController,
  criarVariacaoController,
  listarVariacoesPorIdProdutoController,
  obterVariacaoPorIdController,
  atualizarVariacaoController,
  excluirVariacaoController,
};
