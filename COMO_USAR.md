# 🏨 Sistema Residencial Hortel - Como Usar

## 🎯 Início Rápido (2 passos)

### 1️⃣ Inicie a API
```bash
cd api
node server.js
```
✅ API rodando em `http://localhost:3000`

### 2️⃣ Abra o Painel
Abra no navegador: `web/painel-simples.html`

**Pronto! O sistema está funcionando! 🎉**

---

## 📋 O que você pode fazer agora

### No Painel Administrativo:
- ✅ Ver todos os quartos disponíveis
- ✅ Ver todas as reservas
- ✅ Fazer check-in de hóspedes
- ✅ Fazer check-out de hóspedes
- ✅ Cancelar reservas

### Credenciais de Login:
- **Email:** admin@residencialhortel.com
- **Senha:** admin123

---

## 🔄 Fluxo Completo de Uso

### Cenário 1: Reserva Manual via API
```bash
# Criar uma reserva
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "quarto_id": "cole-o-id-de-um-quarto-aqui",
    "hospede": {
      "nome": "Maria Silva",
      "cpf": "12345678900",
      "telefone": "11999999999",
      "email": "maria@email.com"
    },
    "data_checkin": "2024-12-01",
    "data_checkout": "2024-12-05",
    "numero_hospedes": 2
  }'
```

### Cenário 2: Reserva via WhatsApp (com n8n)
1. Cliente envia mensagem no WhatsApp
2. n8n captura e processa
3. Sistema cria reserva automaticamente
4. Gera QR Code PIX
5. Cliente paga
6. Sistema confirma reserva

📖 Veja `api/INTEGRACAO_N8N.md` para configurar

---

## 📊 Estrutura do Sistema

```
hotel_system_base/
├── api/                    # Backend (Node.js + Express)
│   ├── server.js          # Servidor principal
│   ├── src/
│   │   ├── routes/        # Rotas da API
│   │   ├── services/      # Lógica de negócio
│   │   ├── middlewares/   # Autenticação, validação
│   │   └── db/            # Conexão Supabase
│   └── .env               # Configurações (Supabase)
│
└── web/                   # Frontend
    ├── painel-simples.html  # ⭐ Painel recomendado
    └── src/                 # Painel React (opcional)
```

---

## 🗄️ Banco de Dados

O sistema usa **Supabase (PostgreSQL)** com as seguintes tabelas:

- **quartos** - Informações dos quartos (número, tipo, preço)
- **hospedes** - Dados dos hóspedes
- **reservas** - Reservas e status
- **pagamentos_pix** - Pagamentos PIX
- **funcionarios** - Usuários do sistema

### Dados de Exemplo (Seed)
O banco já vem populado com:
- 10 quartos (5 individuais, 5 triplos)
- 1 funcionário admin
- Algumas reservas de exemplo

---

## 🔌 API Endpoints Principais

### Públicos (sem autenticação)
- `GET /api/quartos` - Listar quartos
- `GET /api/quartos/disponiveis` - Quartos disponíveis
- `POST /api/auth/login` - Login

### Protegidos (requer token JWT)
- `GET /api/reservas` - Listar reservas
- `POST /api/reservas` - Criar reserva
- `PATCH /api/reservas/:id/check-in` - Check-in
- `PATCH /api/reservas/:id/check-out` - Check-out
- `DELETE /api/reservas/:id` - Cancelar

📖 Veja todos os endpoints em `api/EXEMPLOS_API.md`

---

## 🎨 Recursos do Painel

### Dashboard
- Total de quartos
- Quartos disponíveis
- Reservas ativas

### Gestão de Quartos
- Grid visual de todos os quartos
- Informações: número, tipo, capacidade, preço
- Badges coloridos por tipo

### Gestão de Reservas
- Lista completa com filtros
- Informações do hóspede
- Datas e valores
- Botões de ação contextuais:
  - ✅ Check-in (reservas confirmadas)
  - ✅ Check-out (reservas em andamento)
  - ❌ Cancelar (reservas pendentes/confirmadas)

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente (.env)
```env
SUPABASE_URL=sua-url-do-supabase
SUPABASE_KEY=sua-chave-do-supabase
JWT_SECRET=seu-segredo-jwt
PORT=3000
```

### Horários de Check-in/Check-out
Configurados em `api/src/services/disponibilidade.service.js`:
- Check-in: 13:00
- Check-out: 11:00

---

## 🐛 Problemas Comuns

### API não inicia
```bash
cd api
npm install
node server.js
```

### Painel não carrega dados
1. Verifique se a API está rodando
2. Abra o Console do navegador (F12)
3. Veja se há erros de conexão

### Erro de autenticação
1. Verifique as credenciais
2. Limpe o localStorage do navegador
3. Tente fazer login novamente

---

## 📱 Próximos Passos

1. ✅ **Testar o sistema** - Crie reservas, faça check-in/out
2. 🔄 **Integrar WhatsApp** - Configure o n8n
3. 💰 **Configurar PIX real** - Substitua o mock por API real
4. 📊 **Adicionar relatórios** - Faturamento, ocupação
5. 🎨 **Personalizar** - Ajuste cores, logo, textos

---

## 📚 Documentação Completa

- `api/README.md` - Documentação da API
- `api/EXEMPLOS_API.md` - Exemplos de uso
- `api/INTEGRACAO_N8N.md` - Integração WhatsApp
- `api/INSTALACAO.md` - Guia de instalação
- `web/GUIA_RAPIDO.md` - Guia do painel

---

## 🎉 Pronto para Usar!

O sistema está **100% funcional** e pronto para gerenciar seu hotel.

**Dúvidas?** Consulte os arquivos de documentação ou verifique os logs em `api/logs/`

**Bom trabalho! 🏨✨**
