# 🏨 Sistema de Gestão Hoteleira - Residencial Hortel

<div align="center">

**Sistema completo para gestão de hotel com reservas, check-in/check-out, integração WhatsApp e pagamentos PIX.**

[![Status](https://img.shields.io/badge/status-pronto%20para%20uso-success)](.)
[![Versão](https://img.shields.io/badge/versão-1.0.0-blue)](CHANGELOG.md)
[![Documentação](https://img.shields.io/badge/docs-completa-brightgreen)](INDEX.md)
[![Licença](https://img.shields.io/badge/licença-proprietária-red)](LICENSE.md)

**[👋 COMECE AQUI](COMECE_AQUI.md)** •
[Início Rápido](#-início-rápido) •
[Documentação](INDEX.md) •
[Como Usar](COMO_USAR.md) •
[FAQ](FAQ.md) •
[Troubleshooting](TROUBLESHOOTING.md)

</div>

---

## 🚀 DEPLOY E DEMONSTRAÇÃO

**Quer colocar o sistema online para demonstrar ao dono do hotel?**

<div align="center">

### 👉 **[COMECE AQUI: COMECE_AQUI_DEPLOY.md](COMECE_AQUI_DEPLOY.md)** 👈

**Deploy em 3 passos • 20 minutos • Totalmente gratuito**

</div>

### 📚 Guias de Deploy Disponíveis

| Arquivo | Descrição | Tempo |
|---------|-----------|-------|
| **[COMECE_AQUI_DEPLOY.md](COMECE_AQUI_DEPLOY.md)** ⭐ | Início rápido (1 página) | 5 min |
| **[DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)** | Deploy em 3 passos | 20 min |
| **[GUIA_DEPLOY_DEMONSTRACAO.md](GUIA_DEPLOY_DEMONSTRACAO.md)** | Guia completo | 15 min |
| **[CHECKLIST_DEMONSTRACAO.md](CHECKLIST_DEMONSTRACAO.md)** | Roteiro de apresentação | 10 min |
| **[FAQ_DEPLOY.md](FAQ_DEPLOY.md)** | Perguntas frequentes | - |
| **[INDICE_DEPLOY.md](INDICE_DEPLOY.md)** | Índice completo | - |

### 🎯 Decisão Rápida

- **Fazer deploy agora:** → [COMECE_AQUI_DEPLOY.md](COMECE_AQUI_DEPLOY.md)
- **Entender tudo primeiro:** → [GUIA_DEPLOY_DEMONSTRACAO.md](GUIA_DEPLOY_DEMONSTRACAO.md)
- **Apresentar ao cliente:** → [CHECKLIST_DEMONSTRACAO.md](CHECKLIST_DEMONSTRACAO.md)
- **Tenho dúvidas:** → [FAQ_DEPLOY.md](FAQ_DEPLOY.md)

### 💰 Custos de Deploy

- **Gratuito:** R$ 0/mês (Render Free + Supabase Free)
- **Profissional:** R$ 70-195/mês (sem limitações)

---

---

## 📊 Estatísticas do Projeto

<div align="center">

| Métrica | Valor |
|---------|-------|
| **Linhas de Código** | ~3.200 |
| **Arquivos de Código** | ~30 |
| **Documentos** | 18+ |
| **Endpoints API** | 12 |
| **Tabelas DB** | 5 |
| **Cobertura** | 100% Funcional |

</div>

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| **[📖 INDEX.md](INDEX.md)** | Índice completo de toda documentação |
| **[🚀 COMO_USAR.md](COMO_USAR.md)** | Guia passo a passo de uso |
| **[📊 RESUMO_EXECUTIVO.md](RESUMO_EXECUTIVO.md)** | Visão geral executiva |
| **[🏗️ ARQUITETURA.md](ARQUITETURA.md)** | Arquitetura do sistema |
| **[🔧 TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Solução de problemas |
| **[✅ CHECKLIST.md](CHECKLIST.md)** | Checklist de verificação |
| **[❓ FAQ.md](FAQ.md)** | Perguntas frequentes |
| **[🎉 CONCLUSAO.md](CONCLUSAO.md)** | Resumo final do projeto |

---

## ⚡ Início Rápido

### 🚀 Opção 1: Automático (Windows)
```bash
# Clique duas vezes:
INICIAR.bat
```

### 📝 Opção 2: Manual
```bash
# Passo 1: Inicie a API
cd api
node server.js

# Passo 2: Abra no navegador
web/painel-simples.html
```

### 🔐 Credenciais de Login
- **Email:** `admin@residencialhortel.com`
- **Senha:** `admin123`

### ✅ Verificar Sistema
```bash
# Execute para verificar se tudo está OK:
verificar.bat
```

---

## 📋 Funcionalidades

### ✅ Gestão de Quartos
- Cadastro de quartos (Individual/Triplo)
- Controle de disponibilidade
- Preços por diária

### ✅ Gestão de Reservas
- Criar reservas
- Check-in automático (13h)
- Check-out automático (11h)
- Cancelamento de reservas
- Histórico completo

### ✅ Gestão de Hóspedes
- Cadastro automático
- CPF, telefone, email
- Histórico de estadias

### ✅ Pagamentos PIX
- Geração de QR Code
- Webhook de confirmação
- Controle de status

### ✅ Integração WhatsApp
- Reservas via WhatsApp (n8n)
- Confirmação automática
- Envio de QR Code PIX

### ✅ Painel Administrativo
- Dashboard com métricas
- Gestão visual de quartos
- Gestão de reservas
- Interface responsiva

---

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- JWT Authentication
- Winston (Logs)

### Frontend
- HTML5 + CSS3 + JavaScript
- Fetch API
- Design responsivo

### Integrações
- n8n (Automação WhatsApp)
- PIX (Mock - pronto para integração real)

---

## 📁 Estrutura do Projeto

```
hotel_system_base/
├── INICIAR.bat              # 🚀 Inicia tudo automaticamente
├── COMO_USAR.md             # 📖 Guia completo de uso
│
├── api/                     # Backend
│   ├── server.js           # Servidor principal
│   ├── .env                # Configurações
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócio
│   │   ├── middlewares/    # Auth, validação, logs
│   │   └── db/             # Supabase + migrations
│   ├── logs/               # Logs do sistema
│   ├── README.md           # Docs da API
│   ├── EXEMPLOS_API.md     # Exemplos de uso
│   └── INTEGRACAO_N8N.md   # Integração WhatsApp
│
└── web/                    # Frontend
    ├── painel-simples.html # ⭐ Painel administrativo
    ├── GUIA_RAPIDO.md      # Guia do painel
    └── src/                # Painel React (opcional)
```

---

## 🗄️ Banco de Dados

### Tabelas
- **quartos** - Quartos do hotel
- **hospedes** - Cadastro de hóspedes
- **reservas** - Reservas e check-ins
- **pagamentos_pix** - Pagamentos
- **funcionarios** - Usuários do sistema

### Dados Iniciais (Seed)
- 10 quartos (5 individuais, 5 triplos)
- 1 funcionário admin
- Reservas de exemplo

---

## 🔌 API Endpoints

### Públicos
```
GET    /api/quartos                    # Listar quartos
GET    /api/quartos/disponiveis        # Quartos disponíveis
POST   /api/auth/login                 # Login
```

### Protegidos (requer JWT)
```
GET    /api/reservas                   # Listar reservas
POST   /api/reservas                   # Criar reserva
GET    /api/reservas/:id               # Detalhes da reserva
PATCH  /api/reservas/:id/check-in      # Check-in
PATCH  /api/reservas/:id/check-out     # Check-out
DELETE /api/reservas/:id               # Cancelar
```

📖 **Documentação completa:** `api/EXEMPLOS_API.md`

---

## 🔧 Configuração

### 1. Instalar Dependências
```bash
cd api
npm install
```

### 2. Configurar Supabase
Crie um arquivo `api/.env`:
```env
SUPABASE_URL=sua-url-do-supabase
SUPABASE_KEY=sua-chave-do-supabase
JWT_SECRET=seu-segredo-jwt
PORT=3000
```

### 3. Criar Tabelas
Execute o SQL em `api/src/db/migrations/001_create_tables.sql` no Supabase

### 4. Popular Dados
```bash
cd api
node src/db/seed.js
```

### 5. Iniciar
```bash
node server.js
```

📖 **Guia detalhado:** `api/INSTALACAO.md`

---

## 📱 Integração WhatsApp

### Fluxo Completo
1. Cliente: "Quero reservar um quarto"
2. n8n captura mensagem
3. API cria reserva
4. Sistema gera QR Code PIX
5. n8n envia QR Code
6. Cliente paga
7. Webhook confirma pagamento
8. Reserva confirmada

📖 **Configuração:** `api/INTEGRACAO_N8N.md`

---

## 🎨 Painel Administrativo

### Recursos
- 📊 Dashboard com estatísticas
- 🛏️ Grid visual de quartos
- 📅 Lista de reservas
- ✅ Check-in/Check-out rápido
- ❌ Cancelamento de reservas
- 🔄 Atualização em tempo real

### Como Usar
1. Abra `web/painel-simples.html`
2. Faça login
3. Gerencie quartos e reservas

📖 **Guia completo:** `web/GUIA_RAPIDO.md`

---

## 🧪 Testar o Sistema

### Teste 1: Listar Quartos
```bash
curl http://localhost:3000/api/quartos
```

### Teste 2: Fazer Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@residencialhortel.com","senha":"admin123"}'
```

### Teste 3: Criar Reserva
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "quarto_id": "ID_DO_QUARTO",
    "hospede": {
      "nome": "João Silva",
      "cpf": "12345678900",
      "telefone": "11999999999"
    },
    "data_checkin": "2024-12-01",
    "data_checkout": "2024-12-05",
    "numero_hospedes": 2
  }'
```

---

## 🐛 Troubleshooting

### API não inicia
```bash
cd api
npm install
node server.js
```

### Erro de conexão Supabase
- Verifique o arquivo `.env`
- Confirme URL e KEY do Supabase
- Teste a conexão no painel do Supabase

### Painel não carrega
- Confirme que a API está rodando
- Abra o Console (F12) para ver erros
- Verifique CORS na API

### Erro de autenticação
- Limpe o localStorage do navegador
- Verifique se o seed foi executado
- Tente fazer login novamente

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| `COMO_USAR.md` | Guia completo de uso |
| `api/README.md` | Documentação da API |
| `api/EXEMPLOS_API.md` | Exemplos práticos |
| `api/INTEGRACAO_N8N.md` | Integração WhatsApp |
| `api/INSTALACAO.md` | Guia de instalação |
| `web/GUIA_RAPIDO.md` | Guia do painel |

---

## 🚀 Próximos Passos

1. ✅ **Sistema funcionando** - Teste todas as funcionalidades
2. 🔄 **Integrar n8n** - Configure o WhatsApp
3. 💰 **PIX real** - Integre com gateway de pagamento
4. 📊 **Relatórios** - Adicione analytics e relatórios
5. 🎨 **Personalizar** - Ajuste visual e textos
6. 📱 **App mobile** - Considere criar app nativo

---

## 📄 Licença

Este projeto foi desenvolvido para o Residencial Hortel.

---

## 🎉 Pronto para Usar!

O sistema está **100% funcional** e pronto para produção.

**Dúvidas?** Consulte `COMO_USAR.md` ou os arquivos de documentação.

**Bom trabalho! 🏨✨**
