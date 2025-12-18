import express from 'express';
import { listarDespesasFranquiaController, excluirDespesaController,  criarDespesaController, atualizarDespesaController,atualizarDespesaParaPagaController, totalDespesasFranquiaController, despesasAtrasadasController, listarDespesasFuturasController, totalDespesasAPagarController,totalLucroMesController, totalLucroMesControllerGeral} from '../controllers/DespesaController.js';
import authMiddleware from '../middlewares/authMiddleware.js'
const router = express.Router();


router.get('/franquia', authMiddleware, listarDespesasFranquiaController)
router.get('/franquia/total', authMiddleware, totalDespesasFranquiaController)
router.get('/franquia/atrasadas', authMiddleware,  despesasAtrasadasController)
router.get('/franquia/futuras', authMiddleware, listarDespesasFuturasController)
router.get('/franquia/DespesasAPagar', authMiddleware, totalDespesasAPagarController)
router.get('/franquia/totalLucroMes', authMiddleware,  totalLucroMesController)
router.get('/matriz/totalLucroMes',  totalLucroMesControllerGeral)


router.post('/franquia/', authMiddleware, criarDespesaController )
router.put('/franquia/:id_despesa', authMiddleware, atualizarDespesaController)
router.put('/franquia/paga/:id_despesa',authMiddleware, atualizarDespesaParaPagaController)


router.delete('/franquia/:id_despesa',authMiddleware, excluirDespesaController)

export default router;