import { cadastrarFranquia, atualizarFranquia } from '../models/Franquias.js';

const criarFranquiaController = async (req, res) => {
  // if (!req.usuario.id) {
  //   return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  // }

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
      mensagem: 'Franquia Criado com sucesso !!!',
      franquiaId,
    });
  } catch (error) {
    console.error('Erro ao criar Franquia:', error);
    res.status(500).json({ mensagem: 'Erro ao criar Franquia' });
  }
};

const editarFranquiaController = async (req, res) => {
  // if (!req.usuarioId) {
  //   return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  // }

  try {
    const id_franquia = req.params.id;

    const {
      codigo_postal,
      endereco_completo,
      cidade,
      email_contato,
      telefone_contato,
      status,
    } = req.body;

    const franquiaData = {
      codigo_postal,
      endereco_completo,
      cidade,
      email_contato,
      telefone_contato,
      status,
    };

    console.log('Dados para atualização da franquia:', franquiaData);

    await atualizarFranquia(id_franquia, franquiaData);
    res.status(200).json({ mensagem: 'Franquia atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar franquia' });
  }
};

export { criarFranquiaController, editarFranquiaController };
