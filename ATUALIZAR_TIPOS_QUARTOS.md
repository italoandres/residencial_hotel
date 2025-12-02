# 🔧 Atualizar Tipos de Quartos no Supabase

## 📋 Passo a Passo

### 1. Acessar o Supabase
1. Acesse: https://supabase.com/dashboard
2. Faça login
3. Selecione o projeto: `residencial-hotel`

### 2. Abrir o SQL Editor
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query**

### 3. Executar o SQL
Cole este código e clique em **RUN**:

```sql
-- Remover a constraint antiga
ALTER TABLE quartos DROP CONSTRAINT IF EXISTS quartos_tipo_check;

-- Adicionar nova constraint com todos os tipos
ALTER TABLE quartos ADD CONSTRAINT quartos_tipo_check 
  CHECK (tipo IN ('INDIVIDUAL', 'DUPLO', 'CASAL', 'TRIPLO'));
```

### 4. Verificar
Você deve ver a mensagem: **Success. No rows returned**

---

## 🔄 Depois de Executar o SQL

Execute este comando no seu terminal para atualizar os quartos:

```bash
cd api
node src/db/atualizar-quartos.js
```

---

## ✅ Resultado Final

Após executar, você terá:

- **Quartos 1-9:** INDIVIDUAL (1 pessoa) - R$ 80/dia
- **Quarto 10:** DUPLO (2 solteiros) - R$ 120/dia  
- **Quarto 11:** CASAL (1 casal) - R$ 120/dia
- **Quarto 12:** DUPLO (2 solteiros) - R$ 120/dia
- **Quarto 13:** TRIPLO (1 casal + 1 solteiro) - R$ 150/dia

---

## 🆘 Se Der Erro

Se aparecer erro de permissão, você pode atualizar manualmente:

1. Vá em **Table Editor** > **quartos**
2. Clique em cada quarto e edite:
   - Quarto 10: tipo = DUPLO, capacidade = 2, preco_diaria = 120
   - Quarto 11: tipo = CASAL, capacidade = 2, preco_diaria = 120
   - Quarto 12: tipo = DUPLO, capacidade = 2, preco_diaria = 120
