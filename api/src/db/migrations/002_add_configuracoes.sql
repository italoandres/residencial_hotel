-- Migration: Adicionar tabela de configurações
-- Execute este SQL no editor SQL do Supabase

-- Tabela: configuracoes
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para configuracoes
CREATE INDEX IF NOT EXISTS idx_configuracoes_chave ON configuracoes(chave);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('quartos_whatsapp', '5', 'Quantidade de quartos disponíveis exibidos no WhatsApp'),
  ('horario_checkin', '13', 'Horário de check-in (formato 24h)'),
  ('horario_checkout', '11', 'Horário de check-out (formato 24h)')
ON CONFLICT (chave) DO NOTHING;
