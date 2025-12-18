import {
  read,
  readAll,
  create,
  update,
  deleteRecord,
  executeRawQuery
} from '../config/database.js';

const listarEstoques = async () => {
  try {
    return await readAll('estoque');
  } catch (err) {
    console.error('Erro ao listar estoques: ', err);
    throw err;
  }
};

const listarEstoquesFranquia = async (id_franquia) => {
  try {
    return await readAll('estoque', `id_franquia = ${id_franquia}`);
  } catch (err) {
    console.error('Erro ao listar estoques da franquia: ', err);
    throw err;
  }
};

const obterEstoquePorId = async (id_estoque) => {
  try {
    return await read('estoque', `id_estoque = ${id_estoque}`);
  } catch (err) {
    console.error('Erro ao obter estoque por ID: ', err);
    throw err;
  }
};

const obterEstoquePorSkuEFranquia = async (sku, id_franquia) => {
  try {
    return await read(
      'estoque',
      `sku = ${sku} AND id_franquia = ${id_franquia}`
    );
  } catch (err) {
    console.error('Erro ao obter estoque por ID: ', err);
    throw err;
  }
};

const obterEstoquePorSku = async (sku) => {
  try {
    return await read(
      'estoque',
      `sku = ${sku}`
    );
  } catch (err) {
    console.error('Erro ao obter estoque por ID: ', err);
    throw err;
  }
};

const criarEstoque = async (estoqueData) => {
  try {
    return await create('estoque', estoqueData);
  } catch (error) {
    console.error('Erro ao criar estoque:', error);
    throw error;
  }
};

const atualizarEstoque = async (id_franquia, sku, estoqueData) => {
  try {
    await update(
      'estoque',
      estoqueData,
      `sku = ${sku} AND id_franquia = ${id_franquia}`
    );

  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    throw error;
  }
};

const excluirEstoque = async (id_estoque) => {
  try {
    await deleteRecord('estoque', `id_estoque = ${id_estoque}`);
  } catch (error) {
    console.error('Erro ao excluir estoque:', error);
    throw error;
  }
};
const excluirEstoquePorSku = async (sku) => {
  try {
    await deleteRecord('estoque', `sku = ${sku}`);
  } catch (error) {
    console.error('Erro ao excluir estoque por sku:', error);
    throw error;
  }
};


const criarMovimentacaoEstoque = async (movimentacaoData) => {
  try {
    await create('movimentacoes_estoque', movimentacaoData)
  } catch (error) {
    console.error('Erro ao criar movimentação no estoque', error)
    throw error
  }
}



const criarPedidoMatriz = async (pedidoData) => {
  try {
    await create('pedidos_filiais', pedidoData)
  } catch (error) {
    console.error('Erro ao criar movimentação no estoque', error)
    throw error
  }
}


const listarPedidosMatriz = async () => {
  try {
    return await readAll('pedidos_filiais', `status = 'Pendente'`)
  } catch (error) {
    console.error('Erro ao listar pedidos da matriz', error)
    throw error
  }
}

const obterPedidoPorId = async (id_pedido) => {
  try {
    return await read('pedidos_filiais', `id_pedido = ${id_pedido}`)
  } catch (error) {
    console.error('Erro ao obter pedido por id', error)
    throw error
  }
}

const obterPedidoPorIdFranquiaEstoque = async (id_franquia, id_estoque) => {
  try {
    return await read('pedidos_filiais', `id_franquia = ${id_franquia} AND id_estoque = ${id_estoque} AND status = 'Pendente'`)
  } catch (error) {
    console.error('Erro ao obter pedido por id_franquia e id_estoque', error)
    throw error
  }
}

const atualizarPedidoAprovado = async (id_pedido) => {
  try {
    return await update('pedidos_filiais', { status: `Aprovado` }, `id_pedido = ${id_pedido}`)
  } catch (error) {
    console.error('Erro ao aprovar pedido da matriz', error)
    throw error
  }
}

const atualizarPedidoRecusado = async (id_pedido) => {
  try {
    return await update('pedidos_filiais', { status: `Recusado` }, `id_pedido = ${id_pedido}`)
  } catch (error) {
    console.error('Erro ao recusar pedido da matriz', error)
    throw error
  }
}
const excluirPedidoPoridEstoque = async (id_estoque) => {
  try {
    await deleteRecord('pedidos_filiais', `id_estoque = ${id_estoque}`);
  } catch (error) {
    console.error('Erro ao excluir pedido por sku:', error);
    throw error;
  }
};


const obterEstoquePorIdMatriz = async (id_franquiaMatriz, sku) => {
  try {
    return await read(
      'estoque',
      `id_franquia = ${id_franquiaMatriz} AND sku = ${sku}`
    );
  } catch (err) {
    console.error('Erro ao obter estoque da matriz por SKU e ID da franquia:', err);
    throw err;
  }
};


const listarPedidosFilial = async (id_franquia) => {
  try {
    return readAll('pedidos_filiais', `id_franquia = ${id_franquia}`)
  } catch (err) {
    console.error('erro ao listar pedidos da franquia', err)
    throw err
  }
}

const listarMovimentacoesEstoque = async () => {
  try {
    const sql = `
      SELECT
        me.id_movimentacao,
        me.id_franquia,
        fr.cidade AS franquia_cidade,
        me.tipo_movimentacao,
        me.quantidade_movimentada,
        me.data_movimentacao,

        est.sku AS sku,


        p.nome AS produto_normal,

        CONCAT(pb.nome, ' (', vp.nome_cor, ')') AS produto_variacao

      FROM movimentacoes_estoque me

      LEFT JOIN estoque est 
          ON est.id_estoque = me.id_estoque

      LEFT JOIN franquias fr
          ON fr.id_franquia = me.id_franquia

   
      LEFT JOIN produtos p
          ON p.sku = est.sku

      LEFT JOIN variacoes_produto vp 
          ON vp.sku = est.sku

      LEFT JOIN produtos pb
          ON pb.id_produto = vp.id_produto

      ORDER BY me.data_movimentacao DESC
    `;

    return await executeRawQuery(sql);

  } catch (error) {
    console.error("Erro ao listar movimentações:", error);
    throw error;
  }
};






export {
  listarEstoques,
  obterEstoquePorId,
  criarEstoque,
  atualizarEstoque,
  excluirEstoque,
  obterEstoquePorSkuEFranquia,
  listarEstoquesFranquia,
  criarMovimentacaoEstoque,
  criarPedidoMatriz,
  listarPedidosMatriz,
  atualizarPedidoAprovado,
  obterPedidoPorId,
  atualizarPedidoRecusado,
  obterEstoquePorIdMatriz,
  excluirEstoquePorSku,
  obterEstoquePorSku,
  excluirPedidoPoridEstoque,
  listarPedidosFilial,
  obterPedidoPorIdFranquiaEstoque,
  listarMovimentacoesEstoque
};
