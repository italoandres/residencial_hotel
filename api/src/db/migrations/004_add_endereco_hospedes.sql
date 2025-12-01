-- Migration: Adicionar campos de endereço na tabela hospedes
-- Execute este SQL no editor SQL do Supabase

-- Adicionar colunas de endereço
ALTER TABLE hospedes 
ADD COLUMN IF NOT EXISTS cidade VARCHAR(100),
ADD COLUMN IF NOT EXISTS rua VARCHAR(255),
ADD COLUMN IF NOT EXISTS numero VARCHAR(20),
ADD COLUMN IF NOT EXISTS bairro VARCHAR(100),
ADD COLUMN IF NOT EXISTS cep VARCHAR(10);

-- Criar índice para cidade (para buscas)
CREATE INDEX IF NOT EXISTS idx_hospedes_cidade ON hospedes(cidade);

-- Comentários explicativos
COMMENT ON COLUMN hospedes.cidade IS 'Cidade do hóspede (obrigatório)';
COMMENT ON COLUMN hospedes.rua IS 'Rua/Logradouro (opcional)';
COMMENT ON COLUMN hospedes.numero IS 'Número da casa (opcional)';
COMMENT ON COLUMN hospedes.bairro IS 'Bairro (opcional)';
COMMENT ON COLUMN hospedes.cep IS 'CEP (opcional)';
