import { readAll } from '../config/database.js';

const listarCategoriasComProdutos = async () => {
  try {
    const categorias = await readAll('categorias');

    const categoriasComProdutos = [];
    for (const cat of categorias) {
      const produtos = await readAll('produtos', `id_categoria = ${cat.id}`);
      categoriasComProdutos.push({
        ...cat,
        produtos,
      });
    }

    return categoriasComProdutos;
  } catch (err) {
    console.error('Erro ao listar categorias com produtos:', err);
    throw err;
  }
};

export { listarCategoriasComProdutos };
