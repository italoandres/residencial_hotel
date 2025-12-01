-- Migration: Criar todas as tabelas do sistema Residencial Hortel
-- Execute este SQL no editor SQL do Supabase

-- Habilitar extensão UUID (se ainda não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela: quartos
CREATE TABLE IF NOT EXISTS quartos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero INTEGER UNIQUE NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('INDIVIDUAL', 'TRIPLO')),
  capacidade INTEGER NOT NULL,
  preco_diaria DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para quartos
CREATE INDEX IF NOT EXISTS idx_quartos_tipo ON quartos(tipo);
CREATE INDEX IF NOT EXISTS idx_quartos_ativo ON quartos(ativo);

-- Tabela: hospedes
CREATE TABLE IF NOT EXISTS hospedes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  cpf VARCHAR(14),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para hospedes
CREATE INDEX IF NOT EXISTS idx_hospedes_telefone ON hospedes(telefone);

-- Tabela: reservas
CREATE TABLE IF NOT EXISTS reservas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospede_id UUID NOT NULL REFERENCES hospedes(id),
  quarto_id UUID NOT NULL REFERENCES quartos(id),
  data_checkin DATE NOT NULL,
  data_checkout DATE NOT NULL,
  hora_checkin TIMESTAMP,
  hora_checkout TIMESTAMP,
  numero_pessoas INTEGER NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'CONFIRMADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para reservas
CREATE INDEX IF NOT EXISTS idx_reservas_status ON reservas(status);
CREATE INDEX IF NOT EXISTS idx_reservas_datas ON reservas(data_checkin, data_checkout);
CREATE INDEX IF NOT EXISTS idx_reservas_quarto ON reservas(quarto_id);
CREATE INDEX IF NOT EXISTS idx_reservas_hospede ON reservas(hospede_id);

-- Tabela: pagamentos_pix
CREATE TABLE IF NOT EXISTS pagamentos_pix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reserva_id UUID NOT NULL REFERENCES reservas(id),
  txid VARCHAR(255) UNIQUE NOT NULL,
  qr_code TEXT NOT NULL,
  copia_e_cola TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'PAGO', 'EXPIRADO', 'CANCELADO')),
  data_pagamento TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para pagamentos_pix
CREATE INDEX IF NOT EXISTS idx_pagamentos_reserva ON pagamentos_pix(reserva_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_txid ON pagamentos_pix(txid);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos_pix(status);

-- Tabela: funcionarios
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para funcionarios
CREATE INDEX IF NOT EXISTS idx_funcionarios_email ON funcionarios(email);

-- Tabela: configuracoes
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para configuracoes
CREATE INDEX IF NOT EXISTS idx_configuracoes_chave ON configuracoes(chave);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_quartos_updated_at BEFORE UPDATE ON quartos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospedes_updated_at BEFORE UPDATE ON hospedes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagamentos_pix_updated_at BEFORE UPDATE ON pagamentos_pix
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON funcionarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
