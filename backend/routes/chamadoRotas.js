import { Router } from 'express';
import {
    criarChamadosController,
    listarMeusChamadosController,
    listarChamadosController,
    atualizarStatusController,
    obterChamadosPorIdController
} from '../controllers/ChamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = Router();

router.post('/', criarChamadosController);
router.get('/', listarChamadosController);
router.get('/meus', authMiddleware, listarMeusChamadosController);
router.get('/:id', authMiddleware, obterChamadosPorIdController);
router.put('/:id', authMiddleware, atualizarStatusController);


router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST');
    res.status(204).send();
});

export default router;
