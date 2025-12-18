import {
  lerFuncionariosPorFranquia,
  obterFuncionarioPorId,
  criarFuncionario,
  lerTodosFuncionarios,
  atualizarFuncionario,
  deletarFuncionario,
  obterCargoPorId,
  desligarFuncionario,
  ligarFuncionario,
} from '../models/Funcionario.js';
import generatePassword from '../utils/generatePassword.js';
import { generateHashedPassword } from '../utils/hashPassword.js';
import { enviarEmailCadastrarFuncionario } from '../utils/nodemailer.js';
import { listarFranquiaPorId, } from '../models/Franquias.js';
import { listarFranquias } from '../models/Franquias.js';


import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listarFuncionariosController = async (req, res) => {
  try {

    const funcionarios = await lerTodosFuncionarios();

    const funcionarioDetalhado = await Promise.all(funcionarios.map(async (funcionario) => {
      const franquia = await listarFranquiaPorId(funcionario.id_franquia);
      const credencial = await obterCargoPorId(funcionario.id_credencial)

      return {
        id_registro: funcionario.id_registro,
        nome_completo: funcionario.nome_completo,
        cpf: funcionario.cpf,
        rg: funcionario.rg,
        data_nascimento: funcionario.data_nascimento,
        sexo: funcionario.sexo,
        estado_civil: funcionario.estado_civil,
        email: funcionario.email,
        telefone: funcionario.telefone,
        fotoFuncionario: funcionario.fotoFuncionario,
        status: funcionario.status,
        data_registro: funcionario.data_registro,
        atualizado_em: funcionario.atualizado_em,
        id_franquia: funcionario.id_franquia,
        franquia: franquia.cidade,
        credencial: credencial.cargo
      };
    }));

    res.status(200).json(funcionarioDetalhado);
  } catch (err) {
    console.error(`Erro ao listar funcionarios: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar funcionarios' });
  }
};


const listarFuncionariosPorFranquiaController = async (req, res) => {
  try {

    const id = req.usuario.id_franquia
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
}; const criarFuncionarioController = async (req, res) => {
  // if (!req.usuario.id) {
  //   return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  // }


  try {
    let {
      nome_completo,
      cpf,
      rg,
      data_nascimento, // Exemplo: "11091989"
      sexo,
      estado_civil,
      email,
      telefone,
      franquia,
      credencial,
    } = req.body;



    if (data_nascimento && data_nascimento.length === 8) {
      const dia = data_nascimento.substring(0, 2); 
      const mes = data_nascimento.substring(2, 4); 
      const ano = data_nascimento.substring(4, 8); 


      data_nascimento = `${ano}-${mes}-${dia}`; 
    }


    let fotoPerfil = null;
    if (req.file) {
      fotoPerfil = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    }

    const senhaFuncionario = await generatePassword();
    const hashSenha = await generateHashedPassword(senhaFuncionario);

    const funcionarioData = {
      nome_completo,
      cpf: Number(cpf),
      rg,
      data_nascimento, 
      sexo,
      estado_civil,
      email,
      senha: hashSenha,
      telefone,
      id_franquia: Number(franquia),
      id_credencial: Number(credencial),
      fotoFuncionario: fotoPerfil,
    };

    const funcionarioId = await criarFuncionario(funcionarioData);
    await enviarEmailCadastrarFuncionario(
      nome_completo,
      senhaFuncionario,
      email,
      funcionarioId
    );

    res.status(201).json({
      mensagem: 'Funcionario Criado com sucesso !!!',
      funcionarioId,
    });
  } catch (error) {
    console.error('Erro ao criar Funcionario:', error);
    res.status(500).json({ mensagem: 'Erro ao criar Funcionario' });
  }
};
const atualizarFuncionarioController = async (req, res) => {
  try {
    const id_funcionario = req.params.id_funcionario;
    const {
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      sexo,
      estado_civil,
      email,
      telefone,
      credencial,
    } = req.body;

    let fotoPerfil = null;


    if (req.file) {
      fotoPerfil = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    } else {
      const funcionarioExistente = await obterFuncionarioPorId(id_funcionario);
      fotoPerfil = funcionarioExistente ? funcionarioExistente.fotoFuncionario : null;
    }

    const funcionarioData = {
      nome_completo,
      cpf: Number(cpf),
      rg,
      data_nascimento,
      sexo,
      estado_civil,
      email,
      telefone,
      id_credencial: Number(credencial),
      fotoFuncionario: fotoPerfil,
    };

    await atualizarFuncionario(id_funcionario, funcionarioData);
    res.status(200).json({
      mensagem: 'Funcionario atualizado com sucesso !!!',
    });
  } catch (error) {
    console.error('Erro ao atualizar Funcionario:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar Funcionario' });
  }
};


const desligarFuncionarioController = async (req, res) => {
  try {
    const id_funcionario = req.params.id_funcionario;

    await desligarFuncionario(id_funcionario);

    res.status(200).json({ menssagem: 'Funcionário desligado' });
  } catch (error) {
    console.error('Erro ao desligar Funcionario:', error);
    res.status(500).json({ mensagem: 'Erro ao desligar Funcionario' });
  }
};

const ligarFuncionarioController = async (req, res) => {
  try {
    const id_funcionario = req.params.id_funcionario;

    const funcionario = await obterFuncionarioPorId(id_funcionario)
    const franquia = await listarFranquiaPorId(funcionario.id_franquia)

    if (franquia.status === 'Inativo') {
      return res.status(400).json({
        mensagem: 'A franquia está inativa. Para proceder com a ativação do funcionário, é necessário reativar a franquia primeiro.'
      });

    }


    await ligarFuncionario(id_funcionario);

    res.status(200).json({ menssagem: 'Funcionário ligado' });
  } catch (error) {
    console.error('Erro ao ligar Funcionario:', error);
    res.status(500).json({ mensagem: 'Erro ao ligar Funcionario' });
  }
};

const obterFuncionarioPorCookieController = async (req, res) => {
  try {
    const id_registro = req.usuario.id_registro;
    let funcionario = await obterFuncionarioPorId(id_registro);
    const franquias = await listarFranquias();
    const franquiasDoCara = await listarFranquiaPorId(funcionario.id_franquia);

    if (!funcionario) {
      return res.status(404).json({ mensagem: 'Funcionario não encontrado' });
    }
    if (funcionario.id_credencial === 1) {
      funcionario = {
        ...funcionario,
        todasFranquias: franquias,
      };
    } else {
      funcionario = {
        ...funcionario,
        filialEndereco: franquiasDoCara.cidade,
      };
    }
    res.status(200).json(funcionario);
  } catch (err) {
    console.error(`Erro ao obter funcionario por cookie: `, err);
    res.status(500).json({ mensagem: 'Erro ao obter funcionario por cookie' });
  }
};

const deletarFuncionarioController = async (req, res) => {
  try {
    const id_funcionario = req.params.id;
    const funcionario = obterFuncionarioPorId(id_funcionario);

    if (!funcionario) {
      return res.status(404).json({ mensagem: 'Funcionario não encontrado' });
    }

    await deletarFuncionario(id_funcionario);
    res.status(200).json({ mensagem: 'Funcionario deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar funcionario:', error);
    res.status(500).json({ mensagem: 'Erro ao deletar funcionario' });
  }
};

const pegarLocalizacaoCargo = async (req, res) => {
  try {
    const id_franquia = req.usuario.id_franquia;
    const id_credencial = req.usuario.id_credencial;

    const franquia = await listarFranquiaPorId(id_franquia);
    const cargo = await obterCargoPorId(id_credencial);

    const dados = {
      localizacao: franquia.cidade,
      cargo: cargo.cargo,
    };

    res.status(200).json(dados);
  } catch (error) {
    console.error(
      'Erro ao resgatar cargo e localizacao do funcionario:',
      error
    );
    res
      .status(500)
      .json({
        mensagem: 'Erro ao resgatar cargo e localizacao do funcionario',
      });
  }
};

export {
  listarFuncionariosController,
  listarFuncionariosPorFranquiaController,
  obterFuncionarioPorIdController,
  criarFuncionarioController,
  obterFuncionarioPorCookieController,
  deletarFuncionarioController,
  pegarLocalizacaoCargo,
  atualizarFuncionarioController,
  desligarFuncionarioController,
  ligarFuncionarioController,
};
