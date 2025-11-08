import { create, update } from '../config/database.js';

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

export { criarVenda, criarItemVenda, addLucroVenda };
