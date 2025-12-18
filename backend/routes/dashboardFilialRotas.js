import { formasPagamentoController, faturamentoMensalController,faturamentoConsolidadoFilialController,  faturamentoUltimos7DiasController, listarMovimentacoesEstoqueController, produtosMaisVendidosDaSemanaController, vendasDoDiaController, caixasAbertosController, funcionariosFranquiaController, estoqueProdutosController } from '../controllers/DashboardFilialController.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

//Gráficos
router.get('/pagamentoUtilizados', authMiddleware, formasPagamentoController)
router.get('/faturamentoMensal', authMiddleware, faturamentoMensalController)

//Cards
router.get('/vendasDiarias', authMiddleware, vendasDoDiaController)
router.get('/caixasAbertos', authMiddleware, caixasAbertosController)
router.get('/funcionariosAtivos', authMiddleware, funcionariosFranquiaController)
router.get('/produtosEstoque', authMiddleware, estoqueProdutosController)


router.get('/faturamento/ultimos-7-dias', authMiddleware, faturamentoUltimos7DiasController);
router.get('/produtosMaisVendidos/ultimos-7-dias', authMiddleware, produtosMaisVendidosDaSemanaController);

router.get('/movimentacoesEstoque', authMiddleware, listarMovimentacoesEstoqueController);
router.get(
    "/faturamento-consolidado",
    authMiddleware,
    faturamentoConsolidadoFilialController
);




export default router;