# 🚀 Guia de Instalação Completo - Residencial Hortel

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Conta no Supabase (gratuita)
- Editor de código (VS Code recomendado)

---

## 1️⃣ Configurar Banco de Dados (Supabase)

### 1.1 Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (se não tiver)
3. Clique em "New Project"
4. Preencha:
   - **Name:** residencial-hortel
   - **Database Password:** (anote essa senha!)
   - **Region:** South America (São Paulo)
5. Aguarde criação do projeto (~2 minutos)

### 1.2 Executar Migrations
1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Execute as migrations na ordem:

**Migration 1: Criar Tabelas**
```sql
-- Copie e cole todo o conteúdo de:
-- api/src/db/migrations/001_create_tables.sql
```

**Migration 2: Adicionar Campos de Endereço**
```sql
-- Copie e cole todo o conteúdo de:
-- api/src/db/migrations/002_add_hospede_address_fields.sql
```

**Migration 3: Adicionar Campo WhatsApp**
```sql
-- Copie e cole todo o conteúdo de:
-- api/src/db/migrations/003_add_disponivel_whatsapp_field.sql
```

### 1.3 Criar Usuário Admin
```sql
-- Execute no SQL Editor:
INSERT INTO funcionarios (nome, email, senha_hash, ativo)
VALUES (
  'Administrador',
  'admin@residencialhortel.com',
  '$2b$10$YourHashedPasswordHere', -- Será gerado pelo seed
  true
);
```

### 1.4 Obter Credenciais
1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon/public key** (chave longa começando com "eyJ...")

---

## 2️⃣ Configurar Backend (API)

### 2.1 Instalar Dependências
```bash
cd api
npm install
```

### 2.2 Configurar Variáveis de Ambiente
1. Copie o arquivo de exemplo:
```bash
copy .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:
```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=seu-segredo-super-secreto-aqui-123456

# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=*
```

### 2.3 Popular Banco com Dados Iniciais
```bash
npm run seed
```

Isso criará:
- ✅ Usuário admin (email: admin@residencialhortel.com, senha: admin123)
- ✅ 10 quartos (5 individuais, 5 triplos)
- ✅ Configurações padrão

### 2.4 Iniciar Servidor
```bash
npm start
```

Você verá:
```
🚀 Servidor rodando na porta 3000
📍 Ambiente: development
🏥 Health check: http://localhost:3000/health
[CHECKOUT AUTO] Serviço iniciado - Verificação a cada hora
```

---

## 3️⃣ Acessar Sistema

### 3.1 Abrir Painel Administrativo
1. Abra o navegador
2. Acesse: `http://localhost:3000`
3. Faça login:
   - **Email:** admin@residencialhortel.com
   - **Senha:** admin123

### 3.2 Testar Funcionalidades

**Dashboard:**
- Visualize estatísticas dos quartos
- Veja quartos disponíveis e ocupados

**Quartos:**
- Veja lista de todos os quartos
- Toggle disponibilidade no WhatsApp
- Clique "🔑 Ocupar Quarto" para cadastrar hóspede

**Ocupar Quarto:**
1. Preencha dados do hóspede
2. Defina datas de check-in/check-out
3. Selecione status de pagamento:
   - **Não Pago:** Apenas registra
   - **Pago:** Escolhe forma (Dinheiro/Cartão/PIX)
   - **Sinal:** Informa valor do sinal
4. Clique "✅ Ocupar Quarto"

**Desocupar Quarto:**
1. Clique em quarto ocupado
2. Clique "🚪 Gerenciar Quarto"
3. Clique "🚪 Desocupar Quarto"
4. Confirme

**Clientes:**
- Veja lista de todos os hóspedes cadastrados
- Busque por CPF
- Veja histórico de reservas

**Configurações:**
- Ajuste horários de check-in/check-out
- Configure quantidade de quartos no WhatsApp

---

## 4️⃣ Funcionalidades Automáticas

### Check-out Automático
O sistema verifica **a cada hora** se há reservas vencidas e realiza check-out automaticamente.

**Como funciona:**
1. Serviço roda a cada hora
2. Busca reservas com `data_checkout <= hoje`
3. Verifica se passou do horário de check-out (padrão: 11h)
4. Realiza check-out automático
5. Registra logs no console

**Executar manualmente (para testes):**
```bash
# Via API (com token de autenticação)
POST http://localhost:3000/api/checkout-automatico/executar
Authorization: Bearer seu-token-aqui
```

---

## 5️⃣ Estrutura de Arquivos

```
residencial-hortel/
├── api/                          # Backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── migrations/       # Migrations SQL
│   │   │   └── seed.js          # Dados iniciais
│   │   ├── routes/              # Rotas da API
│   │   ├── services/            # Lógica de negócio
│   │   ├── middlewares/         # Middlewares
│   │   └── server.js            # Servidor principal
│   ├── .env                     # Variáveis de ambiente
│   └── package.json
│
├── web/                         # Frontend
│   ├── painel-admin.html       # Painel administrativo
│   ├── painel-admin.js         # Lógica do painel
│   └── painel-admin.css        # Estilos
│
└── docs/                        # Documentação
    ├── FUNCIONALIDADES_OCUPACAO.md
    └── GUIA_INSTALACAO_COMPLETO.md
```

---

## 6️⃣ Solução de Problemas

### Erro: "Falha ao conectar com Supabase"
- ✅ Verifique se `SUPABASE_URL` e `SUPABASE_KEY` estão corretos no `.env`
- ✅ Verifique se o projeto do Supabase está ativo

### Erro: "Login inválido"
- ✅ Execute o seed: `npm run seed`
- ✅ Use: admin@residencialhortel.com / admin123

### Quartos não aparecem
- ✅ Execute as migrations no Supabase
- ✅ Execute o seed: `npm run seed`

### Check-out automático não funciona
- ✅ Verifique logs do servidor
- ✅ Procure por `[CHECKOUT AUTO]` nos logs
- ✅ Execute manualmente via API para testar

### Hóspede não aparece na lista de clientes
- ✅ Verifique se migration 002 foi executada
- ✅ Recarregue a página
- ✅ Verifique console do navegador (F12)

---

## 7️⃣ Próximos Passos

### Produção
1. Configure domínio próprio
2. Ative HTTPS
3. Configure backup automático no Supabase
4. Ajuste `CORS_ORIGIN` no `.env` para seu domínio

### Melhorias Futuras
- [ ] Relatórios de ocupação
- [ ] Gráficos de receita
- [ ] Exportar dados para Excel
- [ ] Notificações por email
- [ ] App mobile

---

## 📞 Suporte

**Problemas?**
- Verifique os logs do servidor
- Verifique console do navegador (F12)
- Revise este guia passo a passo

**Tudo funcionando?**
- ✅ Sistema pronto para uso!
- ✅ Comece cadastrando hóspedes
- ✅ Gerencie ocupação dos quartos

---

**Desenvolvido com ❤️ para Residencial Hortel**
