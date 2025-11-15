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
} from '../models/Produtos.js';
import { obterCategoriaPorId } from '../models/CategoriasProdutos.js';
import generateSku from '../utils/gerarSku.js';
import { obterEstoquePorSkuEFranquia } from '../models/Estoque.js';
import { log } from 'console';
import { promises } from 'dns';

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
    const variacoesComNomes = [];

    for (const cada of variacoes) {
      const produtoLido = await obterProdutoPorId(cada.id_produto);
      variacoesComNomes.push({
        ...cada,
        nome: `${produtoLido.nome} (${cada.nome_cor})`,
        eVariacao: true,
        id_variacao: cada.id_variacao,
      });
    }

    const todos = produtos.concat(variacoesComNomes);

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
      console.log(variacaoFormatada)
    } else {
      res.status(404).json({ mensagem: `Produto não encontrado` });
    }
  } catch (err) {
    console.error('Erro ao obter produto por ID: ', err);
    res.status(500).json({ menssagem: 'Erro ao obter produto por ID' });
  }
};

// Página de detalhe do produto do catalogo
const obterProdutoPorIdCatalogoController = async (req, res) => {
  try {
    const produto = await obterProdutoPorId(req.params.id);
    const produtoVariacao = await obterVariacoesPorProdutoId(req.params.id);
    const categoria = await obterCategoriaPorId(produto.id_categoria);
    const estoqueVari = [];

    // OBJETOS DE VARIACOES FORMATADOS PARA RECEBIMENTO DO FRONT
    for (const variacao of produtoVariacao) {
      const estoque = await obterEstoquePorSkuEFranquia(variacao.sku, 1);
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
      const estoquee = await obterEstoquePorSkuEFranquia(produto.sku, 1);
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
    let imagemProduto = null;
    if (req.file) {
      imagemProduto = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    }

    const sku = generateSku;

    const produtoData = {
      sku: sku,
      nome: nome || null,
      descricao: descricao || null,
      materiais: materiais || null,
      detalhes: detalhes || null,
      nome_cor: nome_cor || null,
      cor: cor || null,
      id_categoria: id_categoria || null,
      valor: valor || null,
      desconto: desconto || null,
      custo_producao: custo_producao || null,
      imagem: imagemProduto || 'https://placehold.co/500x500',
    };

    const produtoId = await criarProduto(produtoData);
    res
      .status(201)
      .json({ menssagem: 'Produto criado com sucesso', produtoId }).sku = null;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ menssagem: 'Erro ao criar produto' });
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
      cor,
      desconto,
      id_categoria,
      valor,
      custo_producao,
    } = req.body;
    let imagemProduto = null;
    if (req.file) {
      imagemProduto = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    }
    const produtoData = {
      nome: nome || null,
      descricao: descricao || null,
      materiais: materiais || null,
      detalhes: detalhes || null,
      cor: cor || null,
      id_categoria: id_categoria || null,
      valor: valor || null,
      desconto: desconto || null,
      custo_producao: custo_producao || null,
      imagem: imagemProduto || null,
    };

    await atualizarProduto(produtoId, produtoData);
    res.status(200).json({ menssagem: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar Produto:', error);
    res.status(500).json({ menssagem: 'Erro ao atualizar produto' });
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

    await excluirProduto(produtoId);
    res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ mensagem: 'Erro ao excluir produto' });
  }
};

const maisVendidosController = async (req, res) => {
  try {
    const idFranquia = 1;
    const produtos = await maisVendidos(idFranquia);
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
};
