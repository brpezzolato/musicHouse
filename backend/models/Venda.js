import { create, read, readAll, update, executeRawQuery } from '../config/database.js';

const criarVenda = async (vendaData) => {
  try {
    return await create('venda', vendaData);
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    throw error;
  }
};

const criarItemVenda = async (itemVendaData) => {
  try {
    return await create('item_venda', itemVendaData);
  } catch (error) {
    console.error('Erro ao criar item da venda:', error);
    throw error;
  }
};

const addLucroVenda = async (id_venda, lucroVenda) => {
  try {
    return await update('venda', lucroVenda, `id_venda = ${id_venda}`);
  } catch (error) {
    console.error('Erro ao atualizar lucro da venda:', error);
    throw error;
  }
};

const listarVendas = async (id_franquia) => {
  try {
    return await readAll('venda', `id_franquia = ${id_franquia} ORDER BY data_venda DESC`)
  } catch (error) {
    console.error('Erro ao listar todas as vendas', error);
    throw error;
  }
}


 const listarVendasGeral = async () => {
  try {
    const sql = `
      SELECT
        v.id_venda,
        v.id_franquia,
        fr.cidade AS franquia,
        v.id_funcionario,
        f.nome_completo AS funcionario,
        v.id_sessao_caixa,
        v.valor_total,
        v.parcelamento,
        v.lucro,
        v.desconto,
        v.status,
        v.data_venda,

        pg.tipo AS pagamento,

        /* SKU do produto (normal ou variação) */
        it.sku_produto,
        it.sku_variacao

      FROM venda v
      LEFT JOIN franquias fr ON fr.id_franquia = v.id_franquia
      LEFT JOIN funcionarios f ON f.id_registro = v.id_funcionario
      LEFT JOIN formasPagamentos pg ON pg.id_pagamento = v.id_pagamento

      LEFT JOIN item_venda it ON it.id_venda = v.id_venda

      ORDER BY v.data_venda DESC
    `;

    return await executeRawQuery(sql);
  } catch (error) {
    console.error("Erro ao listar vendas geral:", error);
    throw error;
  }
};




const obterItemVenda = async (id_venda) => {
  try {
    return await readAll('item_venda', `id_venda = ${id_venda}`)

  } catch (error) {
    console.error('Erro ao obter item_vendas a partir do id_venda:', error);
    throw error;
  }
}

const obterPagamentosPorId = async (id_pagamento) => {
  try {
    return await readAll('formasPagamentos', `id_pagamento = ${id_pagamento}`)

  } catch (error) {
    console.error('Erro ao obter pagamento por id:', error);
    throw error;
  }
}





export { criarVenda, criarItemVenda, addLucroVenda, listarVendas, obterItemVenda, obterPagamentosPorId, listarVendasGeral };
