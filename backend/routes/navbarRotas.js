import express from 'express';
import { listarCategoriasComProdutosController } from '../controllers/NavbarController.js';

const router = express.Router();

router.get('/', listarCategoriasComProdutosController);

export default router;