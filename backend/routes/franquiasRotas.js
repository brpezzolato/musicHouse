import express from 'express';
import {
  listarFranquiasController,
  criarFranquiaController,
  editarFranquiaController,
  listarFranquiaPorIdController,
} from '../controllers/FranquiasController.js';

const router = express.Router();

router.get('/', listarFranquiasController);
router.get('/:id', listarFranquiaPorIdController);
router.post('/', criarFranquiaController);
router.put('/:id', editarFranquiaController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST');
  res.status(204).send();
});

export default router;
