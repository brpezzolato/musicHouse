import {
  franquiasAtivasController,
  faturamentoGlobalController,
  listarFuncionariosGlobalController,
  listarContasPagarController,
  rankFiliaisController,
  listarPedidosEstoqueController,
  listarEstoqueMatrizController,
  listarFiliaisAtivasController,
  listarVendasMetodosController,
  rankProdutosController,
  faturamentoConsolidadoMatrizController,
  fluxoCaixaMatrizController,
  crescimentoMatrizController,
} from "../controllers/DashboardMatrizController.js";
import express from "express";
const router = express.Router();

router.get("/franquiasAtivas", franquiasAtivasController);
router.get("/faturamentoGlobal", faturamentoGlobalController);
router.get("/funcionariosGlobal", listarFuncionariosGlobalController);
router.get("/despesasGlobal", listarContasPagarController);
router.get("/rankGlobal", rankFiliaisController);
router.get("/pedidosEstoqueGlobal", listarPedidosEstoqueController);
router.get("/estoqueMatriz", listarEstoqueMatrizController);
router.get("/filiaisAtivas", listarFiliaisAtivasController);
router.get("/metodosGlobal", listarVendasMetodosController);
router.get("/rankProdutosGlobal", rankProdutosController);
router.get("/faturamento-consolidado", faturamentoConsolidadoMatrizController);
router.get("/fluxo-caixa", fluxoCaixaMatrizController);
router.get("/crescimento", crescimentoMatrizController);
export default router;
