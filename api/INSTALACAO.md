# 🏨 Residencial Hortel - Guia de Instalação

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Editor de código (VS Code recomendado)

## 🚀 Passo a Passo

### 1. Instalar Dependências

```bash
cd api
npm install
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote a URL e a chave API (anon key)

### 3. Executar Migrations SQL

1. No painel do Supabase, vá em "SQL Editor"
2. Execute o arquivo `src/db/migrations/001_create_tables.sql`
3. Execute o arquivo `src/db/migrations/002_seed_data.sql`

OU use o script de seed:

```bash
# Primeiro configure o .env (passo 4)
node src/db/seed.js
```

### 4. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha com suas credenciais:

```env
# Database
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-key-aqui

# JWT
JWT_SECRET=gere-um-secret-aleatorio-seguro-aqui
JWT_EXPIRATION=24h

# Application
PORT=3000
NODE_ENV=development
```

**Dica:** Para gerar um JWT_SECRET seguro, use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Executar o Servidor

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

### 6. Testar a API

Acesse: http://localhost:3000

Você deve ver:
```json
{
  "message": "API Residencial Hortel",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### 7. Fazer Login no Painel Admin

**Credenciais padrão:**
- Email: `admin@residencialhortel.com`
- Senha: `admin123`

⚠️ **IMPORTANTE:** Altere esta senha após o primeiro login!

## 🧪 Testar Endpoints

### Criar Reserva (Simular WhatsApp/N8N)

```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "hospedeNome": "João Silva",
    "hospedeTelefone": "+5511999999999",
    "dataCheckin": "2024-12-01",
    "numeroPessoas": 1
  }'
```

### Login de Funcionário

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@residencialhortel.com",
    "senha": "admin123"
  }'
```

### Listar Quartos Disponíveis

```bash
curl "http://localhost:3000/api/quartos?data=2024-12-01&pessoas=1"
```

## 📁 Estrutura do Projeto

```
api/
├── src/
│   ├── db/
│   │   ├── supabase.js          # Cliente Supabase
│   │   ├── seed.js              # Script de seed
│   │   └── migrations/          # Migrations SQL
│   ├── middlewares/
│   │   ├── auth.js              # Autenticação JWT
│   │   ├── validation.js        # Validação com Joi
│   │   ├── errorHandler.js      # Tratamento de erros
│   │   └── requestLogger.js     # Log de requisições
│   ├── routes/
│   │   ├── auth.routes.js       # Rotas de autenticação
│   │   ├── quartos.routes.js    # Rotas de quartos
│   │   ├── reservas.routes.js   # Rotas de reservas
│   │   └── webhooks.routes.js   # Webhooks PIX
│   ├── services/
│   │   ├── auth.service.js      # Lógica de autenticação
│   │   ├── hospede.service.js   # Lógica de hóspedes
│   │   ├── disponibilidade.service.js  # Lógica de disponibilidade
│   │   ├── pix.service.js       # Lógica PIX
│   │   └── reserva.service.js   # Lógica de reservas
│   ├── utils/
│   │   ├── AppError.js          # Classe de erro customizada
│   │   ├── logger.js            # Configuração Winston
│   │   └── sanitize.js          # Sanitização de inputs
│   └── server.js                # Servidor Express
├── package.json
├── .env.example
└── README.md
```

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start

# Executar testes
npm test

# Popular banco de dados
node src/db/seed.js
```

## 🐛 Troubleshooting

### Erro: "SUPABASE_URL e SUPABASE_KEY devem estar definidos"
- Verifique se o arquivo `.env` existe e está configurado corretamente

### Erro: "Falha ao conectar com Supabase"
- Verifique se a URL e a chave do Supabase estão corretas
- Verifique se as migrations SQL foram executadas

### Erro: "Port 3000 already in use"
- Altere a porta no arquivo `.env`: `PORT=3001`

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação completa no README.md
