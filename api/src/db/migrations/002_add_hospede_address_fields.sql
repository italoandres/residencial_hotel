-- Migration: Adicionar campos de endereço completo na tabela hospedes
-- Execute este SQL no editor SQL do Supabase

-- Adicionar campos de endereço
ALTER TABLE hospedes 
ADD COLUMN IF NOT EXISTS cidade VARCHAR(100),
ADD COLUMN IF NOT EXISTS rua VARCHAR(255),
ADD COLUMN IF NOT EXISTS numero VARCHAR(20),
ADD COLUMN IF NOT EXISTS bairro VARCHAR(100),
ADD COLUMN IF NOT EXISTS cep VARCHAR(10);

-- Adicionar campo de observações na tabela reservas (se não existir)
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Comentários para documentação
COMMENT ON COLUMN hospedes.cidade IS 'Cidade do hóspede';
COMMENT ON COLUMN hospedes.rua IS 'Rua do endereço do hóspede';
COMMENT ON COLUMN hospedes.numero IS 'Número do endereço do hóspede';
COMMENT ON COLUMN hospedes.bairro IS 'Bairro do hóspede';
COMMENT ON COLUMN hospedes.cep IS 'CEP do hóspede';
COMMENT ON COLUMN reservas.observacoes IS 'Observações da reserva (ex: informações de pagamento)';
