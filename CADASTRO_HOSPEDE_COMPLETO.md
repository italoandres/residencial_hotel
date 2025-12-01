# 🎯 Sistema de Cadastro Completo de Hóspedes

## ✨ O que foi implementado:

### 📋 Formulário Completo de Cadastro

**Campos Obrigatórios:**
- ✅ Nome completo
- ✅ CPF (com máscara 000.000.000-00)
- ✅ Telefone
- ✅ Cidade

**Campos Opcionais:**
- Email
- CEP (com máscara 00000-000)
- Rua
- Número da casa
- Bairro

**Dados da Reserva:**
- Data de check-in
- Data de check-out
- Número de pessoas

### 🎨 Como Funciona:

1. **Admin acessa aba Quartos**
2. **Clica em "🔑 Ocupar Quarto"** (só aparece em quartos disponíveis)
3. **Modal abre** com formulário completo
4. **Preenche dados** do hóspede e datas
5. **Clica em "✅ Ocupar Quarto"**
6. **Sistema:**
   - Cadastra hóspede no banco
   - Cria reserva com status EM_ANDAMENTO
   - Marca quarto como ocupado
   - Registra hora de check-in automaticamente

## 🚀 Como Ativar:

### Passo 1: Execute a Migration no Supabase

```sql
-- Adicionar campos de endereço
ALTER TABLE hospedes 
ADD COLUMN IF NOT EXISTS cidade VARCHAR(100),
ADD COLUMN IF NOT EXISTS rua VARCHAR(255),
ADD COLUMN IF NOT EXISTS numero VARCHAR(20),
ADD COLUMN IF NOT EXISTS bairro VARCHAR(100),
ADD COLUMN IF NOT EXISTS cep VARCHAR(10);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_hospedes_cidade ON hospedes(cidade);
```

### Passo 2: Reinicie o Servidor

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
node src/server.js
```

### Passo 3: Teste!

1. Acesse: http://localhost:3000
2. Vá na aba **"🛏️ Quartos"**
3. Clique em **"🔑 Ocupar Quarto"** em um quarto disponível
4. Preencha o formulário
5. Clique em **"✅ Ocupar Quarto"**

## 📊 Diferenças entre Cadastros:

### 🖥️ Cadastro Manual (Painel Admin):
**Obrigatórios:**
- Nome
- CPF
- Telefone
- Cidade

**Opcionais:**
- Email
- Rua
- Número
- Bairro
- CEP

### 📱 Cadastro WhatsApp (N8N):
**Obrigatórios:**
- Nome
- CPF
- Telefone (celular)
- Cidade

**Não pede:**
- Endereço completo

## 🔧 Mudanças Técnicas:

### Backend:
- ✅ Migration: Campos de endereço na tabela `hospedes`
- ✅ Novo serviço: `criarHospedeCompleto()`
- ✅ Novo serviço: `criarReservaManual()`
- ✅ Nova rota: `POST /api/ocupacao/manual`
- ✅ Validação: CPF único por hóspede

### Frontend:
- ✅ Modal responsivo com formulário
- ✅ Máscaras automáticas (CPF e CEP)
- ✅ Validação de campos obrigatórios
- ✅ Botão "Ocupar" só em quartos disponíveis
- ✅ Datas pré-preenchidas (hoje e amanhã)
- ✅ Notificação de sucesso

## 🎯 Fluxo Completo:

```
1. Admin clica "Ocupar Quarto"
   ↓
2. Modal abre com formulário
   ↓
3. Admin preenche dados do hóspede
   ↓
4. Admin define datas (check-in/check-out)
   ↓
5. Admin clica "Ocupar Quarto"
   ↓
6. Sistema valida dados
   ↓
7. Sistema cria hóspede no banco
   ↓
8. Sistema cria reserva (status: EM_ANDAMENTO)
   ↓
9. Quarto fica marcado como OCUPADO
   ↓
10. Notificação de sucesso aparece
   ↓
11. Dashboard atualiza automaticamente
```

## ✅ Validações Implementadas:

1. **CPF único:** Não permite cadastrar hóspede com CPF duplicado
2. **Telefone único:** Não permite telefone duplicado
3. **Campos obrigatórios:** Nome, CPF, telefone, cidade
4. **Formato CPF:** Valida 11 dígitos
5. **Datas:** Check-out deve ser depois do check-in
6. **Pessoas:** Respeita capacidade do quarto

## 🎨 Visual:

- Modal moderno com animação
- Formulário organizado em linhas
- Campos com foco visual (borda azul)
- Botão grande e destacado
- Notificação toast de sucesso
- Responsivo para mobile

---

## 📝 Exemplo de Uso:

**Cenário:** Cliente chega na recepção sem reserva

**Ação do Admin:**
1. Abre painel
2. Vê quarto 5 disponível
3. Clica "Ocupar Quarto"
4. Preenche:
   - Nome: João Silva
   - CPF: 123.456.789-00
   - Telefone: (11) 98765-4321
   - Cidade: São Paulo
   - Rua: Av. Paulista (opcional)
   - Número: 1000 (opcional)
5. Define:
   - Check-in: Hoje
   - Check-out: Amanhã
   - Pessoas: 1
6. Clica "Ocupar"
7. ✅ Pronto! Quarto ocupado!

---

## 🎉 Benefícios:

1. **Cadastro Completo:** Todos os dados do hóspede
2. **Rápido:** Poucos cliques para ocupar
3. **Validado:** Não permite dados duplicados
4. **Flexível:** Campos opcionais para casos simples
5. **Profissional:** Visual moderno e intuitivo
