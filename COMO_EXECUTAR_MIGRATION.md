# 🔧 Como Executar a Migration no Supabase

## ❌ Erro que você está vendo:
```
❌ Erro ao inserir configurações: Could not find the table 'public.configuracoes' in the schema cache
```

## ✅ Solução:

### Passo 1: Acessar o Supabase
1. Abra seu navegador
2. Acesse: https://supabase.com
3. Faça login na sua conta
4. Selecione o projeto do Residencial Hortel

### Passo 2: Abrir o Editor SQL
1. No menu lateral esquerdo, clique em **"SQL Editor"** (ícone de código)
2. Clique em **"New query"** (Nova consulta)

### Passo 3: Copiar e Executar o SQL
1. Abra o arquivo: `api/src/db/migrations/002_add_configuracoes.sql`
2. Copie TODO o conteúdo do arquivo
3. Cole no editor SQL do Supabase
4. Clique em **"Run"** (Executar) ou pressione `Ctrl+Enter`

### Passo 4: Verificar se funcionou
Você deve ver uma mensagem de sucesso como:
```
Success. No rows returned
```

### Passo 5: Executar o seed novamente
Agora volte ao terminal e execute:
```bash
node src/db/seed.js
```

Desta vez você deve ver:
```
✓ Configurações padrão inseridas
```

## 🎯 Alternativa Rápida (Copiar e Colar)

Se preferir, copie e cole este SQL direto no Supabase:

```sql
-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_configuracoes_chave ON configuracoes(chave);

-- Criar trigger
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('quartos_whatsapp', '5', 'Quantidade de quartos disponíveis exibidos no WhatsApp'),
  ('horario_checkin', '13', 'Horário de check-in (formato 24h)'),
  ('horario_checkout', '11', 'Horário de check-out (formato 24h)')
ON CONFLICT (chave) DO NOTHING;
```

## ✅ Depois de executar:

1. **Reinicie o servidor** (se estiver rodando):
   - Pressione `Ctrl+C` no terminal
   - Execute novamente: `node src/server.js`

2. **Acesse o painel**:
   - URL: http://localhost:3000
   - Email: admin@residencialhortel.com
   - Senha: admin123

3. **Teste a aba Configurações**:
   - Clique na aba "⚙️ Configurações"
   - Você deve ver os 3 campos editáveis
   - Tente alterar um valor e salvar

## 🎉 Pronto!

Agora o sistema está 100% funcional com todas as melhorias!

---

## 📝 Nota sobre o erro "cd api"

O erro `cd : Não é possível localizar o caminho` aconteceu porque você já estava na pasta `api`. 

Você executou:
```bash
cd api
node src/db/seed.js
```

Mas já estava em `C:\Users\ItaloLior\Downloads\hotel_system_base\api\`, então o comando `cd api` tentou ir para `api\api` que não existe.

**Solução:** Quando já estiver na pasta `api`, execute direto:
```bash
node src/db/seed.js
```

Sem o `cd api` antes! 😊
