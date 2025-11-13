import {
  read,
  readAll,
  create,
  update,
  deleteRecord,
  executeRawQuery,
} from '../config/database.js';

const listarProdutos = async () => {
  try {
    return await readAll('produtos');
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    throw err;
  }
};

const obterProdutoPorId = async (id_produto) => {
  try {
    return await read('produtos', `id_produto = ${id_produto}`);
  } catch (err) {
    console.error('Erro ao obter produto por ID: ', err);
    throw err;
  }
};

const obterProdutoPorSku = async (sku) => {
  try {
    return await read('produtos', `sku = ${sku}`);
  } catch (err) {
    console.error('Erro ao obter produto por Sku: ', err);
    throw err;
  }
};

const obterVariacaoPorSku = async (sku) => {
  try {
    return await read('variacoes_produto', `sku = ${sku}`);
  } catch (err) {
    console.error('Erro ao obter variação por Sku: ', err);
    throw err;
  }
};

const obterVariacoesPorProdutoId = async (id_produto) => {
  try {
    return await readAll('variacoes_produto', `id_produto = ${id_produto}`);
  } catch (err) {
    console.error('Erro ao obter variacoes do produto por ID: ', err);
    throw err;
  }
};

const criarProduto = async (produtoData) => {
  try {
    return await create('produtos', produtoData);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

const atualizarProduto = async (id_produto, produtoData) => {
  try {
    await update('produtos', produtoData, `id_produto = ${id_produto}`);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

const excluirProduto = async (id_produto) => {
  try {
    await deleteRecord('produtos', `id_produto = ${id_produto}`);
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    throw error;
  }
};

const buscarProdutosPorTermo = async (termo) => {
  try {
    const query = `nome LIKE '%${termo}%' OR descricao LIKE '%${termo}%'`;
    return await readAll('produtos', query);
  } catch (err) {
    console.error('Erro ao buscar produtos por termo: ', err);
    throw err;
  }
};

const maisVendidos = async () => {
  try {
    const sql = `
      SELECT 
        p.id_produto,
        p.nome,
        p.descricao,
        p.valor,
        p.imagem,
        p.desconto,
        COALESCE(SUM(iv.quantidade), 0) AS unidades_vendidas
      FROM produtos p
      LEFT JOIN variacoes_produto vp ON vp.id_produto = p.id_produto
      LEFT JOIN item_venda iv 
        ON iv.sku_produto = p.sku OR iv.sku_variacao = vp.sku
      GROUP BY p.id_produto, p.nome, p.descricao, p.valor, p.imagem, p.desconto
      ORDER BY unidades_vendidas DESC
      LIMIT 3;`;
    return await executeRawQuery(sql);
  } catch (err) {
    console.error('Erro ao buscar produtos mais vendidos: ', err);
    throw err;
  }
};

const listarProdutosPorCategoria = async (id_categoria) => {
  try {
    return await readAll('produtos', `id_categoria = ${id_categoria}`);
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    throw err;
  }
};

const listarVariacoes = async () => {
  try {
    return await readAll('variacoes_produto');
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    throw err;
  }
};

const listarSkus = async () => {
  try {
    const produtos = await executeRawQuery('SELECT sku FROM produtos;');
    const variacoes = await executeRawQuery(
      'SELECT sku FROM variacoes_produto;'
    );

    const todosSkus = [...produtos, ...variacoes];

    const skuCada = todosSkus.map((cada) => {
      return cada.sku;
    });
    return skuCada;
  } catch (err) {
    console.error('Erro ao listar skus: ', err);
    throw err;
  }
};

export {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
  excluirProduto,
  buscarProdutosPorTermo,
  maisVendidos,
  listarProdutosPorCategoria,
  obterVariacoesPorProdutoId,
  listarVariacoes,
  obterProdutoPorSku,
  obterVariacaoPorSku,
  listarSkus,
};
