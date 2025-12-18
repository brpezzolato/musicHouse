import {
  create,
  readAll,
  read,
  update,
  getConnection,
  deleteRecord,
} from '../config/database.js';

const lerTodosFuncionarios = async () => {
  try {

    return await readAll('funcionarios');

  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    throw error;
  }
};

const lerFuncionarios = async (franquia) => {
  try {
    if (franquia === undefined) {
      return await readAll('funcionarios', `status = 'Ativo'`);
    } else {
      return await readAll(
        'funcionarios',
        `id_franquia = ${franquia} AND status = 'Ativo'`
      );
    }
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    throw error;
  }
};

const lerFuncionariosPorFranquia = async (id_franquia) => {
  const connection = await getConnection();

  try {
    const [franquiaRows] = await connection.execute(
      `SELECT * FROM franquias WHERE id_franquia = ?`,
      [id_franquia]
    );

    if (franquiaRows.length === 0) {
      return { franquiaExiste: false, funcionarios: [] };
    }

    const [cols] = await connection.execute(`SHOW COLUMNS FROM credenciais`);
    const pk = cols.find((c) => c.Key === 'PRI')?.Field || 'id_credencial';

    const [rows] = await connection.execute(
      `SELECT 
        f.id_registro,
        f.nome_completo,
        f.email,
        f.telefone,
        f.fotoFuncionario,
        f.status,
        c.cargo
      FROM funcionarios f
      JOIN credenciais c ON f.id_credencial = c.${pk}
      WHERE f.id_franquia = ?`,
      [id_franquia]
    );

    return { franquiaExiste: true, funcionarios: rows };
  } catch (error) {
    console.error('Erro ao listar funcionários por franquia:', error);
    throw error;
  } finally {
    connection.release();
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


const desligarFuncionario = async (id_funcionario) => {
  try {
    return await update("funcionarios", { status: "Inativo" }, `id_registro = ${id_funcionario}`);
  } catch (err) {
    console.error("Erro ao atualizar despesa: ", err);
    throw err;
  }
};


const ligarFuncionario = async (id_funcionario) => {
  try {
    return await update("funcionarios", { status: "Ativo" }, `id_registro = ${id_funcionario}`);
  } catch (err) {
    console.error("Erro ao atualizar despesa: ", err);
    throw err;
  }
};

const obterCargoPorId = async (id_credencial) => {
  try {
    return await read('credenciais', `id_credenciais = ${id_credencial}`);
  } catch (error) {
    console.error('Erro ao obter cargo por ID:', error);
    throw error;
  }
};


const obterFuncionario = async (id_registro) => {
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

const deletarFuncionario = async (id_funcionario) => {
  try {
    return await deleteRecord(
      'funcionarios',
      `id_registro = ${id_funcionario}`
    );
  } catch (error) {
    console.error('Erro ao deletar funcionario:', error);
    throw error
  }
};




export {
  lerFuncionarios,
  lerFuncionariosPorFranquia,
  obterFuncionarioPorId,
  obterFuncionario,
  criarFuncionario,
  atualizarFuncionario,
  deletarFuncionario,
  obterCargoPorId,
  desligarFuncionario,
  ligarFuncionario, 
  lerTodosFuncionarios
};
