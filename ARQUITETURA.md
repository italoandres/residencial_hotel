# 🏗️ Arquitetura do Sistema - Residencial Hortel

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA RESIDENCIAL HORTEL                │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   WhatsApp   │      │    Painel    │      │   API REST   │
│   (Cliente)  │─────▶│     Admin    │─────▶│   (Backend)  │
│              │      │  (Frontend)  │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
       │                                             │
       │                                             │
       ▼                                             ▼
┌──────────────┐                            ┌──────────────┐
│     n8n      │                            │   Supabase   │
│  (Automação) │───────────────────────────▶│ (PostgreSQL) │
└──────────────┘                            └──────────────┘
```

---

## 🔄 Fluxo de Dados

### 1. Reserva via WhatsApp
```
Cliente WhatsApp
    │
    ├─ Envia mensagem: "Quero reservar"
    │
    ▼
n8n Workflow
    │
    ├─ Captura mensagem
    ├─ Extrai informações
    ├─ Valida dados
    │
    ▼
API POST /api/reservas
    │
    ├─ Valida disponibilidade
    ├─ Cria hóspede
    ├─ Cria reserva (status: PENDENTE)
    ├─ Gera QR Code PIX
    │
    ▼
n8n recebe resposta
    │
    ├─ Envia QR Code para cliente
    │
    ▼
Cliente paga PIX
    │
    ▼
Webhook PIX
    │
    ├─ POST /api/webhooks/pix
    ├─ Valida pagamento
    ├─ Atualiza status: CONFIRMADA
    │
    ▼
n8n notifica cliente
    │
    └─ "Reserva confirmada! ✅"
```

### 2. Gestão via Painel Admin
```
Funcionário
    │
    ├─ Acessa painel-simples.html
    │
    ▼
Login
    │
    ├─ POST /api/auth/login
    ├─ Recebe JWT token
    │
    ▼
Dashboard
    │
    ├─ GET /api/quartos (estatísticas)
    ├─ GET /api/reservas (lista)
    │
    ▼
Ações
    │
    ├─ Check-in: PATCH /api/reservas/:id/check-in
    ├─ Check-out: PATCH /api/reservas/:id/check-out
    └─ Cancelar: DELETE /api/reservas/:id
```

---

## 🗄️ Estrutura do Banco de Dados

```
┌─────────────────┐
│   funcionarios  │
├─────────────────┤
│ id (PK)         │
│ nome            │
│ email (UNIQUE)  │
│ senha_hash      │
│ cargo           │
└─────────────────┘

┌─────────────────┐
│     quartos     │
├─────────────────┤
│ id (PK)         │
│ numero (UNIQUE) │
│ tipo            │
│ capacidade      │
│ preco_diaria    │
│ ativo           │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐       ┌─────────────────┐
│    reservas     │──────▶│    hospedes     │
├─────────────────┤  N:1  ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ quarto_id (FK)  │       │ nome            │
│ hospede_id (FK) │       │ cpf (UNIQUE)    │
│ data_checkin    │       │ telefone        │
│ data_checkout   │       │ email           │
│ status          │       └─────────────────┘
│ valor_total     │
│ numero_hospedes │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│ pagamentos_pix  │
├─────────────────┤
│ id (PK)         │
│ reserva_id (FK) │
│ valor           │
│ qr_code         │
│ status          │
│ pago_em         │
└─────────────────┘
```

---

## 📁 Estrutura de Arquivos

```
hotel_system_base/
│
├── 🚀 INICIAR.bat                    # Script de inicialização
├── 📖 README.md                      # Documentação principal
├── 📋 COMO_USAR.md                   # Guia de uso
├── ✅ CHECKLIST.md                   # Checklist de verificação
├── 🏗️ ARQUITETURA.md                # Este arquivo
│
├── api/                              # Backend
│   │
│   ├── 🎯 server.js                  # Entry point
│   ├── 🔐 .env                       # Configurações
│   ├── 📦 package.json               # Dependências
│   │
│   ├── src/
│   │   │
│   │   ├── routes/                   # Rotas da API
│   │   │   ├── auth.routes.js        # Autenticação
│   │   │   ├── quartos.routes.js     # Quartos
│   │   │   ├── reservas.routes.js    # Reservas
│   │   │   └── webhooks.routes.js    # Webhooks PIX
│   │   │
│   │   ├── services/                 # Lógica de negócio
│   │   │   ├── auth.service.js       # Login/registro
│   │   │   ├── reserva.service.js    # Gestão de reservas
│   │   │   ├── hospede.service.js    # Gestão de hóspedes
│   │   │   ├── pix.service.js        # Pagamentos PIX
│   │   │   └── disponibilidade.service.js  # Disponibilidade
│   │   │
│   │   ├── middlewares/              # Middlewares
│   │   │   ├── auth.js               # Verificação JWT
│   │   │   ├── validation.js         # Validação de dados
│   │   │   ├── errorHandler.js       # Tratamento de erros
│   │   │   └── requestLogger.js      # Logs de requisições
│   │   │
│   │   ├── db/                       # Banco de dados
│   │   │   ├── supabase.js           # Cliente Supabase
│   │   │   ├── seed.js               # Dados iniciais
│   │   │   └── migrations/
│   │   │       └── 001_create_tables.sql  # Schema
│   │   │
│   │   └── utils/                    # Utilitários
│   │       └── sanitize.js           # Sanitização
│   │
│   ├── logs/                         # Logs do sistema
│   │   ├── combined.log              # Todos os logs
│   │   └── error.log                 # Apenas erros
│   │
│   └── 📚 Documentação
│       ├── README.md                 # Docs da API
│       ├── EXEMPLOS_API.md           # Exemplos práticos
│       ├── INTEGRACAO_N8N.md         # Integração WhatsApp
│       └── INSTALACAO.md             # Guia de instalação
│
└── web/                              # Frontend
    │
    ├── ⭐ painel-simples.html        # Painel administrativo
    ├── 📖 GUIA_RAPIDO.md             # Guia do painel
    │
    └── src/                          # Painel React (opcional)
        ├── App.jsx
        ├── main.jsx
        ├── components/
        ├── contexts/
        ├── pages/
        └── services/
```

---

## 🔐 Fluxo de Autenticação

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, senha }
       │
       ▼
┌─────────────────────────┐
│   Middleware Validation │
│   - Valida formato      │
│   - Sanitiza inputs     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   Auth Service          │
│   - Busca funcionário   │
│   - Compara senha hash  │
│   - Gera JWT token      │
└──────────┬──────────────┘
           │
           │ 2. Retorna
           │    { token, funcionario }
           │
           ▼
┌─────────────┐
│   Cliente   │
│   Salva     │
│   token no  │
│   localStorage
└──────┬──────┘
       │
       │ 3. Requisições futuras
       │    Authorization: Bearer <token>
       │
       ▼
┌─────────────────────────┐
│   Middleware Auth       │
│   - Verifica token      │
│   - Decodifica JWT      │
│   - Adiciona user ao req│
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   Route Handler         │
│   - Acessa req.user     │
│   - Processa requisição │
└─────────────────────────┘
```

---

## 🎯 Endpoints da API

### Públicos (sem autenticação)
```
GET    /api/quartos
GET    /api/quartos/disponiveis
POST   /api/auth/login
POST   /api/auth/register
POST   /api/webhooks/pix
```

### Protegidos (requer JWT)
```
GET    /api/reservas
POST   /api/reservas
GET    /api/reservas/:id
PATCH  /api/reservas/:id/check-in
PATCH  /api/reservas/:id/check-out
DELETE /api/reservas/:id
GET    /api/hospedes
GET    /api/hospedes/:id
```

---

## 🔄 Estados de Reserva

```
┌──────────┐
│ PENDENTE │  ← Criada, aguardando pagamento
└────┬─────┘
     │
     │ Pagamento confirmado
     │
     ▼
┌────────────┐
│ CONFIRMADA │  ← Paga, aguardando check-in
└────┬───────┘
     │
     │ Check-in realizado
     │
     ▼
┌──────────────┐
│ EM_ANDAMENTO │  ← Hóspede no hotel
└────┬─────────┘
     │
     │ Check-out realizado
     │
     ▼
┌────────────┐
│ FINALIZADA │  ← Concluída
└────────────┘

     ❌ Cancelamento possível em:
        - PENDENTE
        - CONFIRMADA
```

---

## 🛡️ Camadas de Segurança

```
┌─────────────────────────────────────┐
│         1. Validação Input          │
│  - Joi schemas                      │
│  - Sanitização XSS                  │
│  - Validação de tipos               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         2. Autenticação             │
│  - JWT tokens                       │
│  - Bcrypt password hashing          │
│  - Token expiration                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         3. Autorização              │
│  - Role-based access                │
│  - Resource ownership               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         4. Banco de Dados           │
│  - Prepared statements (Supabase)   │
│  - Foreign key constraints          │
│  - Unique constraints               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         5. Logs e Monitoramento     │
│  - Winston logging                  │
│  - Error tracking                   │
│  - Request logging                  │
└─────────────────────────────────────┘
```

---

## 📊 Tecnologias e Dependências

### Backend
```
Node.js 14+
├── express          # Framework web
├── @supabase/supabase-js  # Cliente PostgreSQL
├── jsonwebtoken     # Autenticação JWT
├── bcryptjs         # Hash de senhas
├── joi              # Validação de schemas
├── winston          # Logging
├── cors             # CORS
└── dotenv           # Variáveis de ambiente
```

### Frontend
```
HTML5 + CSS3 + JavaScript (Vanilla)
├── Fetch API        # Requisições HTTP
├── LocalStorage     # Armazenamento local
└── CSS Grid/Flexbox # Layout responsivo
```

### Banco de Dados
```
Supabase (PostgreSQL 14+)
├── UUID             # IDs únicos
├── Timestamps       # created_at, updated_at
├── Foreign Keys     # Integridade referencial
└── Indexes          # Performance
```

---

## 🚀 Fluxo de Deploy (Futuro)

```
┌──────────────┐
│ Desenvolvimento │
│  localhost     │
└───────┬────────┘
        │
        │ git push
        │
        ▼
┌──────────────┐
│   GitHub     │
│  Repository  │
└───────┬──────┘
        │
        │ CI/CD
        │
        ▼
┌──────────────┐
│   Staging    │
│   Testes     │
└───────┬──────┘
        │
        │ Aprovação
        │
        ▼
┌──────────────┐
│  Production  │
│   - API: Heroku/Railway/Render
│   - DB: Supabase
│   - Frontend: Vercel/Netlify
└──────────────┘
```

---

## 📈 Escalabilidade

### Atual (MVP)
- ✅ Suporta ~100 quartos
- ✅ Suporta ~1000 reservas/mês
- ✅ 1 servidor API
- ✅ Supabase free tier

### Futuro (Crescimento)
- 🔄 Load balancer
- 🔄 Multiple API instances
- 🔄 Redis cache
- 🔄 CDN para assets
- 🔄 Supabase Pro
- 🔄 Backup automático
- 🔄 Monitoring (Sentry, DataDog)

---

## 🎯 Próximas Melhorias

### Curto Prazo
1. ✅ Sistema funcionando
2. 🔄 Integração n8n completa
3. 🔄 PIX real (Mercado Pago/PagSeguro)
4. 🔄 Relatórios básicos

### Médio Prazo
1. 📊 Dashboard analytics
2. 📧 Email notifications
3. 📱 App mobile (React Native)
4. 🔔 Push notifications

### Longo Prazo
1. 🤖 IA para previsão de ocupação
2. 🌐 Multi-idioma
3. 💳 Múltiplos métodos de pagamento
4. 🏢 Multi-propriedade

---

**Documentação criada em:** Novembro 2024  
**Versão do sistema:** 1.0.0  
**Status:** ✅ Produção
