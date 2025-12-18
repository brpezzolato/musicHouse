import { readAll, executeRawQuery } from "../config/database.js";

const formasPagamento = async (id_franquia) => {
  try {
    const sql = `
      SELECT 
        fp.tipo,
        COUNT(v.id_venda) AS total_vendas,
        SUM(v.valor_total) AS total_faturado
      FROM venda v
      JOIN formasPagamentos fp 
        ON v.id_pagamento = fp.id_pagamento
      WHERE v.id_franquia = ?
        AND v.status = 'Paga'
      GROUP BY fp.tipo;
    `;

    return await executeRawQuery(sql, [id_franquia]);
  } catch (error) {
    console.error("Erro ao buscar formas de pagamento:", error);
    throw error;
  }
};

const faturamentoMensal = async (id_franquia) => {
  try {
    const sql = `
      SELECT 
        DATE_FORMAT(data_venda, '%Y-%m') AS mes,
        SUM(lucro) AS faturamento
      FROM venda
      WHERE id_franquia = ?
        AND status = 'Paga'
      GROUP BY DATE_FORMAT(data_venda, '%Y-%m')
      ORDER BY mes;
    `;

    return await executeRawQuery(sql, [id_franquia]);
  } catch (error) {
    console.error("Erro ao buscar faturamento mensal:", error);
    throw error;
  }
};

const vendasDoDia = async (id_franquia) => {
  try {
    return readAll(
      "venda",
      `id_franquia = ${id_franquia} AND DATE(data_venda) = CURDATE() AND status = 'Paga'`
    );
  } catch (error) {
    console.error("Erro ao buscar vendas do dia:", error);
    throw error;
  }
};

const caixasAbertos = async (id_franquia) => {
  try {
    return await readAll(
      "caixas",
      `id_franquia = ${id_franquia} AND status = 'aberto'`
    );
  } catch (error) {
    console.error("Erro ao buscar caixas abertos:", error);
    throw error;
  }
};

const funcionariosFranquia = async (id_franquia) => {
  try {
    return await readAll(
      "funcionarios",
      `id_franquia = ${id_franquia} AND status = 'ativo'`
    );
  } catch (error) {
    console.error("Erro ao buscar funcionários da franquia:", error);
  }
};

const estoqueProdutos = async (id_franquia) => {
  try {
    return await readAll(
      "estoque",
      `id_franquia = ${id_franquia} AND quantidade >= 0`
    );
  } catch (error) {
    console.error("Erro ao buscar produtos sem estoque:", error);
  }
};

const faturamentoUltimos7Dias = async (id_franquia) => {
  const hoje = new Date();
  const seteDiasAntes = new Date(hoje);
  seteDiasAntes.setDate(hoje.getDate() - 7);

  const queryString = `
    SELECT 
      DATE(data_venda) AS data,
      DATE_FORMAT(data_venda, '%W') AS dia_semana,
      SUM(lucro) AS faturamento
    FROM venda
    WHERE id_franquia = ?
      AND data_venda BETWEEN ? AND ?
    GROUP BY 
      DATE(data_venda),
      DATE_FORMAT(data_venda, '%W')
    ORDER BY DATE(data_venda) DESC
  `;

  const diasSemanaEmPortugues = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  try {
    const result = await executeRawQuery(queryString, [
      id_franquia,
      seteDiasAntes.toISOString().slice(0, 19).replace("T", " "),
      hoje.toISOString().slice(0, 19).replace("T", " "),
    ]);

    return result.map((row) => ({
      dia_semana:
        diasSemanaEmPortugues[row.dia_semana.toLowerCase()] || row.dia_semana,
      data: row.data,
      faturamento: row.faturamento || 0,
    }));
  } catch (error) {
    console.error("Erro ao calcular faturamento dos últimos 7 dias:", error);
    throw error;
  }
};

const obterVendasFilial = async (id_franquia) => {
  try {
    const hoje = new Date();
    const seteDiasAntes = new Date(hoje);
    seteDiasAntes.setDate(hoje.getDate() - 7);

    const hojeStr = hoje.toISOString().slice(0, 10);
    const seteDiasAntesStr = seteDiasAntes.toISOString().slice(0, 10);

    // Ajuste para lidar com o horário
    const hojeComHoraInicio = `${hojeStr} 00:00:00`; // Início do dia de hoje
    const hojeComHoraFim = `${hojeStr} 23:59:59`; // Fim do dia de hoje

    const query = `
      SELECT * FROM venda
      WHERE id_franquia = ? 
      AND data_venda BETWEEN ? AND ?
    `;

    const result = await executeRawQuery(query, [
      id_franquia,
      seteDiasAntesStr,
      hojeComHoraFim,
    ]);

    return result;
  } catch (error) {
    console.error("Erro ao obter vendas da filial:", error);
    throw error;
  }
};

const obterItemVendaFilial = async (id_venda) => {
  try {
    return await readAll("item_venda", `id_venda = ${id_venda}`);
  } catch (error) {
    console.error("Erro ao obter item_vendas a partir do id_venda:", error);
    throw error;
  }
};

const listarMovimentacoesEstoque = async (id_franquia) => {
  try {
    return await readAll(
      "movimentacoes_estoque",
      `id_franquia = ${id_franquia} ORDER BY data_movimentacao DESC`
    );
  } catch (error) {
    console.error("Erro ao obter movimentações do estoque:", error);
    throw error;
  }
};





const faturamentoConsolidadoFilial = async (id_franquia) => {
  const daily = await executeRawQuery(
    `SELECT DATE(data_venda) AS data, SUM(lucro) AS total
     FROM venda
     WHERE data_venda >= DATE(NOW() - INTERVAL 7 DAY)
       AND id_franquia = ?
     GROUP BY DATE(data_venda)
     ORDER BY data ASC`,
    [id_franquia]
  );

  const monthly = await executeRawQuery(
    `SELECT DATE(data_venda) AS data, SUM(lucro) AS total
     FROM venda
     WHERE data_venda >= DATE(NOW() - INTERVAL 30 DAY)
       AND id_franquia = ?
     GROUP BY DATE(data_venda)
     ORDER BY data ASC`,
    [id_franquia]
  );

  const annual = await executeRawQuery(
    `SELECT DATE_FORMAT(data_venda, '%Y-%m') AS mes, SUM(lucro) AS total
     FROM venda
     WHERE data_venda >= DATE(NOW() - INTERVAL 12 MONTH)
       AND id_franquia = ?
     GROUP BY DATE_FORMAT(data_venda, '%Y-%m')
     ORDER BY mes ASC`,
    [id_franquia]
  );

  return { daily, monthly, annual };
};











export {
  formasPagamento,
  faturamentoMensal,
  vendasDoDia,
  caixasAbertos,
  funcionariosFranquia,
  estoqueProdutos,
  faturamentoUltimos7Dias,
  obterVendasFilial,
  obterItemVendaFilial,
  listarMovimentacoesEstoque,
  faturamentoConsolidadoFilial
};
