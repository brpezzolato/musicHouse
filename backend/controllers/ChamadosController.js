import { listarChamados, criarChamados, listarMeusChamados, atualizarStatus, obterChamadosPorId } from '../models/Chamados.js';
import { listarFranquiaPorId } from '../models/Franquias.js'
import { statusEmailChamado } from '../utils/nodemailer.js'

const criarChamadosController = async (req, res) => {
    try {
        const {
            id_franquia,
            id_funcionario,
            email,
            nome_func,
            titulo,
            descricao,
            categoria,
            prioridade
        } = req.body;


        const chamadoData = {
            id_franquia,
            id_funcionario,
            nome_func,
            email,
            titulo,
            descricao,
            categoria,
            prioridade
        }

        const chamadoId = await criarChamados(chamadoData);

        return res.status(201).json({ mensagem: `Chamado de número #${chamadoId} criado com sucesso!` });

    } catch (err) {
        console.error("Erro ao criar chamado:", err);
        return res.status(500).json({ erro: "Erro interno no servidor." });
    }
};

const listarChamadosController = async (req, res) => {
    try {
        const meusChamadosBd = await listarChamados();

        const ordemPrioridade = {
            "Crítica": 4,
            "Alta": 3,
            "Média": 2,
            "Baixa": 1
        };

        const statusFinal = ["Resolvido", "Cancelado"];

        const meusChamados = meusChamadosBd.sort((a, b) => {
            const aIsFinal = statusFinal.includes(a.status);
            const bIsFinal = statusFinal.includes(b.status);

            if (aIsFinal && !bIsFinal) return 1;
            if (!aIsFinal && bIsFinal) return -1;

            return ordemPrioridade[b.prioridade] - ordemPrioridade[a.prioridade];
        });

        return res.status(201).json(meusChamados);

    } catch (err) {
        console.error("Erro ao listar meus chamados:", err);
        return res.status(500).json({ erro: "Erro interno no servidor." });
    }
};

const listarMeusChamadosController = async (req, res) => {
    try {
        const { id_registro } = req.usuario;
        const meusChamadosBd = await listarMeusChamados(id_registro);
        const meusChamados = meusChamadosBd.sort((a, b) => b.id_chamado - a.id_chamado);
        return res.status(201).json(meusChamados);
    } catch (err) {
        console.error("Erro ao listar meus chamados:", err);
        return res.status(500).json({ erro: "Erro interno no servidor." });
    }
};

const atualizarStatusController = async (req, res) => {
    try {
        const { status } = req.query;
        const { id } = req.params;
        const chamadoData = req.body;
        const mensagemFinal = req.body.apontamento_final || ''

        await atualizarStatus(id, { status: status, apontamento_final: mensagemFinal });
        const dataDeHoje = new Date().toLocaleString('pt-BR', { hour12: false });
        await statusEmailChamado(chamadoData.nome_func, chamadoData.id_chamado, chamadoData.titulo, dataDeHoje, chamadoData.email, status, mensagemFinal)

        return res.status(201).json({ mensagem: 'Status atualizado com succeso' });
    } catch (err) {
        console.error("Erro ao atualizar status do chamado:", err);
        return res.status(500).json({ erro: "Erro interno no servidor." });
    }
};

const obterChamadosPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const chamado = await obterChamadosPorId(id);
        const franquia = await listarFranquiaPorId(chamado.id_franquia)

        const chamadoOfc = {
            ...chamado,
            filialEndereco: franquia.cidade
        }

        return res.status(201).json(chamadoOfc);
    } catch (err) {
        console.error("Erro ao obter chamado Por Id:", err);
        return res.status(500).json({ erro: "Erro interno no servidor." });
    }
};

export { criarChamadosController, listarChamadosController, listarMeusChamadosController, atualizarStatusController, obterChamadosPorIdController };