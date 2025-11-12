import {
  lerFuncionarios,
  lerFuncionariosPorFranquia,
  obterFuncionarioPorId,
  criarFuncionario,
} from '../models/Funcionario.js';
import { fileURLToPath } from 'url';
import path from 'path'
import generatePassword from '../utils/generatePassword.js'
import {generateHashedPassword} from '../utils/hashPassword.js'
import { enviarEmailCadastrarFuncionario } from '../utils/nodemailer.js';


const listarFuncionariosController = async (req, res) => {
  // if (!req.usuario.id) {
  //   return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  // }

  try {
    const { franquia } = req.query;

    const funcionarios = await lerFuncionarios(franquia);
    res.status(200).json(funcionarios);
  } catch (err) {
    console.error(`Erro ao listar funcionarios: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar funcionarios' });
  }
};

const listarFuncionariosPorFranquiaController = async (req, res) => {
  try {
    const { id } = req.params;

    const { franquiaExiste, funcionarios } = await lerFuncionariosPorFranquia(
      id
    );

    if (!franquiaExiste) {
      return res.status(404).json({
        mensagem: `A franquia com ID ${id} não existe.`,
      });
    }

    if (!funcionarios || funcionarios.length === 0) {
      return res.status(404).json({
        mensagem: 'Nenhum funcionário encontrado para esta franquia.',
      });
    }

    return res.status(200).json(funcionarios);
  } catch (err) {
    console.error(`Erro ao listar funcionários da franquia:`, err);
    return res
      .status(500)
      .json({ mensagem: 'Erro ao listar funcionários da franquia' });
  }
};

const obterFuncionarioPorIdController = async (req, res) => {
  // if (!req.usuario.id) {
  //   return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  // }

  try {
    const id_registro = req.params.id;

    const funcionario = await obterFuncionarioPorId(id_registro);
    res.status(200).json(funcionario);
  } catch (err) {
    console.error(`Erro ao obter funcionario: `, err);
    res.status(500).json({ mensagem: 'Erro ao obter funcionario' });
  }
};

const criarFuncionarioController = async (req, res) => {
  // if (!req.usuario.id) {
  //   return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  // }

  try {
    const {
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      sexo,
      estado_civil,
      email,
      telefone,
      id_credencial,
    } = req.body;

    let fotoPerfil = null;
    if (req.file) {
      fotoPerfil = req.file.path.replace(__dirname.replace('\\controllers', ''), '');
    }
    const senhaFuncionario = await generatePassword()
    

    const hashSenha = await generateHashedPassword(senhaFuncionario)


    const id_franquia = req.query.franquia || 1;

    const funcionarioData = {
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      sexo,
      estado_civil,
      email,
      senha: hashSenha,
      telefone,
      id_franquia,
      id_credencial,
      fotoFuncionario: fotoPerfil
    };

    const funcionarioId = await criarFuncionario(funcionarioData);
    await enviarEmailCadastrarFuncionario(nome_completo, senhaFuncionario, email, funcionarioId)

    res.status(201).json({
      mensagem: 'Funcionario Criado com sucesso !!!',
      funcionarioId,
    });
  } catch (error) {
    console.error('Erro ao criar Funcionario:', error);
    res.status(500).json({ mensagem: 'Erro ao criar Funcionario' });
  }
};
export {
  listarFuncionariosController,
  listarFuncionariosPorFranquiaController,
  obterFuncionarioPorIdController,
  criarFuncionarioController,
};
