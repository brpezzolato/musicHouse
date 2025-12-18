import { create, update, readAll, read } from '../config/database.js';

const cadastrarFranquia = async (franquiaData) => {
  try {
    return await create('franquias', franquiaData);
  } catch (error) {
    console.error('Erro ao criar franquia:', error);
    throw error;
  }
};

const atualizarFranquia = async (id_franquia, franquiaData) => {
  try {
    return await update(
      'franquias',
      franquiaData,
      `id_franquia = ${id_franquia}`
    );
  } catch (error) {
    console.error('Erro ao atualizar franquia:', error);
    throw error;
  }
};

const listarFranquias = async () => {
  try {
    return await readAll('franquias');
  } catch (error) {
    console.error('Erro ao listar franquias:', error);
    throw error;
  }
};

const listarFranquiaPorId = async (id_franquia) => {
  try {
    return await read('franquias', `id_franquia = ${id_franquia}`);
  } catch (error) {
    console.error('Erro ao buscar franquia por ID:', error);
    throw error;
  }
};

export {
  cadastrarFranquia,
  atualizarFranquia,
  listarFranquias,
  listarFranquiaPorId,
};
