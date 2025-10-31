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
        SUM(iv.quantidade) AS unidades_vendidas
      FROM item_venda iv
      JOIN produtos p ON p.id_produto = iv.id_produto
      GROUP BY p.id_produto, p.nome, p.descricao, p.valor, p.imagem, p.desconto
      ORDER BY unidades_vendidas DESC
      LIMIT 3;
    `;
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

export {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
  excluirProduto,
  buscarProdutosPorTermo,
  maisVendidos,
  listarProdutosPorCategoria,
};
