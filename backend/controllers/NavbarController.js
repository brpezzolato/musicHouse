import { listarCategoriasComProdutos } from '../models/Navbar.js';

const listarCategoriasComProdutosController = async (req, res) => {
  try {
    const categorias = await listarCategoriasComProdutos();
    res.status(200).json(categorias);
  } catch (err) {
    console.error('Erro ao listar categorias com produtos:', err);
    res.status(500).json({ mensagem: 'Erro ao listar categorias com produtos' });
  }
};

export { listarCategoriasComProdutosController };