import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
  executeRawQuery
} from "../config/database.js";

const listarDespesasFranquia = async (id_franquia) => {
  try {
    return await readAll("despesas", `id_franquia = ${id_franquia}`);
  } catch (err) {
    console.error("Erro ao listar despesas: ", err);
    throw err;
  }
};

const obterDespesaPorId = async (id) => {
  try {
    return await read("despesas", `id_despesa = ${id}`);
  } catch (err) {
    console.error("Erro ao obter despesa por ID: ", err);
    throw err;
  }
};

const criarDespesa = async (despesaData) => {
  try {
    return await create("despesas", despesaData);
  } catch (err) {
    console.error("Erro ao criar despesa: ", err);
    throw err;
  }
};

const atualizarDespesa = async (idDespesa, despesaData) => {
  try {
    return await update("despesas", despesaData, `id_despesa = ${idDespesa}`);
  } catch (err) {
    console.error("Erro ao atualizar despesa: ", err);
    throw err;
  }
};

const atualizarDespesaParaPaga = async (idDespesa) => {
  try {
    return await update("despesas", { status: "Paga"}, `id_despesa = ${idDespesa}`);
  } catch (err) {
    console.error("Erro ao atualizar despesa: ", err);
    throw err;
  }
};

const excluirDespesa = async (idDespesa) => {
  try {
    return await deleteRecord("despesas", `id_despesa = ${idDespesa}`);
  } catch (error) {
    console.error("Erro ai excluir despesa: ", error);
    throw error
  }
}



const totalDespesasFranquia = async (id_franquia) => {
  try {
    const resultado = await readAll(
      "despesas",
      `id_franquia = ${id_franquia}`,
      "SUM(valor) AS total"
    );

    return resultado[0]?.total ?? 0;
  } catch (err) {
    console.error("Erro ao calcular total de despesas:", err);
    throw err;
  }
};





const listarDespesasAtrasadas = async (id_franquia) => {
  try {
    return await readAll(
      "despesas",
      `id_franquia = ${id_franquia} 
       AND data_pagamento < CURDATE()
       AND status != 'Paga'`
    );
  } catch (err) {
    console.error("Erro ao listar despesas atrasadas: ", err);
    throw err;
  }
};


const listarDespesasFuturas = async (id_franquia) => {
  try {
    return await readAll(
      "despesas",
      `id_franquia = ${id_franquia} 
       AND data_pagamento > CURDATE()`
    );
  } catch (err) {
    console.error("Erro ao listar despesas futuras: ", err);
    throw err;
  }
};

const totalDespesasAPagar = async (id_franquia) => {
  try {
    const resultado = await readAll(
      "despesas",
      `id_franquia = ${id_franquia} 
       AND status IN ('Pendente')`,
      "SUM(valor) AS total"
    );

    return Number(resultado[0]?.total) || 0;
  } catch (err) {
    console.error("Erro ao calcular total de despesas a pagar:", err);
    throw err;
  }
};

const totalLucroMensal = async (id_franquia) => {
  try {
    const sql = `
      SELECT 
        COALESCE(SUM(iv.lucro), 0) AS total_lucro
      FROM venda iv
      INNER JOIN venda v ON v.id_venda = iv.id_venda
      WHERE v.id_franquia = ?
        AND v.status = 'Paga'
        AND MONTH(v.data_venda) = MONTH(CURRENT_DATE())
        AND YEAR(v.data_venda) = YEAR(CURRENT_DATE());
    `;

    const resultado = await executeRawQuery(sql, [id_franquia]);


    return Number(resultado[0]?.total_lucro) || 0;

  } catch (err) {
    console.error("Erro ao calcular lucro mensal:", err);
    throw err;
  }
};



const totalLucroMensalGeral = async () => {
  try {
    const sql = `
      SELECT 
        COALESCE(SUM(lucro), 0) AS total_lucro
      FROM venda
      WHERE status = 'Paga'
        AND MONTH(data_venda) = MONTH(CURRENT_DATE())
        AND YEAR(data_venda) = YEAR(CURRENT_DATE());
    `;

    const resultado = await executeRawQuery(sql);

    return Number(resultado[0]?.total_lucro) || 0;

  } catch (err) {
    console.error("Erro ao calcular lucro mensal:", err);
    throw err;
  }
};









export {
  listarDespesasFranquia,
  obterDespesaPorId,
  criarDespesa,
  atualizarDespesa,
  excluirDespesa,
  totalDespesasFranquia,
  listarDespesasAtrasadas,
  listarDespesasFuturas,
  totalDespesasAPagar,
  totalLucroMensal, 
  atualizarDespesaParaPaga,
  totalLucroMensalGeral


};