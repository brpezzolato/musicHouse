import { Router } from "express";
import {
  listarEstoquesController,
  obterEstoquePorIdController,
  criarEstoqueController,
  excluirEstoqueController, 
  listarEstoquesFranquiaController,
  criarMovimentacaoEstoqueController,
  criarPedidoMatrizController, 
  listarPedidosMatrizController,
  atualizarPedidoRecusadoController,
  atualizarEstoqueMatrizController,
  listarPedidosFilialController,
  listarMovimentacoesEstoqueController
  
} from "../controllers/EstoqueController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();


router.get("/", listarEstoquesController);

router.get("/franquia", authMiddleware,  listarEstoquesFranquiaController);
router.get("/franquia/:id", obterEstoquePorIdController);
router.post("/", criarEstoqueController);
router.post("/pedidoAceito/:id_estoque/:id_pedido",authMiddleware,criarMovimentacaoEstoqueController);
router.put("/pedidoRecusado/:id_pedido", atualizarPedidoRecusadoController);
router.post("/pedidosMatriz/:id_estoque", authMiddleware, criarPedidoMatrizController);

router.post("/atualizarEstoqueMatriz/:id_estoque", authMiddleware, atualizarEstoqueMatrizController);
router.get("/pedidosMatriz", listarPedidosMatrizController);
router.get("/pedidosFilial",authMiddleware, listarPedidosFilialController);
router.get("/movimentacoeEstoque", listarMovimentacoesEstoqueController);


router.delete("/:id", excluirEstoqueController);


router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST');
  res.status(204).send();
});


router.options('/:id', (req, res) => {
  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(204).send();
});
export default router;
