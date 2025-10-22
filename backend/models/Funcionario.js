import { create, readAll, read } from '../config/database.js';

const lerFuncionarios = async (franquia) => {
  try {
    if (franquia === undefined) {
      return await readAll('funcionarios', `status = 'Ativo'`);
    } else {
      return await readAll(
        'funcionarios',
        `id_franquia  = ${franquia} AND status = 'Ativo'`
      );
    }
  } catch (error) {
    console.error('Erro ao criar funcionario:', error);
    throw error;
  }
};

const obterFuncionarioPorId = async (id_registro) => {
  try {
    return await read('funcionarios', `id_registro = ${id_registro}`);
  } catch (error) {
    console.error('Erro ao obter funcionario por ID:', error);
    throw error;
  }
};

const criarFuncionario = async (funcionarioData) => {
  try {
    return await create('funcionarios', funcionarioData);
  } catch (error) {
    console.error('Erro ao criar funcionario:', error);
    throw error;
  }
};

const atualizarFuncionario = async (id_funcionario, funcionarioData) => {
  try {
    return await update(
      'funcionarios',
      funcionarioData,
      `id_registro = ${id_funcionario}`
    );
  } catch (error) {
    console.error('Erro ao atualizar funcionario:', error);
    throw error;
  }
};

export {
  lerFuncionarios,
  obterFuncionarioPorId,
  criarFuncionario,
  atualizarFuncionario,
};
