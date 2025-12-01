# 🏨 Guia Rápido - Residencial Hortel

## Como Usar o Sistema

### 1️⃣ Iniciar a API (Backend)
```bash
cd api
node server.js
```
A API estará rodando em: `http://localhost:3000`

### 2️⃣ Abrir o Painel Administrativo
Abra o arquivo no navegador:
```
web/painel-simples.html
```

Ou use um servidor local:
```bash
cd web
npx serve .
```

### 3️⃣ Credenciais de Acesso
- **Email:** admin@residencialhortel.com
- **Senha:** admin123

## Funcionalidades Disponíveis

### 📊 Dashboard
- Visualização de estatísticas em tempo real
- Total de quartos
- Quartos disponíveis
- Reservas ativas

### 🛏️ Gestão de Quartos
- Visualização de todos os quartos
- Informações: número, tipo, capacidade, preço
- Status de disponibilidade

### 📅 Gestão de Reservas
- Lista completa de reservas
- Informações do hóspede
- Datas de check-in/check-out
- Valor total
- Ações disponíveis:
  - ✅ **Check-in** (para reservas confirmadas)
  - ✅ **Check-out** (para reservas em andamento)
  - ❌ **Cancelar** (para reservas pendentes/confirmadas)

## API Endpoints Principais

### Quartos
- `GET /api/quartos` - Listar todos os quartos
- `GET /api/quartos/disponiveis` - Quartos disponíveis

### Reservas
- `GET /api/reservas` - Listar reservas (requer autenticação)
- `POST /api/reservas` - Criar nova reserva
- `PATCH /api/reservas/:id/check-in` - Fazer check-in
- `PATCH /api/reservas/:id/check-out` - Fazer check-out
- `DELETE /api/reservas/:id` - Cancelar reserva

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrar novo funcionário

## Integração WhatsApp (via n8n)

O sistema está preparado para receber reservas via WhatsApp. Veja o arquivo `api/INTEGRACAO_N8N.md` para detalhes.

### Fluxo de Reserva via WhatsApp:
1. Cliente envia mensagem no WhatsApp
2. n8n processa e cria reserva via API
3. Sistema gera QR Code PIX
4. Cliente paga e confirma
5. Webhook atualiza status da reserva

## Estrutura do Banco de Dados

### Tabelas:
- **quartos** - Informações dos quartos
- **hospedes** - Dados dos hóspedes
- **reservas** - Reservas e check-ins/outs
- **pagamentos_pix** - Pagamentos PIX
- **funcionarios** - Usuários do sistema

## Dicas de Uso

### Testar o Sistema
1. Abra o painel HTML
2. Veja os quartos disponíveis
3. Crie uma reserva via API ou n8n
4. Faça check-in pelo painel
5. Faça check-out quando finalizar

### Criar Reserva Manual (via API)
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "quarto_id": "uuid-do-quarto",
    "hospede": {
      "nome": "João Silva",
      "cpf": "12345678900",
      "telefone": "11999999999",
      "email": "joao@email.com"
    },
    "data_checkin": "2024-01-15",
    "data_checkout": "2024-01-20",
    "numero_hospedes": 2
  }'
```

## Troubleshooting

### API não inicia
- Verifique se o arquivo `.env` existe em `api/`
- Confirme as credenciais do Supabase
- Rode: `npm install` na pasta `api/`

### Painel não carrega dados
- Confirme que a API está rodando
- Abra o Console do navegador (F12) para ver erros
- Verifique se a URL da API está correta (localhost:3000)

### Erro de CORS
- A API já está configurada para aceitar requisições do frontend
- Se usar outro domínio, ajuste em `api/src/server.js`

## Próximos Passos

1. ✅ Sistema básico funcionando
2. 🔄 Integrar com n8n para WhatsApp
3. 📱 Testar fluxo completo de reserva
4. 💰 Configurar PIX real (substituir mock)
5. 📊 Adicionar relatórios e analytics

## Suporte

Para dúvidas ou problemas:
- Verifique os logs em `api/logs/`
- Consulte a documentação em `api/README.md`
- Veja exemplos de API em `api/EXEMPLOS_API.md`
