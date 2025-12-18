import { create, readAll, read, update, deleteRecord } from '../config/database.js';

const listarChamados = async () => {
    try {
        return await readAll("chamados");
    } catch (err) {
        console.error("Erro ao listar chamados: ", err);
        throw err;
    }
};

const obterChamadosPorId = async (id_chamado) => {
    try {
        return await read("chamados", `id_chamado = ${id_chamado}`);
    } catch (err) {
        console.error("Erro ao obter chamado Por Id: ", err);
        throw err;
    }
};

const listarMeusChamados = async (id_funcionario) => {
    try {
        return await readAll("chamados", `id_funcionario = ${id_funcionario}`);
    } catch (err) {
        console.error("Erro ao listar chamados: ", err);
        throw err;
    }
};

const criarChamados = async (chamadoData) => {
    try {
        return await create("chamados", chamadoData);
    } catch (err) {
        console.error("Erro ao listar chamados: ", err);
        throw err;
    }
};

const atualizarStatus = async (id, chamadoData) => {
    try {
        return await update("chamados", chamadoData, `id_chamado = ${id}`);
    } catch (err) {
        console.error("Erro ao atualizar status do chamado: ", err);
        throw err;
    }
};

export { listarChamados, criarChamados, listarMeusChamados, atualizarStatus, obterChamadosPorId }