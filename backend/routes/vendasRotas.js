import express from 'express';
import { criarVendaController, listarVendasController, listarVendasGeralController } from '../controllers/VendaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, criarVendaController);

router.get('/',authMiddleware, listarVendasController);


router.get('/geral', listarVendasGeralController);




router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST');
  res.status(204).send();
});

export default router;
