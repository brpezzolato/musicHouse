import express from 'express';
import { criarVendaController } from '../controllers/VendaController.js';
const router = express.Router();

router.post('/', criarVendaController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST');
  res.status(204).send();
});

export default router;
