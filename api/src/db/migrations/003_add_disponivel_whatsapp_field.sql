-- Migration: Adicionar campo disponivel_whatsapp na tabela quartos
-- Execute este SQL no editor SQL do Supabase

-- Adicionar campo disponivel_whatsapp (padrão true)
ALTER TABLE quartos 
ADD COLUMN IF NOT EXISTS disponivel_whatsapp BOOLEAN DEFAULT true;

-- Comentário para documentação
COMMENT ON COLUMN quartos.disponivel_whatsapp IS 'Define se o quarto aparece como disponível no atendimento via WhatsApp';

-- Criar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_quartos_disponivel_whatsapp ON quartos(disponivel_whatsapp);
