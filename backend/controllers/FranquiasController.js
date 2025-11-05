import {
  cadastrarFranquia,
  atualizarFranquia,
  listarFranquias,
  listarFranquiaPorId,
} from '../models/Franquias.js';

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
      endereco_completo,
      cidade,
      email_contato,
      telefone_contato,
    } = req.body;

    const franquiaData = {
      codigo_postal,
      endereco_completo,
      cidade,
      email_contato,
      telefone_contato,
    };

    const franquiaId = await cadastrarFranquia(franquiaData);
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
    const { email_contato, telefone_contato, status } = req.body;

    const franquiaData = { email_contato, telefone_contato, status };
    await atualizarFranquia(id_franquia, franquiaData);

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
