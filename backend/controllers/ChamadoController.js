import {
  criarChamado,
  leituraChamados,
  chamadosVirgens,
  atribuicaoChamadosVirgens,
  leituraDeTodosChamados,
  semResponsavel,
  verTecnicoFuncao,
  verTecnico,
  atualizarChamados,
  atualizarStatus,
  obterChamadoUsuario
} from '../models/Chamado.js';
import { fileURLToPath } from 'url';
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const criarChamadoController = async (req, res) => {
  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }

  try {
    const { titulo, descricao, patrimonio, prioridade, tipo } = req.body;
    const usuario = req.usuario.id;



    const chamadosExistentes = await leituraChamados(patrimonio, tipo);

    if (chamadosExistentes.length > 0) {
      return res.status(409).json({
        mensagem:
          'Seu chamado não pôde ser criado pois já existe um registro em aberto para este patrimônio e tipo de solicitação.',
      });
    }

    let arquivos = null;
    if (req.files && req.files.length > 0) {
      arquivos = req.files
        .map(file => file.path.replace(__dirname.replace("\\controllers", ""), ""))
        .join(",");
    }

    const chamadoData = {
      titulo: titulo,
      descricao: descricao,
      patrimonio: patrimonio,
      grau_prioridade: prioridade,
      tipo_id: tipo,
      usuario_id: usuario,
    };

    const chamadoId = await criarChamado(chamadoData);
    res.status(201).json({
      mensagem:
        'Registramos seu chamado! Nossa equipe já está ciente e um técnico cuidará da sua solicitação o mais breve possível.',
      chamadoId,
    });
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    res.status(500).json({ mensagem: 'Erro ao criar chamado' });
  }
};

const listarChamadosVirgensController = async (req, res) => {
  try {
    const { status } = req.query;

    let chamados;
    if (status) {
      chamados = await chamadosVirgens(status);
    } else {
      chamados = await chamadosVirgens();
    }


    res.status(200).json(chamados);
  } catch (err) {
    console.error(`Erro ao listar chamados: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};


const atribuirChamadoController = async (req, res) => {

  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }
  try {
    const chamadoId = req.params.id;
    const tecnico = req.usuario.id;



    const tecnicoDesignado = {
      tecnico_id: tecnico,
      status: 'em andamento'
    };

    await atribuicaoChamadosVirgens(chamadoId, tecnicoDesignado);
    res.status(200).json({ mensagem: 'Chamado atribuído com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar chamado' });
  }
};


const atualizarStatusController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusPermitidos = ["enviado", "em andamento", "concluído"];
  const statusLower = status?.toLowerCase();

  if (!statusPermitidos.includes(statusLower)) {
    return res.status(400).json({ mensagem: "Status inválido" });
  }

  const idNum = parseInt(id);
  if (isNaN(idNum)) {
    return res.status(400).json({ mensagem: "ID inválido" });
  }

  try {
    const atualizado = await atualizarStatus(idNum, { status: statusLower });
    res.status(200).json(atualizado);
  } catch (err) {
    console.error("Erro ao atualizar chamado:", err);
    res.status(500).json({ mensagem: "Erro ao atualizar chamado", atualizado });
  }
};

const listarTodosChamadosController = async (req, res) => {
  try {
    const chamados = await leituraDeTodosChamados();
    res.status(200).json(chamados);
  } catch (err) {
    console.error(`Erro ao listar todos os chamados: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};

const obterChamadoUsuarioController = async (req, res) => {
  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }
  try {
    const { funcao } = req.query;
    const id = req.usuario.id;

    let chamados;
    if (funcao === 'tecnico') {
      chamados = await obterChamadoUsuario(id, funcao);
    } else {
      chamados = await obterChamadoUsuario(id, funcao);
    }

    const ultimos = chamados.slice(-3)

    res.status(200).json(ultimos);
  } catch (err) {
    console.error(`Erro ao listar chamados: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};

const atualizarChamadoController = async (req, res) => {
  if (!req.usuario?.id) return res.status(401).json({ mensagem: 'Usuário não autenticado' });

  try {
    const id = req.params.id;
    const tipoValue = parseInt(req.query.tipo, 10);

    const { TITULO, DESCRICAO, TIPO_ID, TECNICO_ID } = req.body;

    if (tipoValue === 2) {
      const chamadoData = {
        titulo: TITULO,
        descricao: DESCRICAO,
        tipo_id: TIPO_ID,
        tecnico_id: TECNICO_ID
      };
      const tecnicoDesignado = {
        status: 'em andamento'
      };
      if (TECNICO_ID) {
        await atribuicaoChamadosVirgens(id, tecnicoDesignado);
      }
      await atualizarChamados(id, chamadoData);
      console.log("tipo atualizado completo")
    } else if (tipoValue === 1) {
      const chamadoData = {
        titulo: TITULO,
        descricao: DESCRICAO,
      };
      await atualizarChamados(id, chamadoData);
      console.log("tipo atualizado incompleto")
    } else {
      return res.status(400).json({ mensagem: 'Tipo inválido' });
    }

    res.status(200).json({ mensagem: 'Chamado atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar chamado' });
  }
};

const atualizarGrauPrioridadeChamadoController = async (req, res) => {
  try {
    const chamado = req.params.id;
    const { grau_prioridade } = req.body;

    if (!grau_prioridade) {
      return res.status(400).json({ mensagem: "Grau de prioridade é obrigatório" });
    }

    await atualizarChamados(chamado, { grau_prioridade });

    res.status(200).json({ mensagem: "Grau de prioridade do chamado alterado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar Grau de prioridade do chamado:", error);
    res.status(500).json({ mensagem: "Erro ao atualizar Grau de prioridade do chamado" });
  }
};

const listarTodosChamadosAreaController = async (req, res) => {
  if (!req.usuario?.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }
  try {
    const id = req.usuario.id;
    const area = await verTecnicoFuncao(id);
    const areaTec = area[0].id_pool

    const chamados = await semResponsavel(areaTec)
    res.status(200).json(chamados);
  } catch (err) {
    console.error(`Erro ao listar todos os chamados: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};

export {
  criarChamadoController,
  listarChamadosVirgensController,
  atribuirChamadoController,
  listarTodosChamadosController,
  atualizarStatusController,
  obterChamadoUsuarioController,
  atualizarChamadoController,
  atualizarGrauPrioridadeChamadoController,
  listarTodosChamadosAreaController
};
