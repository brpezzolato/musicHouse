import {
  lerFuncionarios,
  lerFuncionariosPorFranquia,
  obterFuncionarioPorId,
  criarFuncionario,
} from '../models/Funcionario.js';
import generatePassword from '../utils/generatePassword.js';
import generateHashedPassword from '../utils/hashPassword.js';

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
      id_franquia,
      id_credencial,
      fotoFuncionario,
    } = req.body;

    const senhaGerada = await generatePassword();
    const senhaHash = await generateHashedPassword(senhaGerada);

    const funcionarioData = {
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      sexo,
      estado_civil,
      email,
      telefone,
      id_franquia,
      id_credencial,
      fotoFuncionario,
      senha: senhaHash,
    };

    console.log('Dados do novo Funcionario:', senhaHash);

    const funcionarioId = await criarFuncionario(funcionarioData);
    res.status(201).json({
      mensagem: `Funcionario de registro ${funcionarioId} Criado com sucesso !!! | Guarde a senha do funcionario: ${senhaGerada}`,
      funcionarioData,
    });
  } catch (error) {
    console.error('Erro ao criar Funcionario:', error);
    if (error.errno === 1062) {
      return res.status(400).json({ mensagem: 'CPF ou Email já cadastrado' });
    }
    res.status(500).json({ mensagem: 'Erro ao criar Funcionario' });
  }
};

export {
  listarFuncionariosController,
  listarFuncionariosPorFranquiaController,
  obterFuncionarioPorIdController,
  criarFuncionarioController,
};
