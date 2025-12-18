import express from 'express';
import {
  listarFuncionariosController,
  listarFuncionariosPorFranquiaController,
  obterFuncionarioPorIdController,
  criarFuncionarioController,
  obterFuncionarioPorCookieController,
  deletarFuncionarioController,
  pegarLocalizacaoCargo,
  atualizarFuncionarioController,
  desligarFuncionarioController,
  ligarFuncionarioController
} from '../controllers/FuncionariosController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/fotosFuncionarios'));
  },
  filename: (req, file, cb) => {
    const nomeArquivo = `${Date.now()}-${file.originalname}`;
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', listarFuncionariosController);
router.get('/cargo', authMiddleware, pegarLocalizacaoCargo);
router.get('/detalhes', authMiddleware, obterFuncionarioPorCookieController);
router.get('/franquias',authMiddleware, listarFuncionariosPorFranquiaController);
router.get('/:id', obterFuncionarioPorIdController);
router.post('/', upload.single("fotoFuncionario"), criarFuncionarioController);
router.put('/:id_funcionario', upload.single("fotoFuncionario"), atualizarFuncionarioController);
router.put('/desligar/:id_funcionario', desligarFuncionarioController);
router.put('/ligar/:id_funcionario', ligarFuncionarioController);
router.delete('/:id', deletarFuncionarioController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST');
  res.status(204).send();
});

export default router;
