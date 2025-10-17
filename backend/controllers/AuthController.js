import { obterUsuario, criarUsuario } from "../models/Usuarios.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import generateHashedPassword from "../hashPassword.js"

const loginSucessoController = async (req, res) => {
  try {
    const email = req.user.userPrincipalName;
    const nome = req.user.displayName;
    const numeroRegistro = req.user.sAMAccountName;
    const password = req.body.password
    const descricao = req.user.description

    let usuario = await obterUsuario(numeroRegistro);
    const senha = await generateHashedPassword(password);

    if (!usuario || usuario.length === 0) {
      console.log(`Usuário não encontrado no banco. Criando: ${nome}`);

      const usuarioData = {
        email,
        nome,
        numeroRegistro,
        senha,
        descricao
      };

      await criarUsuario(usuarioData);

      usuario = await obterUsuario(numeroRegistro);
    }



  const token =  jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        numeroRegistro: usuario.numeroRegistro,
        funcao: usuario.funcao
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );


    return res.json({
      message: "Autenticado com sucesso",
      token,
      user: {
        id: usuario.id,
        numeroRegistro: usuario.numeroRegistro,
        nome: usuario.nome,
        email: usuario.email,
        curso: usuario.descricao,
        funcao: usuario.funcao
      }
    });
  } catch (error) {
    console.error("Erro ao criar/verificar usuário no banco:", error);
    return res.status(500).json({ error: "Erro interno ao salvar usuário" });
  }
};
export { loginSucessoController }

