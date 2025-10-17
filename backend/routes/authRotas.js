import express from 'express';
import passport from '../config/ldap.js';
import { loginSucessoController } from "../controllers/AuthController.js"
const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('ldapauth', { session: true }, (err, user, info) => {
    try {
      if (err) {
        return res.status(500).json({ error: 'Erro interno no servidor' });
      }

      if (!user) {
        return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
      }

      req.logIn(user, async (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: 'Erro ao criar sessão' });
        }

        await loginSucessoController(req, res); 
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
  })(req, res, next);
});


export default router