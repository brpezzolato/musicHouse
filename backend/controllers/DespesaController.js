import {
  listarDespesasFranquia,
  criarDespesa,
  obterDespesaPorId,
  excluirDespesa,
  totalDespesasFranquia,
  listarDespesasAtrasadas,
  listarDespesasFuturas,
  totalDespesasAPagar,
  totalLucroMensal,
  atualizarDespesa,
  atualizarDespesaParaPaga,
  totalLucroMensalGeral
} from '../models/Despesas.js';

const listarDespesasFranquiaController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const despesas = await listarDespesasFranquia(id_franquia);
    res.status(200).json(despesas);
  } catch (err) {
    console.error('Erro ao listar despesas da franquia: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar despesas da franquia' });
  }
};

const obterDespesaPorIdController = async (req, res) => {
  try {
    const id_despesa = req.params.id_despesa;
    const despesa = await obterDespesaPorId(id_despesa);
    res.status(200).json(despesa);
  } catch (err) {
    console.error('Erro ao obter despesa por ID: ', err);
    res.status(500).json({ mensagem: 'Erro ao obter despesa por ID' });
  }
};

const criarDespesaController = async (req, res) => {
  try {
    const franquiaId = req.usuario.id_franquia;
    const { categoria, descricao, valor, data_pagamento, status } = req.body;
    const novaDespesa = {
      id_franquia: franquiaId,
      categoria,
      descricao,
      valor,
      data_criacao: new Date().toISOString().split('T')[0],
      data_pagamento,
      status,
    };
    await criarDespesa(novaDespesa);
    res.status(201).json({ mensagem: 'Despesa criada com sucesso' });
  } catch (err) {
    console.error('Erro ao criar despesa: ', err);
    res.status(500).json({ mensagem: 'Erro ao criar despesa' });
  }
};

const atualizarDespesaController = async (req, res) => {
  try {
    const id_despesa = req.params.id_despesa;
    const franquiaId = req.usuario.id_franquia;

    const { categoria, descricao, valor, data_pagamento, status } = req.body;
    console.log(req.body);
    const despesaAtualizar = {
      id_franquia: franquiaId,
      categoria,
      descricao,
      valor,
      data_pagamento,
      status,
    };

    await atualizarDespesa(id_despesa, despesaAtualizar);
    res.status(200).json({ menssagem: 'Despesa atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar despesa: ', err);
    res.status(500).json({ mensagem: 'Erro ao atualizar despesa' });
  }
};

const atualizarDespesaParaPagaController = async (req, res) => {
  try {
    const id_despesa = req.params.id_despesa;

    await atualizarDespesaParaPaga(id_despesa);
    res.status(200).json({ menssagem: 'Despesa atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar despesa: ', err);
    res.status(500).json({ mensagem: 'Erro ao atualizar despesa' });
  }
};

const excluirDespesaController = async (req, res) => {
  try {
    const id_despesa = req.params.id_despesa;
    const despesa = await obterDespesaPorId(id_despesa);
    if (!despesa) {
      return res.status(404).json({ mensagem: 'Despesa não encontrada' });
    }
    await excluirDespesa(id_despesa);
    res.status(200).json({ mensagem: 'Despesa excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir despesa: ', err);
    res.status(500).json({ mensagem: 'Erro ao excluir despesa' });
  }
};

const totalDespesasFranquiaController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const total = await totalDespesasFranquia(id_franquia);
    res.status(200).json({ total_despesas: total });
  } catch (err) {
    console.error('Erro ao obter total de despesas da franquia: ', err);
    res
      .status(500)
      .json({ mensagem: 'Erro ao obter total de despesas da franquia' });
  }
};

const despesasAtrasadasController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const despesasAtrasadas = await listarDespesasAtrasadas(id_franquia);
    res.status(200).json(despesasAtrasadas);
  } catch (err) {
    console.error('Erro ao listar despesas atrasadas: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar despesas atrasadas' });
  }
};

const listarDespesasFuturasController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const despesasFuturas = await listarDespesasFuturas(id_franquia);
    res.status(200).json(despesasFuturas);
  } catch (err) {
    console.error('Erro ao listar despesas futuras: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar despesas futuras' });
  }
};
const totalDespesasAPagarController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const totalAPagar = await totalDespesasAPagar(id_franquia);
    res.status(200).json({ total_despesas_a_pagar: totalAPagar });
  } catch (err) {
    console.error('Erro ao obter total de despesas a pagar: ', err);
  }
};
const totalLucroMesController = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const totalLucro = await totalLucroMensal(id_franquia);
    res.status(200).json({ total_lucro_mes: totalLucro });
  } catch (err) {
    console.error('Erro ao obter total de lucro do mês: ', err);
    res.status(500).json({ mensagem: 'Erro ao obter total de lucro do mês' });
  }
};


const totalLucroMesControllerGeral = async (req, res) => {
  try {
    const totalLucro = await totalLucroMensalGeral();
    res.status(200).json({ total_lucro_mes: totalLucro });
  } catch (err) {
    console.error('Erro ao obter total de lucro do mês: ', err);
    res.status(500).json({ mensagem: 'Erro ao obter total de lucro do mês' });
  }
};

export {
  listarDespesasFranquiaController,
  criarDespesaController,
  obterDespesaPorIdController,
  excluirDespesaController,
  totalDespesasFranquiaController,
  despesasAtrasadasController,
  listarDespesasFuturasController,
  totalDespesasAPagarController,
  totalLucroMesController,
  atualizarDespesaController,
  atualizarDespesaParaPagaController,
  totalLucroMesControllerGeral,
  
};
