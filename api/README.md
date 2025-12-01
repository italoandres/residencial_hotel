# Residencial Hortel - API

Sistema de gestão hoteleira com foco em trabalhadores.

## Instalação

```bash
npm install
```

## Configuração

1. Copie `.env.example` para `.env`
2. Configure as variáveis de ambiente com suas credenciais do Supabase
3. Execute as migrations SQL no Supabase (ver `src/db/migrations/`)

## Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Testes
npm test
```

## Estrutura

- `src/server.js` - Servidor Express principal
- `src/routes/` - Rotas da API
- `src/services/` - Lógica de negócio
- `src/middlewares/` - Middlewares (auth, validation, error handling)
- `src/db/` - Conexão com banco e migrations
- `src/utils/` - Funções utilitárias

## Endpoints

### Autenticação
- `POST /api/auth/login` - Login de funcionário
- `POST /api/auth/verify` - Verificar token

### Quartos
- `GET /api/quartos` - Listar quartos (com filtros opcionais)
- `GET /api/quartos/:id` - Detalhes de um quarto

### Reservas
- `POST /api/reservas` - Criar pré-reserva
- `GET /api/reservas` - Listar reservas (requer auth)
- `GET /api/reservas/:id` - Detalhes de reserva (requer auth)
- `PATCH /api/reservas/:id/check-in` - Realizar check-in (requer auth)
- `PATCH /api/reservas/:id/check-out` - Realizar check-out (requer auth)
- `DELETE /api/reservas/:id` - Cancelar reserva (requer auth)

### Webhooks
- `POST /api/webhooks/pix` - Confirmação de pagamento PIX

### Health
- `GET /health` - Status da API
