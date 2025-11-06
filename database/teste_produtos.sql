USE musicHouse;

#SELECT * FROM funcionarios

INSERT INTO produtos (sku, nome, descricao, materiais, detalhes, nome_cor, cor, desconto, id_categoria, valor, custo_producao, imagem) VALUES
('132321', 'Violão Clássico Nylon', 'Violão clássico com cordas de nylon, ideal para iniciantes.', 'Madeira de mogno, cordas de nylon', 'Tarraxas cromadas e acabamento brilhante', 'Natural', '#D2B48C', 'GUITARRA10', 1, 599.90, 320.00, 
'https://static.vecteezy.com/system/resources/previews/012/021/474/non_2x/full-view-of-prime-acoustic-guitar-photo.jpg, https://caminhosdoviolao.com.br/wp-content/uploads/2017/09/violao-velho-2.jpg'),
('000002', 'Guitarra Elétrica Stratocaster', 'Guitarra com corpo em alder e captação single coil tripla.', 'Corpo em alder, braço em maple', '3 captadores single coil, chave de 5 posições', 'Preta', '#000000', NULL, 1, 2899.00, 1600.00, 'guitarra_strato.jpg'),
('000003', 'Baixo Jazz Bass 4 Cordas', 'Baixo elétrico de 4 cordas com timbre encorpado.', 'Corpo em ash, escala em rosewood', '2 captadores single coil', 'Sunburst', '#FF7043', '5%', 1, 3490.00, 1800.00, 'baixo_jazzbass.jpg'),
('000004', 'Teclado Digital 61 Teclas', 'Teclado portátil com 600 timbres e funções de aprendizado.', 'Plástico ABS reforçado', 'Display LCD e saída para fones', 'Preto', '#000000', NULL, 3, 1499.00, 850.00, 'teclado_61.jpg'),
('000005', 'Bateria Acústica 5 Peças', 'Kit completo de bateria com pratos e ferragens.', 'Madeira de álamo e metal', 'Inclui bumbo, toms, surdo e caixa', 'Vermelha', '#FF0000', '15%', 2, 4499.90, 2500.00, 'bateria_5pcs.jpg'),
('000006', 'Caixa de Som Ativa 500W', 'Caixa amplificada com Bluetooth e entrada USB.', 'Plástico ABS e componentes eletrônicos', 'Equalizador de 5 bandas integrado', 'Preta', '#000000', NULL, 6, 1299.00, 700.00, 'caixa_ativa.jpg'),
('000007', 'Microfone Dinâmico Cardioide', 'Ideal para vocais e instrumentos ao vivo.', 'Metal e cápsula dinâmica', 'Resposta de frequência de 50Hz a 15kHz', 'Prata', '#C0C0C0', NULL, 6, 399.90, 120.00, 'microfone_cardioide.jpg'),
('000008', 'Fone de Ouvido Profissional', 'Fone fechado com resposta plana e alta definição.', 'Plástico reforçado e almofadas de couro sintético', 'Cabo destacável de 3m', 'Preto', '#000000', 'GUITARRA10', 6, 899.00, 450.00, 'fone_profissional.jpg'),
('000009', 'Pedal de Distorção', 'Pedal de efeito com drive ajustável e bypass verdadeiro.', 'Carcaça de alumínio', 'Controles de Gain, Tone e Level', 'Laranja', '#FFA500', NULL, 7, 499.00, 200.00, 'pedal_distorcao.jpg'),
('000010', 'Suporte para Microfone', 'Suporte ajustável com base tripé.', 'Aço carbono e plástico', 'Altura regulável de 90cm a 160cm', 'Preto', '#000000', NULL, 7, 159.90, 60.00, 'suporte_microfone.jpg'),
('000011', 'Cabo P10 5 Metros', 'Cabo de áudio profissional com conectores banhados a ouro.', 'Cobre trançado e PVC', 'Alta durabilidade e blindagem dupla', 'Preto', '#000000', NULL, 7, 79.90, 20.00, 'cabo_p10_5m.jpg'),
('000012', 'Encordoamento para Guitarra 0.10', 'Cordas de aço niquelado com timbre brilhante.', 'Aço niquelado e núcleo hexagonal', 'Calibre 0.10 - 0.46', 'Prata', '#C0C0C0', NULL, 1, 69.90, 15.00, 'encordoamento_guitarra.jpg'),
('000013', 'Violino 4/4 Profissional', 'Violino com excelente projeção sonora e acabamento refinado.', 'Madeira de bordo e ébano', 'Inclui arco e estojo rígido', 'Natural', '#D2B48C', '8%', 1, 1990.00, 950.00, 'violino_44.jpg'),
('000014', 'Ukulele Soprano', 'Ukulele compacto com timbre suave e corpo leve.', 'Mahogany laminado', 'Tarraxas cromadas e cordas Aquila', 'Marrom', '#8B4513', NULL, 1, 499.00, 220.00, 'ukulele_soprano.jpg'),
('000015', 'Metronomo Digital', 'Metronomo com display LCD e ajuste de ritmo e compasso.', 'Plástico e componentes eletrônicos', 'Bateria recarregável via USB', 'Preto', '#000000', NULL, 4, 189.90, 80.00, 'metronomo_digital.jpg'),
('000016', 'Afinador Cromático Clip', 'Afinador digital com clipe e visor colorido.', 'Plástico ABS e circuito eletrônico', 'Gira 360 graus, modo automático', 'Preto', '#000000', NULL, 4, 99.90, 35.00, 'afinador_clip.jpg'),
('000017', 'Cadeira Ergonômica para Bateria', 'Banco com ajuste de altura e assento acolchoado.', 'Aço e couro sintético', 'Base antiderrapante e dobrável', 'Preta', '#000000', NULL, 7, 549.00, 230.00, 'banco_bateria.jpg'),
('000018', 'Amplificador 50W Guitarra', 'Amplificador compacto com canal limpo e distorção.', 'Madeira, tecido e componentes eletrônicos', 'Entrada auxiliar e saída para fones', 'Preto', '#000000', 'GUITARRA10', 6, 1899.00, 950.00, 'amp_50w.jpg'),
('000019', 'Mesa de Som 8 Canais', 'Mesa compacta com equalizador e efeitos digitais.', 'Plástico e alumínio', 'Entrada XLR e Phantom Power 48V', 'Cinza', '#808080', NULL, 6, 2199.00, 1200.00, 'mesa_8ch.jpg'),
('000020', 'Case para Guitarra', 'Case rígido com interior acolchoado e trava metálica.', 'Madeira e veludo', 'Protege contra impacto e umidade', 'Preta', '#000000', NULL, 7, 799.90, 300.00, 'case_guitarra.jpg');

INSERT INTO variacoes_produto (sku, id_produto, nome_cor, cor, imagem, status) VALUES
('000021', 1, 'Sunburst', '#FF8C42', 
'https://forbes.com.br/wp-content/uploads/2021/04/Listas_WillSmith_020421_GettyImages-800x533.jpg, https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc69z017Uix9vUVF5ZHPVe1kzUIlSSdFdXgA&s', 'Ativo'),
('000022', 1, 'Preto Fosco', '#000', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlhDzDPDy-8bNBNELnjo0NdGd7Pfc1NNwQm-VaA4KYL-gzzkLixO1c2ZG0rwE9XZ4u4--tRlqw_o0EX0J_EwOoauzZ0RKqPALTqXi1zQ&s=10, https://m.media-amazon.com/images/M/MV5BNWJmNDNiMzgtOGNlOC00MmU4LThkNjUtNTIxNmQwMzQ4NTczXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'Ativo');