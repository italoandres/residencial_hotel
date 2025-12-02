# 🔧 Atualizar Sistema de Disponibilidade WhatsApp por Data

## 📋 O Que Mudou?

Antes: O toggle "Disponível no WhatsApp" era global para o quarto (aplicava para todas as datas).

Agora: O toggle é específico para cada data! Você escolhe a data e marca quais quartos estão disponíveis para aquele dia específico.

---

## 🚀 Passo a Passo para Atualizar

### 1. Criar a Nova Tabela no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: `residencial-hotel`
3. Vá em **SQL Editor**
4. Clique em **New query**
5. Cole este código e clique em **RUN**:

```sql
-- Criar tabela para disponibilidade WhatsApp por data
CREATE TABLE IF NOT EXISTS disponibilidade_whatsapp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quarto_id UUID NOT NULL REFERENCES quartos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Garantir que não haja duplicatas
  UNIQUE(quarto_id, data)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_disponibilidade_whatsapp_quarto ON disponibilidade_whatsapp(quarto_id);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_whatsapp_data ON disponibilidade_whatsapp(data);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_whatsapp_quarto_data ON disponibilidade_whatsapp(quarto_id, data);
```

### 2. Fazer Deploy da API Atualizada

O código já foi atualizado e enviado para o GitHub. O Render vai fazer o deploy automaticamente em alguns minutos.

Aguarde 2-3 minutos e verifique se o deploy foi concluído em:
https://dashboard.render.com

### 3. Fazer Deploy do Frontend Atualizado

Execute no terminal:

```bash
git add .
git commit -m "Atualizar disponibilidade WhatsApp para ser por data"
git push origin main
```

O Netlify vai fazer o deploy automaticamente em 1-2 minutos.

---

## ✅ Como Usar o Novo Sistema

### No Painel Admin:

1. **Selecione a Data** no filtro de data (ex: 05/12/2024)
2. Os quartos serão carregados para aquela data
3. **Ative/Desative o Toggle** "Disponível no WhatsApp" para cada quarto
4. A configuração será salva **apenas para aquela data específica**

### Exemplo de Uso:

- **Hoje (02/12):** Quarto 5 disponível no WhatsApp ✅
- **Amanhã (03/12):** Quarto 5 indisponível no WhatsApp ❌
- **Depois (04/12):** Quarto 5 disponível no WhatsApp ✅

Cada dia tem sua própria configuração!

---

## 🔍 Verificar se Funcionou

1. Acesse o painel admin
2. Selecione uma data
3. Ative/desative o toggle de um quarto
4. Mude para outra data
5. O toggle deve estar no estado padrão (ativado)
6. Volte para a primeira data
7. O toggle deve estar como você deixou!

---

## 📊 Comportamento Padrão

- Se você **não configurou** a disponibilidade para uma data, o quarto aparece como **disponível** por padrão
- Você só precisa configurar quando quiser **desativar** um quarto para uma data específica

---

## 🆘 Se Der Erro

Se aparecer erro ao clicar no toggle:

1. Verifique se a tabela foi criada no Supabase
2. Verifique se o deploy da API foi concluído no Render
3. Abra o console do navegador (F12) e veja se há erros
4. Me avise qual erro apareceu!

---

**Última atualização:** 02/12/2024
