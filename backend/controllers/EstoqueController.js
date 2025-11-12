import {
  listarEstoques,
  obterEstoquePorId,
  criarEstoque,
  atualizarEstoque,
  excluirEstoque,
  obterEstoquePorSkuEFranquia,
} from '../models/Estoque.js';

import { listarSkus } from '../models/Produtos.js';

const listarEstoquesController = async (req, res) => {
  try {
    const estoques = await listarEstoques();
    res.json(estoques);
  } catch (err) {
    console.error('Erro ao listar estoques:', err);
    res.status(500).json({ mensagem: 'Erro ao listar estoques' });
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

export {
  listarEstoquesController,
  obterEstoquePorIdController,
  criarEstoqueController,
  excluirEstoqueController,
};
