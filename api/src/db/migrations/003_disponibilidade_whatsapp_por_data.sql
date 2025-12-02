-- Migration: Criar tabela para disponibilidade WhatsApp por data
-- Data: 2024-12-02

-- Criar tabela para armazenar disponibilidade por data
CREATE TABLE IF NOT EXISTS disponibilidade_whatsapp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quarto_id UUID NOT NULL REFERENCES quartos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Garantir que não haja duplicatas (um quarto só pode ter uma configuração por data)
  UNIQUE(quarto_id, data)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_disponibilidade_whatsapp_quarto ON disponibilidade_whatsapp(quarto_id);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_whatsapp_data ON disponibilidade_whatsapp(data);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_whatsapp_quarto_data ON disponibilidade_whatsapp(quarto_id, data);

-- Comentários
COMMENT ON TABLE disponibilidade_whatsapp IS 'Armazena a disponibilidade de cada quarto para WhatsApp por data específica';
COMMENT ON COLUMN disponibilidade_whatsapp.quarto_id IS 'ID do quarto';
COMMENT ON COLUMN disponibilidade_whatsapp.data IS 'Data para a qual a disponibilidade se aplica';
COMMENT ON COLUMN disponibilidade_whatsapp.disponivel IS 'Se o quarto está disponível para WhatsApp nesta data';
