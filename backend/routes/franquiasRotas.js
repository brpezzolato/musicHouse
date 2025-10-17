import express from 'express';
import {
  criarFranquiaController,
  editarFranquiaController,
} from '../controllers/FranquiasController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// router.get('/', listarFuncionariosController);
// router.get('/:id', obterFuncionarioPorIdController);
router.post('/', criarFranquiaController);
router.put('/:id', editarFranquiaController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST');
  res.status(204).send();
});

export default router;
