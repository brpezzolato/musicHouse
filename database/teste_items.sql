-- ================================
--  DADOS BÁSICOS PARA TESTE
-- ================================
USE musicHouse;
-- Franquia (já existe 1, mas vamos garantir)
INSERT INTO franquias (codigo_postal, endereco_completo, cidade, email_contato, telefone_contato, status)
VALUES ('04567-123', 'Av. Paulista, 1000 - Bela Vista', 'São Paulo', 'contato@vidaplena-sp.com', '(11) 99999-8888', 'Ativo');

-- Formas de pagamento
INSERT INTO formasPagamentos (tipo) VALUES ('pix'), ('debito'), ('credito');

-- Funcionário (associado à franquia 1 e credencial 3 = Caixa)
INSERT INTO funcionarios (
    nome_completo, cpf, rg, data_nascimento, sexo, estado_civil,
    email, telefone, id_franquia, id_credencial, fotoFuncionario, senha, status
) VALUES (
    'João da Silva', '12345678901', '1234567', '1990-01-01', 'Masculino', 'Solteiro',
    'joao@teste.com', '(11) 90000-0000', 1, 3, '/imagens/joao.png', '123456', 'Ativo'
);

-- Caixa (sessão de caixa aberta)
INSERT INTO caixas (id_franquia, id_funcionario, status)
VALUES (1, 1, 'aberto');

-- Produto
INSERT INTO produtos (
    nome, descricao, materiais, detalhes, cor, desconto, id_categoria, valor, custo_producao, imagem
) VALUES (
    'Violão Acústico Yamaha', 'Violão clássico de 6 cordas de nylon', 'Madeira nobre e cordas de nylon',
    'Ideal para iniciantes e profissionais', 'Marrom', NULL, 1, 850.00, 500.00, '/imagens/violaoyamaha.png'
);

-- Estoque (necessário para vendas)
INSERT INTO estoque (id_franquia, id_produto, quantidade, minimo)
VALUES (1, 1, 10, 2);

-- Cliente
INSERT INTO clientes (nome_completo, cpf, email, telefone, data_nascimento)
VALUES ('Maria Oliveira', '98765432100', 'maria@teste.com', '(11) 98888-7777', '1985-05-10');

-- ================================
--  VENDA DE TESTE
-- ================================

-- Venda (funcionário 1, caixa 1, franquia 1, pagamento = pix)
INSERT INTO venda (id_franquia, id_funcionario, id_sessao_caixa, valor_total, desconto, id_pagamento, status)
VALUES (1, 1, 1, 850.00, 0.00, 1, 'Paga');

INSERT INTO item_venda (id_venda, id_produto, quantidade, preco_utilitario, valor_total)
VALUES
(1, 1, 5, 599.90, 2999.50),  -- Violão Clássico Nylon
(1, 2, 8, 2899.00, 23192.00), -- Guitarra Elétrica Stratocaster
(1, 3, 6, 3490.00, 20940.00), -- Baixo Jazz Bass 4 Cordas
(1, 4, 2, 1499.00, 2998.00),  -- Teclado Digital 61 Teclas
(1, 5, 7, 4499.90, 31499.30), -- Bateria Acústica 5 Peças
(1, 6, 3, 1299.00, 3897.00),  -- Caixa de Som Ativa 500W
(1, 7, 4, 399.90, 1599.60),   -- Microfone Dinâmico Cardioide
(1, 8, 2, 899.00, 1798.00),   -- Fone de Ouvido Profissional
(1, 9, 3, 499.00, 1497.00),   -- Pedal de Distorção
(1, 10, 1, 159.90, 159.90),   -- Suporte para Microfone
(1, 11, 1, 79.90, 79.90),     -- Cabo P10 5 Metros
(1, 12, 1, 69.90, 69.90),     -- Encordoamento para Guitarra 0.10
(1, 13, 4, 1990.00, 7960.00), -- Violino 4/4 Profissional
(1, 14, 2, 499.00, 998.00),   -- Ukulele Soprano
(1, 15, 1, 189.90, 189.90),   -- Metronomo Digital
(1, 16, 1, 99.90, 99.90),     -- Afinador Cromático Clip
(1, 17, 2, 549.00, 1098.00),  -- Cadeira Ergonômica para Bateria
(1, 18, 3, 1899.00, 5697.00), -- Amplificador 50W Guitarra
(1, 19, 1, 2199.00, 2199.00), -- Mesa de Som 8 Canais
(1, 20, 1, 799.90, 799.90);   -- Case para Guitarra

-- Recebimento da venda
INSERT INTO recebimentos_venda (id_venda, id_pagamento, valor, parcelas, status)
VALUES (1, 1, 850.00, 1, 'confirmado');