# 📡 Exemplos de Requisições - API Residencial Hortel

## 🔐 Autenticação

### Login de Funcionário

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@residencialhortel.com",
    "senha": "admin123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "funcionario": {
    "id": "uuid",
    "nome": "Administrador",
    "email": "admin@residencialhortel.com",
    "ativo": true
  }
}
```

### Verificar Token

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🏨 Quartos

### Listar Todos os Quartos

```bash
curl http://localhost:3000/api/quartos
```

### Listar Quartos Disponíveis para Data Específica

```bash
curl "http://localhost:3000/api/quartos?data=2024-12-01&pessoas=1"
```

### Filtrar Quartos por Tipo

```bash
# Apenas individuais
curl "http://localhost:3000/api/quartos?tipo=INDIVIDUAL"

# Apenas triplos
curl "http://localhost:3000/api/quartos?tipo=TRIPLO"
```

### Detalhes de um Quarto

```bash
curl http://localhost:3000/api/quartos/ID_DO_QUARTO
```

## 📅 Reservas

### Criar Nova Reserva (Público - para N8N)

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

**Resposta:**
```json
{
  "reserva": {
    "id": "uuid",
    "hospede_id": "uuid",
    "quarto_id": "uuid",
    "data_checkin": "2024-12-01",
    "data_checkout": "2024-12-02",
    "numero_pessoas": 1,
    "valor_total": 80.00,
    "status": "PENDENTE",
    "hospede": {
      "nome": "João Silva",
      "telefone": "+5511999999999"
    },
    "quarto": {
      "numero": 1,
      "tipo": "INDIVIDUAL"
    }
  },
  "pix": {
    "qrCode": "data:image/png;base64,...",
    "copiaECola": "00020126580014br.gov.bcb.pix...",
    "valor": 80.00,
    "txid": "uuid"
  }
}
```

### Listar Todas as Reservas (Requer Auth)

```bash
curl http://localhost:3000/api/reservas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Filtrar Reservas por Status

```bash
# Apenas pendentes
curl "http://localhost:3000/api/reservas?status=PENDENTE" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Apenas confirmadas
curl "http://localhost:3000/api/reservas?status=CONFIRMADA" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Em andamento
curl "http://localhost:3000/api/reservas?status=EM_ANDAMENTO" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Detalhes de uma Reserva

```bash
curl http://localhost:3000/api/reservas/ID_DA_RESERVA \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Realizar Check-in

```bash
curl -X PATCH http://localhost:3000/api/reservas/ID_DA_RESERVA/check-in \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Realizar Check-out

```bash
curl -X PATCH http://localhost:3000/api/reservas/ID_DA_RESERVA/check-out \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Cancelar Reserva

```bash
curl -X DELETE http://localhost:3000/api/reservas/ID_DA_RESERVA \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 💰 Webhook PIX

### Simular Confirmação de Pagamento

```bash
curl -X POST http://localhost:3000/api/webhooks/pix \
  -H "Content-Type: application/json" \
  -d '{
    "txid": "TXID_DO_PAGAMENTO",
    "valor": 80.00,
    "status": "PAGO"
  }'
```

## 🏥 Health Check

```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

## 📋 Fluxo Completo de Reserva

### 1. Cliente solicita reserva via WhatsApp
```bash
# N8N chama a API
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "hospedeNome": "Maria Santos",
    "hospedeTelefone": "+5511988888888",
    "dataCheckin": "2024-12-10",
    "numeroPessoas": 2
  }'
```

### 2. Sistema retorna QR Code PIX
```json
{
  "reserva": { ... },
  "pix": {
    "qrCode": "...",
    "copiaECola": "...",
    "txid": "abc-123"
  }
}
```

### 3. Cliente paga via PIX
```bash
# Provedor PIX chama webhook
curl -X POST http://localhost:3000/api/webhooks/pix \
  -H "Content-Type: application/json" \
  -d '{
    "txid": "abc-123",
    "valor": 150.00,
    "status": "PAGO"
  }'
```

### 4. Funcionário visualiza reserva confirmada
```bash
curl http://localhost:3000/api/reservas \
  -H "Authorization: Bearer TOKEN"
```

### 5. No dia do check-in, funcionário registra entrada
```bash
curl -X PATCH http://localhost:3000/api/reservas/ID/check-in \
  -H "Authorization: Bearer TOKEN"
```

### 6. No dia do check-out, funcionário registra saída
```bash
curl -X PATCH http://localhost:3000/api/reservas/ID/check-out \
  -H "Authorization: Bearer TOKEN"
```

## 🧪 Testando com Postman/Insomnia

### Importar Collection

Crie uma collection com as seguintes variáveis:
- `base_url`: http://localhost:3000
- `token`: (preencher após login)

### Ordem de Testes

1. **Health Check** - Verificar se API está rodando
2. **Login** - Obter token
3. **Listar Quartos** - Ver quartos disponíveis
4. **Criar Reserva** - Simular reserva via WhatsApp
5. **Webhook PIX** - Simular confirmação de pagamento
6. **Listar Reservas** - Ver reserva confirmada
7. **Check-in** - Registrar entrada
8. **Check-out** - Registrar saída

## 🐛 Tratamento de Erros

### Erro 400 - Validação

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos fornecidos",
    "details": [
      {
        "field": "numeroPessoas",
        "message": "Número de pessoas deve ser no mínimo 1"
      }
    ],
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/reservas"
  }
}
```

### Erro 401 - Não Autenticado

```json
{
  "error": {
    "code": "NO_TOKEN",
    "message": "Token de autenticação não fornecido",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Erro 404 - Não Encontrado

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Reserva não encontrada",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/reservas/invalid-id"
  }
}
```

### Erro 409 - Conflito

```json
{
  "error": {
    "code": "NO_AVAILABILITY",
    "message": "Não há quartos disponíveis para o período solicitado",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 💡 Dicas

1. **Sempre salve o token** após o login para usar nas requisições autenticadas
2. **Use variáveis de ambiente** no Postman/Insomnia para facilitar os testes
3. **Verifique os logs** em `logs/combined.log` para debug
4. **Teste o health check** primeiro para garantir que a API está rodando
5. **Use o seed** para popular o banco antes de testar

## 📞 Suporte

Para mais informações, consulte:
- `README.md` - Documentação completa
- `INSTALACAO.md` - Guia de instalação
- `RESUMO_IMPLEMENTACAO.md` - Detalhes da implementação
