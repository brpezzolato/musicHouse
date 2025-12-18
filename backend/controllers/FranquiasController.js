import {
  cadastrarFranquia,
  atualizarFranquia,
  listarFranquias,
  listarFranquiaPorId,
} from '../models/Franquias.js';
import { listarSkus } from '../models/Produtos.js';
import { create } from '../config/database.js';
import {
  lerFuncionarios,
  atualizarFuncionario,
} from '../models/Funcionario.js';

const listarFranquiasController = async (req, res) => {
  try {
    const franquias = await listarFranquias();
    res.status(200).json(franquias);
  } catch (error) {
    console.error('Erro ao listar franquias:', error);
    res.status(500).json({ mensagem: 'Erro ao listar franquias' });
  }
};

const listarFranquiaPorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const franquia = await listarFranquiaPorId(id);

    if (!franquia) {
      return res.status(404).json({ mensagem: 'Franquia não encontrada.' });
    }

    res.status(200).json(franquia);
  } catch (error) {
    console.error('Erro ao obter franquia por ID:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar franquia.' });
  }
};

const criarFranquiaController = async (req, res) => {
  try {
    const {
      codigo_postal,
      bairro,
      rua,
      numero,
      cidade,
      email_contato,
      telefone_contato,
      status,
    } = req.body;

    const franquiaData = {
      codigo_postal,
      endereco_completo: `${rua}, ${numero} - ${bairro}`,
      cidade,
      email_contato,
      telefone_contato,
      status,
    };

    const skus = await listarSkus();
    const franquiaId = await cadastrarFranquia(franquiaData);

    const estoqueInicial = skus.map((sku) => ({
      id_franquia: franquiaId,
      sku,
      quantidade: 0,
    }));

    for (const item of estoqueInicial) {
      await create('estoque', item);
    }

    res.status(201).json({
      mensagem: 'Franquia criada com sucesso!',
      franquiaId,
    });
  } catch (error) {
    console.error('Erro ao criar Franquia:', error);
    res.status(500).json({ mensagem: 'Erro ao criar Franquia' });
  }
};

const editarFranquiaController = async (req, res) => {
  try {
    const id_franquia = req.params.id;
    const { tipo } = req.query;
    const funcFranquia = await lerFuncionarios(id_franquia);

    if (Number(tipo) === 1) {
      const franquiaData = {
        status: 'Inativo',
      };

      await atualizarFranquia(id_franquia, franquiaData);

      for (const funcionario of funcFranquia) {
        await atualizarFuncionario(funcionario.id_registro, {
          status: 'Inativo',
        });
      }
    } else if (Number(tipo) === 2) {
      const franquiaData = {
        status: 'Ativo',
      };
      await atualizarFranquia(id_franquia, franquiaData);
    } else {
      res.status(500).json({ mensagem: 'Erro ao atualizar franquia' });
    }

    res.status(200).json({ mensagem: 'Franquia atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar franquia:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar franquia' });
  }
};

export {
  listarFranquiasController,
  criarFranquiaController,
  editarFranquiaController,
  listarFranquiaPorIdController,
};
