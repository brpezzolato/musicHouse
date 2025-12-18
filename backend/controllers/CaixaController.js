import { abrirCaixa, lerCadaSessao, fecharCaixa } from '../models/Caixa.js';

const abrirCaixaController = async (req, res) => {
  try {
    const { id_franquia, id_registro } = req.usuario;
    const jaTemSessaoAberta = await lerCadaSessao(id_registro);

    if (jaTemSessaoAberta) {
      await fecharCaixa(jaTemSessaoAberta.id_sessao_caixa, {
        status: 'fechado',
        data_fechamento: new Date(),
      });

      console.log(
        `Sessão anterior ID: ${jaTemSessaoAberta.id_sessao_caixa} foi fechada automaticamente.`
      );
    }

    const sessaoData = {
      id_franquia: id_franquia,
      id_funcionario: id_registro,
      status: 'aberto',
    };
    const sessaoId = await abrirCaixa(sessaoData);
    res
      .status(201)
      .json({ menssagem: 'Sessão de caixa criado com sucesso', sessaoId });
  } catch (error) {
    console.error('Erro ao criar sessao de caixa:', error);
    res.status(500).json({ menssagem: 'Erro ao criar sessão de caixa' });
  }
};

const fecharCaixaController = async (req, res) => {
  try {
    const { id_registro } = req.usuario;
    const sessaoAberta = await lerCadaSessao(id_registro);

    await fecharCaixa(sessaoAberta.id_sessao_caixa, {
      status: 'fechado',
      data_fechamento: new Date(),
    });

    res.status(200).json({ menssagem: 'Caixa fechado com sucesso' });
  } catch (error) {
    console.error('Erro ao fechar caixa:', error);
    res.status(500).json({ menssagem: 'Erro ao fechar caixa' });
  }
};

export { abrirCaixaController, fecharCaixaController };
