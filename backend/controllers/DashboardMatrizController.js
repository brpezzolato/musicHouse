import {
  franquiasAtivas,
  faturamentoGlobal,
  listarTodosFuncionariosGlobal,
  listarContasPagar,
  listarLucroPorFilial,
  listarPedidosEstoque,
  listarEstoqueMatriz,
  listarFiliaisAtivas,
  listarVendas,
  listarItemVendasPorSku,
  descobrirTipoSku,
  faturamentoConsolidadoMatriz,
  fluxoCaixaMatriz,
  crescimentoMatriz,
} from "../models/DashboardMatriz.js";
import { listarFranquias } from "../models/Franquias.js";
import { listarSkus } from "../models/Produtos.js";

const franquiasAtivasController = async (req, res) => {
  try {
    const franquias = await franquiasAtivas();
    res.json({ franquiasAtivas: franquias.length });
  } catch (err) {
    console.error("erro ao listar franquias ativas", err);
    res.status(500).json({ menssagem: "Erro ao lista franquias ativas" });
  }
};

const faturamentoGlobalController = async (req, res) => {
  try {
    const faturamento = await faturamentoGlobal();
    res.status(200).json(faturamento);
  } catch (err) {
    console.error("erro ao somar faturamento global", err);
    res.status(500).json({ menssagem: "erro ao somar faturamento global" });
  }
};

const listarFuncionariosGlobalController = async (req, res) => {
  try {
    const funcionarios = await listarTodosFuncionariosGlobal();
    res.status(200).json({ FuncionariosGlobal: funcionarios.length });
  } catch (err) {
    console.error("Erro ao listar todos os funcionários", err);
    res.status(500).json({ menssagem: "Erro ao listar funcionários" });
  }
};

const listarContasPagarController = async (req, res) => {
  try {
    const despesas = await listarContasPagar();
    res.status(200).json(despesas.length);
  } catch (err) {
    console.error("Erro ao listar contas a pagar:", err);
    res.status(500).json({ mensagem: "Erro ao listar contas a pagar" });
  }
};

const rankFiliaisController = async (req, res) => {
  try {
    const franquias = await listarFranquias();
    franquias.shift();
    const franquiasSemMatriz = franquias;
    let lista = [];
    let faturamento = 0;

    for (const cada of franquiasSemMatriz) {
      const vendas = await listarLucroPorFilial(cada.id_franquia);

      for (const venda of vendas) {
        faturamento += Number(venda.valor_total);
      }
      const cidade = cada.cidade.split(" - ")[0];
      lista.push({ filial: cidade, valor: faturamento });
      faturamento = 0;
    }

    lista.sort((a, b) => b.valor - a.valor);
    const top5 = lista.slice(0, 5);

    res.status(200).json(top5);
  } catch (err) {
    console.error("Erro ao listar contas a pagar:", err);
    res.status(500).json({ mensagem: "Erro ao listar contas a pagar" });
  }
};

const listarPedidosEstoqueController = async (req, res) => {
  try {
    const pedidos = await listarPedidosEstoque();
    res.status(200).json(pedidos.length);
  } catch (err) {
    console.error("Erro ao listar pedidos de estoque:", err);
    res
      .status(500)
      .json({ mensagem: "Erro ao listar quantidade de pedidos de estoque" });
  }
};

const listarEstoqueMatrizController = async (req, res) => {
  try {
    const estoque = await listarEstoqueMatriz();
    let total = 0;

    for (const cada of estoque) {
      total += cada.quantidade;
    }

    res.status(200).json(total);
  } catch (err) {
    console.error("Erro ao colocar estoque geral:", err);
    res.status(500).json({ mensagem: "Erro ao colocar estoque geral" });
  }
};

const listarFiliaisAtivasController = async (req, res) => {
  try {
    const filiais = await listarFiliaisAtivas();
    res.status(200).json(filiais.length);
  } catch (err) {
    console.error("Erro ao filiais ativas:", err);
    res.status(500).json({ mensagem: "Erro ao filiais ativas" });
  }
};

const listarVendasMetodosController = async (req, res) => {
  try {
    const vendas = await listarVendas();

    const debito = vendas.filter((e) => e.id_pagamento == "1");
    const credito = vendas.filter((e) => e.id_pagamento == "2");
    const pix = vendas.filter((e) => e.id_pagamento == "3");

    const data = [
      { tipo: "Débito", valor: debito.length },
      { tipo: "Crédito", valor: credito.length },
      { tipo: "Pix", valor: pix.length },
    ];

    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao filiais ativas:", err);
    res.status(500).json({ mensagem: "Erro ao filiais ativas" });
  }
};

const rankProdutosController = async (req, res) => {
  try {
    const skus = await listarSkus();
    let lista = [];

    for (const cada of skus) {
      const tipo = await descobrirTipoSku(cada);

      if (tipo === "404" || tipo === "erro") {
        continue;
      }

      const item_venda = await listarItemVendasPorSku({
        skuProd: tipo === "produto" ? cada : null,
        skuVariacao: tipo === "variacao" ? cada : null,
      });

      let quantidade = 0;
      for (const item of item_venda) {
        quantidade += Number(item.quantidade);
      }

      lista.push({
        produto: cada,
        vendas: quantidade,
      });
    }

    lista.sort((a, b) => b.vendas - a.vendas);
    const top5 = lista.slice(0, 5);

    res.status(200).json(top5);
  } catch (err) {
    console.error("Erro ao gerar ranking de produtos:", err);
    res.status(500).json({ mensagem: "Erro ao gerar ranking de produtos" });
  }
};

const faturamentoConsolidadoMatrizController = async (req, res) => {
  try {
    const data = await faturamentoConsolidadoMatriz();
    res.json(data);
  } catch {
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar faturamento consolidado" });
  }
};

const fluxoCaixaMatrizController = async (req, res) => {
  try {
    const data = await fluxoCaixaMatriz();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar fluxo de caixa" });
  }
};

const crescimentoMatrizController = async (req, res) => {
  try {
    const data = await crescimentoMatriz();
    res.json(data);
  } catch {
    res.status(500).json({ mensagem: "Erro ao buscar crescimento" });
  }
};

export {
  franquiasAtivasController,
  faturamentoGlobalController,
  listarFuncionariosGlobalController,
  listarContasPagarController,
  rankFiliaisController,
  listarPedidosEstoqueController,
  listarEstoqueMatrizController,
  listarFiliaisAtivasController,
  listarVendasMetodosController,
  rankProdutosController,
  faturamentoConsolidadoMatrizController,
  fluxoCaixaMatrizController,
  crescimentoMatrizController,
};
