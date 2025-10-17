import { create, update } from '../config/database.js';

const cadastrarFranquia = async (franquiaData) => {
  try {
    return await create('franquias', franquiaData);
  } catch (error) {
    console.error('Erro ao criar franquias:', error);
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

export { cadastrarFranquia, atualizarFranquia };
