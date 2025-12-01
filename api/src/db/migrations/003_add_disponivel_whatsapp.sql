-- Migration: Adicionar campo disponivel_whatsapp na tabela quartos
-- Execute este SQL no editor SQL do Supabase

-- Adicionar coluna disponivel_whatsapp (padrão true)
ALTER TABLE quartos 
ADD COLUMN IF NOT EXISTS disponivel_whatsapp BOOLEAN DEFAULT true;

-- Criar índice para otimizar queries
CREATE INDEX IF NOT EXISTS idx_quartos_disponivel_whatsapp ON quartos(disponivel_whatsapp);

-- Comentário explicativo
COMMENT ON COLUMN quartos.disponivel_whatsapp IS 'Controle fake de disponibilidade para WhatsApp. Admin pode marcar quarto como indisponível mesmo estando livre.';
