# ⚠️ VERIFICAR MIGRATIONS DO SUPABASE

## Problema Atual:
- Erro 400 ao ocupar quarto
- Filtro de data não funciona

## Possível Causa:
Faltam colunas no banco de dados (Supabase)

## ✅ SOLUÇÃO: Executar Migrations

### 1. Acesse o Supabase
1. Vá em https://supabase.com
2. Abra seu projeto
3. Clique em **SQL Editor** no menu lateral

### 2. Execute Migration 002 (Campos de Endereço)

**Copie e cole este SQL:**

```sql
-- Migration: Adicionar campos de endereço completo na tabela hospedes

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
```

Clique em **RUN** ✅

### 3. Execute Migration 003 (Campo WhatsApp)

**Copie e cole este SQL:**

```sql
-- Migration: Adicionar campo disponivel_whatsapp na tabela quartos

-- Adicionar campo disponivel_whatsapp (padrão true)
ALTER TABLE quartos 
ADD COLUMN IF NOT EXISTS disponivel_whatsapp BOOLEAN DEFAULT true;

-- Comentário para documentação
COMMENT ON COLUMN quartos.disponivel_whatsapp IS 'Define se o quarto aparece como disponível no atendimento via WhatsApp';

-- Criar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_quartos_disponivel_whatsapp ON quartos(disponivel_whatsapp);
```

Clique em **RUN** ✅

### 4. Verificar se as Colunas Foram Criadas

**Execute este SQL para verificar:**

```sql
-- Verificar colunas da tabela hospedes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'hospedes'
ORDER BY ordinal_position;

-- Verificar colunas da tabela reservas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reservas'
ORDER BY ordinal_position;

-- Verificar colunas da tabela quartos
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quartos'
ORDER BY ordinal_position;
```

### 5. Resultado Esperado:

**Tabela `hospedes` deve ter:**
- id
- nome
- telefone
- email
- cpf
- **cidade** ← NOVO
- **rua** ← NOVO
- **numero** ← NOVO
- **bairro** ← NOVO
- **cep** ← NOVO
- created_at
- updated_at

**Tabela `reservas` deve ter:**
- id
- hospede_id
- quarto_id
- data_checkin
- data_checkout
- hora_checkin
- hora_checkout
- numero_pessoas
- valor_total
- status
- **observacoes** ← NOVO
- created_at
- updated_at

**Tabela `quartos` deve ter:**
- id
- numero
- tipo
- capacidade
- preco_diaria
- ativo
- **disponivel_whatsapp** ← NOVO
- created_at
- updated_at

---

## 🔄 Depois de Executar as Migrations:

1. **Reinicie o servidor Node.js:**
   ```bash
   # Pare o servidor (Ctrl+C)
   # Inicie novamente
   cd api
   npm start
   ```

2. **Recarregue a página do navegador** (Ctrl+F5)

3. **Tente ocupar um quarto novamente**

---

## 🐛 Se Ainda Houver Erro:

Expanda o objeto de erro no console do navegador:
```
{error: {…}}  ← Clique na setinha para expandir
```

E me envie a mensagem completa que aparece!

---

**Isso deve resolver o problema! 🎯**
