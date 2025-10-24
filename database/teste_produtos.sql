USE musicHouse;

#SELECT * FROM funcionarios

INSERT INTO produtos (nome, descricao, materiais, detalhes, cor, desconto, id_categoria, valor, custo_producao, imagem) VALUES
('Violão Clássico Nylon', 'Violão clássico com cordas de nylon, ideal para iniciantes.', 'Madeira de mogno, cordas de nylon', 'Tarraxas cromadas e acabamento brilhante', 'Natural', 'GUITARRA10', 1, 599.90, 320.00, 'violao_classico.jpg'),
('Guitarra Elétrica Stratocaster', 'Guitarra com corpo em alder e captação single coil tripla.', 'Corpo em alder, braço em maple', '3 captadores single coil, chave de 5 posições', 'Preta', NULL, 1, 2899.00, 1600.00, 'guitarra_strato.jpg'),
('Baixo Jazz Bass 4 Cordas', 'Baixo elétrico de 4 cordas com timbre encorpado.', 'Corpo em ash, escala em rosewood', '2 captadores single coil', 'Sunburst', '5%', 1, 3490.00, 1800.00, 'baixo_jazzbass.jpg'),
('Teclado Digital 61 Teclas', 'Teclado portátil com 600 timbres e funções de aprendizado.', 'Plástico ABS reforçado', 'Display LCD e saída para fones', 'Preto', NULL, 1, 1499.00, 850.00, 'teclado_61.jpg'),
('Bateria Acústica 5 Peças', 'Kit completo de bateria com pratos e ferragens.', 'Madeira de álamo e metal', 'Inclui bumbo, toms, surdo e caixa', 'Vermelha', '15%', 1, 4499.90, 2500.00, 'bateria_5pcs.jpg'),
('Caixa de Som Ativa 500W', 'Caixa amplificada com Bluetooth e entrada USB.', 'Plástico ABS e componentes eletrônicos', 'Equalizador de 5 bandas integrado', 'Preta', NULL, 1, 1299.00, 700.00, 'caixa_ativa.jpg'),
('Microfone Dinâmico Cardioide', 'Ideal para vocais e instrumentos ao vivo.', 'Metal e cápsula dinâmica', 'Resposta de frequência de 50Hz a 15kHz', 'Prata', NULL, 1, 399.90, 120.00, 'microfone_cardioide.jpg'),
('Fone de Ouvido Profissional', 'Fone fechado com resposta plana e alta definição.', 'Plástico reforçado e almofadas de couro sintético', 'Cabo destacávede 3m', 'Preto', 'GUITARRA10', 1, 899.00, 450.00, 'fone_profissional.jpg'),
('Pedal de Distorção', 'Pedal de efeito com drive ajustável e bypass verdadeiro.', 'Carcaça de alumínio', 'Controles de Gain, Tone e Level', 'Laranja', NULL, 1, 499.00, 200.00, 'pedal_distorcao.jpg'),
('Suporte para Microfone', 'Suporte ajustável com base tripé.', 'Aço carbono e plástico', 'Altura regulável de 90cm a 160cm', 'Preto', NULL, 1, 159.90, 60.00, 'suporte_microfone.jpg'),
('Cabo P10 5 Metros', 'Cabo de áudio profissional com conectores banhados a ouro.', 'Cobre trançado e PVC', 'Alta durabilidade e blindagem dupla', 'Preto', NULL, 1, 79.90, 20.00, 'cabo_p10_5m.jpg'),
('Encordoamento para Guitarra 0.10', 'Cordas de aço niquelado com timbre brilhante.', 'Aço niquelado e núcleo hexagonal', 'Calibre 0.10 - 0.46', 'Prata', NULL, 1, 69.90, 15.00, 'encordoamento_guitarra.jpg'),
('Violino 4/4 Profissional', 'Violino com excelente projeção sonora e acabamento refinado.', 'Madeira de bordo e ébano', 'Inclui arco e estojo rígido', 'Natural', '8%', 1, 1990.00, 950.00, 'violino_44.jpg'),
('Ukulele Soprano', 'Ukulele compacto com timbre suave e corpo leve.', 'Mahogany laminado', 'Tarraxas cromadas e cordas Aquila', 'Marrom', NULL, 1, 499.00, 220.00, 'ukulele_soprano.jpg'),
('Metronomo Digital', 'Metronomo com display LCD e ajuste de ritmo e compasso.', 'Plástico e componentes eletrônicos', 'Bateria recarregável via USB', 'Preto', NULL, 1, 189.90, 80.00, 'metronomo_digital.jpg'),
('Afinador Cromático Clip', 'Afinador digital com clipe e visor colorido.', 'Plástico ABS e circuito eletrônico', 'Gira 360 graus, modo automático', 'Preto', NULL, 1, 99.90, 35.00, 'afinador_clip.jpg'),
('Cadeira Ergonômica para Bateria', 'Banco com ajuste de altura e assento acolchoado.', 'Aço e couro sintético', 'Base antiderrapante e dobrável', 'Preta', NULL, 1, 549.00, 230.00, 'banco_bateria.jpg'),
('Amplificador 50W Guitarra', 'Amplificador compacto com canal limpo e distorção.', 'Madeira, tecido e componentes eletrônicos', 'Entrada auxiliar e saída para fones', 'Preto', 'GUITARRA10', 1, 1899.00, 950.00, 'amp_50w.jpg'),
('Mesa de Som 8 Canais', 'Mesa compacta com equalizador e efeitos digitais.', 'Plástico e alumínio', 'Entrada XLR e Phantom Power 48V', 'Cinza', NULL, 1, 2199.00, 1200.00, 'mesa_8ch.jpg'),
('Case para Guitarra', 'Case rígido com interior acolchoado e trava metálica.', 'Madeira e veludo', 'Protege contra impacto e umidade', 'Preta', NULL, 1, 799.90, 300.00, 'case_guitarra.jpg');

