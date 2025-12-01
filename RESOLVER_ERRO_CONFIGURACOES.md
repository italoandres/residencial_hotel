# 🚨 RESOLVER ERRO: Tabela 'configuracoes' não encontrada

## O Problema
```
❌ Erro ao inserir configurações: Could not find the table 'public.configuracoes' in the schema cache
```

## A Solução (3 passos simples)

### 📝 PASSO 1: Copie este SQL

```sql
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_configuracoes_chave ON configuracoes(chave);

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('quartos_whatsapp', '5', 'Quantidade de quartos disponíveis exibidos no WhatsApp'),
  ('horario_checkin', '13', 'Horário de check-in (formato 24h)'),
  ('horario_checkout', '11', 'Horário de check-out (formato 24h)')
ON CONFLICT (chave) DO NOTHING;
```

### 🌐 PASSO 2: Execute no Supabase

1. Abra: https://supabase.com
2. Entre no seu projeto
3. Clique em **"SQL Editor"** (menu lateral)
4. Cole o SQL acima
5. Clique em **"Run"** ou `Ctrl+Enter`

### ✅ PASSO 3: Teste

No terminal (na pasta `api`):
```bash
node src/db/seed.js
```

Agora deve aparecer:
```
✓ Configurações padrão inseridas
```

## 🎉 Pronto!

Agora acesse: http://localhost:3000

---

## 💡 Dica

Se o servidor já estiver rodando, reinicie:
1. Pressione `Ctrl+C`
2. Execute: `node src/server.js`
