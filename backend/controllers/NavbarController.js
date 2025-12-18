import { listarCategoria } from '../models/CategoriasProdutos.js';
import { listarProdutos } from '../models/Produtos.js';

const listarCategoriasComProdutosController = async (req, res) => {
  try {
    const categorias = await listarCategoria();
    const produtos = await listarProdutos();

    const navMain = categorias.map((cat) => {
      const produtosDaCategoria = produtos.filter(
        (prod) => prod.id_categoria === cat.id_categoria
      );

      return {
        title: cat.nome,
        id_categoria: cat.id_categoria,
        url: `catalogo/categoria/${cat.id_categoria}`,
        icon: cat.iconeSite,
        items: produtosDaCategoria.map((prod) => ({
          title: prod.nome,
          url: `/catalogo/produto/${prod.id_produto}`,
        })),
      };
    });

    res.status(200).json(navMain);
  } catch (err) {
    console.error('Erro ao listar categorias com produtos:', err);
    res
      .status(500)
      .json({ mensagem: 'Erro ao listar categorias com produtos' });
  }
};

export { listarCategoriasComProdutosController };
