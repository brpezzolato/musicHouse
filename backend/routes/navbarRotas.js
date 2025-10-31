import express from 'express';
import { listarCategoriasComProdutosController } from '../controllers/NavbarController.js';

const router = express.Router();

// Endpoint único que retorna categorias com produtos
router.get('/', listarCategoriasComProdutosController);

export default router;