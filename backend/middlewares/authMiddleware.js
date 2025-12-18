import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

const authMiddleware = (req, res, next) => {

  const authHeader = req.cookies['token'];


  if (!authHeader) {
    console.log('Token não fornecido');
    return res
      .status(401)
      .json({ mensagem: 'Não autorizado: Token não fornecido' });
  }

  try {

    const decoded = jwt.verify(authHeader, JWT_SECRET);

   
    req.usuario = {
      id_registro: decoded.id_registro,
      id_franquia: decoded.id_franquia,
      id_credencial: decoded.id_credencial,
    };

    next();
  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      console.log('Token expirado');
      return res.status(440).json({
        mensagem: 'Sessão expirada: faça login novamente',
      });
    }


    console.log('Token inválido');
    return res.status(403).json({ mensagem: 'Não autorizado: Token inválido' });
  }
};

export default authMiddleware;
