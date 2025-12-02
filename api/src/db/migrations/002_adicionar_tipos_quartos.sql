-- Migration: Adicionar novos tipos de quartos (DUPLO e CASAL)
-- Data: 2024-12-02

-- Remover a constraint antiga
ALTER TABLE quartos DROP CONSTRAINT IF EXISTS quartos_tipo_check;

-- Adicionar nova constraint com todos os tipos
ALTER TABLE quartos ADD CONSTRAINT quartos_tipo_check 
  CHECK (tipo IN ('INDIVIDUAL', 'DUPLO', 'CASAL', 'TRIPLO'));

-- Comentário explicativo
COMMENT ON COLUMN quartos.tipo IS 'Tipo do quarto: INDIVIDUAL (1 pessoa), DUPLO (2 solteiros), CASAL (1 casal), TRIPLO (3 pessoas)';
