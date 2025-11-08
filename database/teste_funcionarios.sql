INSERT INTO funcionarios (
    nome_completo, cpf, rg, data_nascimento, sexo, estado_civil,
    email, telefone, id_franquia, id_credencial, fotoFuncionario, senha, status
) VALUES
-- ADMINISTRADORES (id_credencial = 1)
('Marcos Almeida', '11111111111', 'SP-1234567', '1985-03-12', 'Masculino', 'Casado',
 'marcos.almeida@musichouse.com.br', '(11) 98888-1101', 1, 1, '/funcionarios/marcos-almeida.png', 'admin2024', 'Ativo'),

('Carla Menezes', '11111111112', 'DF-7654321', '1988-07-25', 'Feminino', 'Solteiro',
 'carla.menezes@musichouse.com.br', '(61) 98888-1102', 8, 1, '/funcionarios/carla-menezes.png', 'admin2024', 'Ativo'),

-- GERENTES DE LOJA (id_credencial = 2)
('João da Silva', '11111111113', 'SP-2345678', '1990-01-01', 'Masculino', 'Solteiro',
 'joao.silva.sp@musichouse.com.br', '(11) 98888-2001', 1, 2, '/funcionarios/joao-silva-sp.png', 'loja2024', 'Ativo'),

('Ana Beatriz Rocha', '11111111114', 'RJ-3456789', '1992-05-18', 'Feminino', 'Casado',
 'ana.rocha.rj@musichouse.com.br', '(21) 97777-2002', 2, 2, '/funcionarios/ana-rocha-rj.png', 'loja2024', 'Ativo'),

('Lucas Pereira', '11111111115', 'MG-4567890', '1989-11-09', 'Masculino', 'Solteiro',
 'lucas.pereira.bh@musichouse.com.br', '(31) 98888-2003', 3, 2, '/funcionarios/lucas-pereira-bh.png', 'loja2024', 'Ativo'),

('Fernanda Carvalho', '11111111116', 'BA-5678901', '1991-02-27', 'Feminino', 'Casado',
 'fernanda.carvalho.ssa@musichouse.com.br', '(71) 98888-2004', 4, 2, '/funcionarios/fernanda-carvalho-ssa.png', 'loja2024', 'Ativo'),

('Rafael Monteiro', '11111111117', 'PR-6789012', '1987-08-03', 'Masculino', 'Casado',
 'rafael.monteiro.ctb@musichouse.com.br', '(41) 97777-2005', 5, 2, '/funcionarios/rafael-monteiro-ctb.png', 'loja2024', 'Ativo'),

('Patrícia Nogueira', '11111111118', 'AM-7890123', '1993-04-14', 'Feminino', 'Solteiro',
 'patricia.nogueira.mao@musichouse.com.br', '(92) 98888-2006', 6, 2, '/funcionarios/patricia-nogueira-mao.png', 'loja2024', 'Ativo'),

('Gustavo Lima', '11111111119', 'PI-8901234', '1986-09-21', 'Masculino', 'Casado',
 'gustavo.lima.the@musichouse.com.br', '(86) 98888-2007', 7, 2, '/funcionarios/gustavo-lima-the.png', 'loja2024', 'Ativo'),

('Mariana Duarte', '11111111120', 'DF-9012345', '1994-12-30', 'Feminino', 'Solteiro',
 'mariana.duarte.bsb@musichouse.com.br', '(61) 98888-2008', 8, 2, '/funcionarios/mariana-duarte-bsb.png', 'loja2024', 'Ativo'),

('Thiago Souza', '11111111121', 'RS-0123456', '1988-10-05', 'Masculino', 'Casado',
 'thiago.souza.poa@musichouse.com.br', '(51) 98888-2009', 9, 2, '/funcionarios/thiago-souza-poa.png', 'loja2024', 'Ativo'),

('Bruna Oliveira', '11111111122', 'PB-1234500', '1995-06-17', 'Feminino', 'Solteiro',
 'bruna.oliveira.jpa@musichouse.com.br', '(83) 98888-2010', 10, 2, '/funcionarios/bruna-oliveira-jpa.png', 'loja2024', 'Ativo'),

-- CAIXAS (id_credencial = 3)
('Felipe Andrade', '11111111124', 'SP-7778889', '1998-01-22', 'Masculino', 'Solteiro',
 'felipe.andrade@musichouse.com.br', '(11) 97777-3001', 1, 3, '/funcionarios/felipe-andrade.png', '123456', 'Ativo'),

('Letícia Moraes', '11111111125', 'RJ-8889990', '1999-07-11', 'Feminino', 'Solteiro',
 'leticia.moraes@musichouse.com.br', '(21) 97777-3002', 2, 3, '/funcionarios/leticia-moraes.png', '123456', 'Ativo'),

('Bruno Costa', '11111111126', 'MG-9990001', '1997-05-29', 'Masculino', 'Solteiro',
 'bruno.costa@musichouse.com.br', '(31) 97777-3003', 3, 3, '/funcionarios/bruno-costa.png', '123456', 'Ativo'),

('Camila Ribeiro', '11111111127', 'BA-1011121', '1996-09-19', 'Feminino', 'Solteiro',
 'camila.ribeiro@musichouse.com.br', '(71) 97777-3004', 4, 3, '/funcionarios/camila-ribeiro.png', '123456', 'Ativo'),

('Diego Martins', '11111111128', 'PR-1213141', '1994-02-10', 'Masculino', 'Casado',
 'diego.martins@musichouse.com.br', '(41) 97777-3005', 5, 3, '/funcionarios/diego-martins.png', '123456', 'Ativo'),

('Isabela Farias', '11111111129', 'AM-1415161', '1995-11-03', 'Feminino', 'Solteiro',
 'isabela.farias@musichouse.com.br', '(92) 97777-3006', 6, 3, '/funcionarios/isabela-farias.png', '123456', 'Ativo'),

('Rogério Tavares', '11111111130', 'PI-1617181', '1993-08-14', 'Masculino', 'Casado',
 'rogerio.tavares@musichouse.com.br', '(86) 97777-3007', 7, 3, '/funcionarios/rogerio-tavares.png', '123456', 'Ativo'),

('Nicole Santos', '11111111131', 'DF-1819202', '1998-04-09', 'Feminino', 'Solteiro',
 'nicole.santos@musichouse.com.br', '(61) 97777-3008', 8, 3, '/funcionarios/nicole-santos.png', '123456', 'Ativo'),

('André Luiz', '11111111132', 'RS-2021222', '1992-12-01', 'Masculino', 'Casado',
 'andre.luiz@musichouse.com.br', '(51) 97777-3009', 9, 3, '/funcionarios/andre-luiz.png', '123456', 'Ativo'),

('Paula Mendes', '11111111133', 'PB-2223242', '1997-06-06', 'Feminino', 'Solteiro',
 'paula.mendes@musichouse.com.br', '(83) 97777-3010', 10, 3, '/funcionarios/paula-mendes.png', '123456', 'Ativo')