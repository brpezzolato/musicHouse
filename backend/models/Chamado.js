import { create, readAll, update } from '../config/database.js';

const criarChamado = async (chamadoData) => {
  try {
    return await create('chamados', chamadoData);
  } catch (error) {
    console.error('Erro ao criar chamados:', error);
    throw error;
  }
};

const leituraChamados = async (patrimonio, tipoId) => {
  try {
    return await readAll(
      'chamados',
      `patrimonio = "${patrimonio}" AND tipo_id = ${tipoId} AND status != 'concluído'`
    );
  } catch (error) {
    console.error('Erro ao obter consultas:', error);
    throw error;
  }
};

const chamadosVirgens = async (status) => {
  try {
    let whereClause = `tecnico_id IS NULL`;

    if (status) {
      whereClause += ` AND status = '${status}'`;
    }

    return await readAll('chamados', whereClause);
  } catch (error) {
    console.error('Erro ao obter consultas:', error);
    throw error;
  }
};

const atribuicaoChamadosVirgens = async (id, chamadoData) => {
  try {
    await update('chamados', chamadoData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atribuir chamado: ', error);
    throw error;
  }
};

const leituraDeTodosChamados = async () => {
  try {
    return await readAll('chamados');
  } catch (error) {
    console.error('Erro ao obter consultas:', error);
    throw error;
  }
};


const atualizarStatus = async (id, chamadoData) => {
  try {
    await update('chamados', chamadoData, `id = ${id}`);
    const atualizado = await read('chamados', `id = ${id}`);
    return atualizado;
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    throw error;
  }
};

const obterChamadoStatus = async (id) => {
  try {
    return await read('chamados', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter chamado por ID:', error);
    throw error;
  }
};

const obterChamadoUsuario = async (id, funcao) => {
  try {
    if (funcao === 'tecnico') {
      return await readAll('chamados', `tecnico_id  = ${id} AND status != 'concluído'`);
    } else {
      return await readAll('chamados', `usuario_id = ${id} AND status != 'concluído'`);
    }
  } catch (error) {
    console.error('Erro ao obter chamado por ID:', error);
    throw error;
  }
};

const atualizarChamados = async (id, chamadoData) => {
  try {
    await update('chamados', chamadoData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar chamado: ', error);
    throw error;
  }
};

const verTecnico = async (id, funcao) => {
  try {
    return await readAll('pool_tecnico', `id_tecnico  = ${id} AND id_pool  = ${funcao}`);
  } catch (error) {
    console.error('Erro ao obter chamado por ID:', error);
    throw error;
  }
};

const verTecnicoFuncao = async (id) => {
  try {
    return await readAll('pool_tecnico', `id_tecnico  = ${id}`);
  } catch (error) {
    console.error('Erro ao obter chamado por ID:', error);
    throw error;
  }
};

const semResponsavel = async (area) => {
  try {
    return await readAll('chamados', `tipo_id  = ${area} AND status = 'enviado'`);
  } catch (error) {
    console.error('Erro ao obter chamado por ID:', error);
    throw error;
  }
};

export {
  criarChamado,
  leituraDeTodosChamados,
  leituraChamados,
  verTecnico,
  chamadosVirgens,
  atribuicaoChamadosVirgens,
  obterChamadoStatus,
  atualizarStatus,
  obterChamadoUsuario,
  atualizarChamados,
  semResponsavel,
  verTecnicoFuncao
};
