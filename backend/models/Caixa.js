import { create, read, update } from '../config/database.js';

const abrirCaixa = async (caixaData) => {
  try {
    return await create('caixas', caixaData);
  } catch (error) {
    console.error('Erro ao abrir caixa:', error);
    throw error;
  }
};

const lerCadaSessao = async (id_funcionario) => {
  try {
    return await read(
      'caixas',
      `id_funcionario = ${id_funcionario} AND status = 'aberto'`
    );
  } catch (error) {
    console.error('Erro ao ler sessão:', error);
    throw error;
  }
};

const fecharCaixa = async (id_caixa, fechamentoData) => {
  try {
    return await update(
      'caixas',
      fechamentoData,
      `id_sessao_caixa = ${id_caixa}`
    );
  } catch (error) {
    console.error('Erro ao fechar caixa:', error);
    throw error;
  }
};

export { abrirCaixa, lerCadaSessao, fecharCaixa };
