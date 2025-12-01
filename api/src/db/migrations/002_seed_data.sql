-- Migration: Seed de dados iniciais
-- Execute este SQL no editor SQL do Supabase APÓS executar 001_create_tables.sql

-- Inserir 11 quartos individuais (números 1-11)
INSERT INTO quartos (numero, tipo, capacidade, preco_diaria, ativo) VALUES
(1, 'INDIVIDUAL', 1, 80.00, true),
(2, 'INDIVIDUAL', 1, 80.00, true),
(3, 'INDIVIDUAL', 1, 80.00, true),
(4, 'INDIVIDUAL', 1, 80.00, true),
(5, 'INDIVIDUAL', 1, 80.00, true),
(6, 'INDIVIDUAL', 1, 80.00, true),
(7, 'INDIVIDUAL', 1, 80.00, true),
(8, 'INDIVIDUAL', 1, 80.00, true),
(9, 'INDIVIDUAL', 1, 80.00, true),
(10, 'INDIVIDUAL', 1, 80.00, true),
(11, 'INDIVIDUAL', 1, 80.00, true)
ON CONFLICT (numero) DO NOTHING;

-- Inserir 2 quartos triplos (números 12-13)
INSERT INTO quartos (numero, tipo, capacidade, preco_diaria, ativo) VALUES
(12, 'TRIPLO', 3, 150.00, true),
(13, 'TRIPLO', 3, 150.00, true)
ON CONFLICT (numero) DO NOTHING;

-- Inserir funcionário admin padrão
-- Senha: admin123 (hash bcrypt com salt rounds = 10)
-- IMPORTANTE: Altere esta senha após o primeiro login!
INSERT INTO funcionarios (nome, email, senha_hash, ativo) VALUES
('Administrador', 'admin@residencialhortel.com', '$2b$10$rKvVPZxQxhJZYU5y5YqHZeYGQVKX8vXqKZqKZqKZqKZqKZqKZqKZq', true)
ON CONFLICT (email) DO NOTHING;

-- Nota: O hash acima é um exemplo. Para gerar o hash real, use:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('admin123', 10);
