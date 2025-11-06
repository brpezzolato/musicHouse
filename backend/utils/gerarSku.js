import { readAll } from '../config/database.js';

async function VerBanco(gerado) {
  const produtos = await readAll('produtos');
  const variacoes = await readAll('variacoes_produto');

  const todos = produtos.concat(variacoes);
  const todosSkus = todos.map((p) => p.sku);

  if (todosSkus.includes(gerado)) {
    return await generateSku();
  } else {
    return gerado;
  }
}

async function generateSku() {
  const codigo = Math.floor(Math.random() * 1000000);
  return await VerBanco(codigo.toString().padStart(6, '0'));
}

export default await generateSku();
