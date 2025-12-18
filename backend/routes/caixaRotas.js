import { Router } from 'express';
import {
  abrirCaixaController,
  fecharCaixaController,
} from '../controllers/CaixaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = Router();

router.post('/', authMiddleware, abrirCaixaController);
router.put('/fechar', authMiddleware, fecharCaixaController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'POST');
  res.status(204).send();
});

export default router;
