import express from 'express';
import {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
  excluirProdutoController,
  listarProdutosBuscaController,
  maisVendidosController,
  listarProdutosPorCategoriaController,
  obterProdutoPorIdCatalogoController,
  listarProdutosVariacoesController,
  obterProdutoPorSkuController,
  listarProdutosMatrizController,
  criarVariacaoController,
  listarVariacoesPorIdProdutoController,
  obterVariacaoPorIdController,
  atualizarVariacaoController,
  excluirVariacaoController,
} from '../controllers/ProdutoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/fotosProdutos'));
  },
  filename: (req, file, cb) => {
    const nomeArquivo = `${Date.now()}-${file.originalname}`;
    cb(null, nomeArquivo);
  },
});

const upload = multer({ storage: storage });

// Rotas
router.get('/', listarProdutosController);
router.get(
  '/produtovariacao',
  authMiddleware,
  listarProdutosVariacoesController
);
router.get('/busca', listarProdutosBuscaController);
router.get('/matrizprodutos', listarProdutosMatrizController);
router.get(
  '/catalogo/:id',
  authMiddleware,
  obterProdutoPorIdCatalogoController
);
router.get('/categoria', listarProdutosPorCategoriaController);
router.get('/hypados', maisVendidosController);
router.get('/:id', obterProdutoPorIdController);
router.get('/sku/:id', obterProdutoPorSkuController);

router.post('/', upload.array('imagem', 4), criarProdutoController); 
router.post('/variacao', upload.array('imagem', 4), criarVariacaoController);

router.get('/variacao/:id', listarVariacoesPorIdProdutoController);
router.put('/variacao/:id',upload.array('imagem', 4), atualizarVariacaoController);
router.delete('/variacao/:id', excluirVariacaoController);
router.get('/variacao/detalhe/:id', obterVariacaoPorIdController);
router.put('/:id', upload.array('imagem', 4), atualizarProdutoController);
router.delete('/:id', excluirProdutoController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST');
  res.status(204).send();
});

router.options('/:id', (req, res) => {
  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(204).send();
});

export default router;
