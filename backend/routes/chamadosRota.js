import express from 'express';
import {
  criarChamadoController,
  listarChamadosVirgensController,
  atribuirChamadoController,
  listarTodosChamadosController,
  atualizarStatusController,
  obterChamadoUsuarioController,
  atualizarChamadoController,
  atualizarGrauPrioridadeChamadoController,
  listarTodosChamadosAreaController
} from '../controllers/ChamadoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', listarChamadosVirgensController);

router.get('/area', authMiddleware, listarTodosChamadosAreaController);

router.get('/todos', listarTodosChamadosController);

router.get('/recente', authMiddleware, obterChamadoUsuarioController);

router.put('/status/:id', authMiddleware, atualizarStatusController);

router.post('/', authMiddleware, criarChamadoController);

router.put('/:id', authMiddleware, atribuirChamadoController);

router.put('/uptade/:id', authMiddleware, atualizarChamadoController);

router.put('/grauPrioridade/:id', authMiddleware, atualizarGrauPrioridadeChamadoController)

router.options('/', (req, res) => {
  res.setHeader('Allow', 'POST');
  res.status(204).send();
});

router.options('/:id', (req, res) => {
  res.setHeader('Allow', 'PUT');
  res.status(204).send();
});

export default router;
