# 🤖 Integração N8N + WhatsApp - Residencial Hortel

## 📋 Visão Geral

Este guia explica como integrar o sistema com N8N para automatizar reservas via WhatsApp.

## 🎯 Fluxo da Integração

```
WhatsApp → N8N → API Residencial Hortel → Supabase
    ↓                                          ↓
Cliente ← N8N ← Webhook PIX ← Provedor PIX ← API
```

## 🔧 Configuração do N8N

### 1. Instalar N8N

```bash
npm install -g n8n
# ou
npx n8n
```

### 2. Criar Workflow de Reserva

#### Nó 1: WhatsApp Trigger
- **Tipo:** WhatsApp Business API ou Twilio
- **Evento:** Mensagem recebida
- **Filtro:** Mensagens que contenham palavras-chave como "reserva", "quarto", "hotel"

#### Nó 2: Extrair Dados da Mensagem
- **Tipo:** Function ou Code
- **Objetivo:** Extrair nome, telefone, data e número de pessoas

```javascript
// Exemplo de extração
const mensagem = $input.item.json.message;
const telefone = $input.item.json.from;

// Parsear mensagem (exemplo simples)
// Formato esperado: "Quero reservar para 01/12/2024 para 1 pessoa. Meu nome é João Silva"
const regex = /(\d{2}\/\d{2}\/\d{4}).*?(\d+)\s*pessoa.*?nome.*?([A-Za-zÀ-ÿ\s]+)/i;
const match = mensagem.match(regex);

if (match) {
  return {
    json: {
      hospedeNome: match[3].trim(),
      hospedeTelefone: telefone,
      dataCheckin: match[1].split('/').reverse().join('-'), // Converter para YYYY-MM-DD
      numeroPessoas: parseInt(match[2])
    }
  };
}
```

#### Nó 3: HTTP Request - Criar Reserva
- **Método:** POST
- **URL:** `http://seu-servidor:3000/api/reservas`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body:**
  ```json
  {
    "hospedeNome": "{{ $json.hospedeNome }}",
    "hospedeTelefone": "{{ $json.hospedeTelefone }}",
    "dataCheckin": "{{ $json.dataCheckin }}",
    "numeroPessoas": {{ $json.numeroPessoas }}
  }
  ```

#### Nó 4: Verificar Resposta
- **Tipo:** IF
- **Condição:** Status Code = 201

#### Nó 5a: Sucesso - Enviar QR Code PIX
- **Tipo:** WhatsApp Send Message
- **Para:** `{{ $node["WhatsApp Trigger"].json.from }}`
- **Mensagem:**
  ```
  ✅ Reserva criada com sucesso!
  
  📋 Detalhes:
  - Quarto: {{ $json.reserva.quarto.numero }} ({{ $json.reserva.quarto.tipo }})
  - Check-in: {{ $json.reserva.data_checkin }}
  - Check-out: {{ $json.reserva.data_checkout }}
  - Valor: R$ {{ $json.reserva.valor_total }}
  
  💰 Para confirmar, pague via PIX:
  
  Código Copia e Cola:
  {{ $json.pix.copiaECola }}
  
  Ou escaneie o QR Code que enviarei a seguir.
  ```

#### Nó 5b: Enviar Imagem QR Code
- **Tipo:** WhatsApp Send Media
- **Para:** `{{ $node["WhatsApp Trigger"].json.from }}`
- **Tipo de Mídia:** Image
- **URL:** `{{ $json.pix.qrCode }}`

#### Nó 6: Erro - Informar Indisponibilidade
- **Tipo:** WhatsApp Send Message
- **Para:** `{{ $node["WhatsApp Trigger"].json.from }}`
- **Mensagem:**
  ```
  ❌ Desculpe, não há quartos disponíveis para a data solicitada.
  
  Por favor, tente outra data ou entre em contato conosco.
  ```

### 3. Criar Workflow de Confirmação PIX

#### Nó 1: Webhook Trigger
- **Tipo:** Webhook
- **Método:** POST
- **Path:** `/webhook-pix`
- **Resposta:** Return Data

#### Nó 2: HTTP Request - Notificar API
- **Método:** POST
- **URL:** `http://seu-servidor:3000/api/webhooks/pix`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body:**
  ```json
  {
    "txid": "{{ $json.txid }}",
    "valor": {{ $json.valor }},
    "status": "PAGO"
  }
  ```

#### Nó 3: Buscar Dados da Reserva
- **Tipo:** HTTP Request
- **Método:** GET
- **URL:** `http://seu-servidor:3000/api/reservas/{{ $json.reservaId }}`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer SEU_TOKEN_ADMIN"
  }
  ```

#### Nó 4: Enviar Confirmação ao Cliente
- **Tipo:** WhatsApp Send Message
- **Para:** `{{ $json.hospede.telefone }}`
- **Mensagem:**
  ```
  ✅ Pagamento confirmado!
  
  Sua reserva está CONFIRMADA! 🎉
  
  📋 Detalhes:
  - Quarto: {{ $json.quarto.numero }}
  - Check-in: {{ $json.data_checkin }} às 13h
  - Check-out: {{ $json.data_checkout }} às 11h
  
  📍 Endereço: [Seu endereço aqui]
  
  Aguardamos você! 😊
  ```

## 📱 Exemplo de Conversa WhatsApp

### Cliente:
```
Olá! Quero fazer uma reserva para o dia 15/12/2024 para 1 pessoa. 
Meu nome é João Silva.
```

### Bot (N8N):
```
✅ Reserva criada com sucesso!

📋 Detalhes:
- Quarto: 1 (INDIVIDUAL)
- Check-in: 2024-12-15
- Check-out: 2024-12-16
- Valor: R$ 80.00

💰 Para confirmar, pague via PIX:

Código Copia e Cola:
00020126580014br.gov.bcb.pix...

Ou escaneie o QR Code que enviarei a seguir.
```

### Bot (após pagamento):
```
✅ Pagamento confirmado!

Sua reserva está CONFIRMADA! 🎉

📋 Detalhes:
- Quarto: 1
- Check-in: 2024-12-15 às 13h
- Check-out: 2024-12-16 às 11h

📍 Endereço: Rua Exemplo, 123 - São Paulo

Aguardamos você! 😊
```

## 🔐 Segurança

### Validar Webhook PIX

No N8N, adicione validação de assinatura do webhook:

```javascript
// Nó de validação
const signature = $input.item.headers['x-signature'];
const payload = JSON.stringify($input.item.json);
const crypto = require('crypto');

const expectedSignature = crypto
  .createHmac('sha256', 'SEU_SECRET_WEBHOOK')
  .update(payload)
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Assinatura inválida');
}

return $input.item;
```

## 🎨 Melhorias Opcionais

### 1. Adicionar Menu Interativo

```javascript
// Nó inicial
const mensagem = $input.item.json.message.toLowerCase();

if (mensagem.includes('menu') || mensagem === 'oi' || mensagem === 'olá') {
  return {
    json: {
      resposta: `
🏨 Bem-vindo ao Residencial Hortel!

Escolha uma opção:
1️⃣ Fazer reserva
2️⃣ Consultar disponibilidade
3️⃣ Falar com atendente

Digite o número da opção desejada.
      `
    }
  };
}
```

### 2. Consultar Disponibilidade

```javascript
// Nó HTTP Request
{
  "method": "GET",
  "url": "http://seu-servidor:3000/api/quartos?data={{ $json.data }}&pessoas={{ $json.pessoas }}"
}
```

### 3. Lembretes Automáticos

Criar workflow que:
- Busca reservas confirmadas para amanhã
- Envia lembrete ao cliente via WhatsApp

```
🔔 Lembrete de Check-in

Olá {{ $json.hospede.nome }}!

Seu check-in é amanhã ({{ $json.data_checkin }}) às 13h.

Quarto: {{ $json.quarto.numero }}

Nos vemos em breve! 😊
```

## 🧪 Testar Integração

### 1. Testar Criação de Reserva

```bash
# Simular requisição do N8N
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "hospedeNome": "Teste N8N",
    "hospedeTelefone": "+5511999999999",
    "dataCheckin": "2024-12-20",
    "numeroPessoas": 1
  }'
```

### 2. Testar Webhook PIX

```bash
# Simular confirmação de pagamento
curl -X POST http://localhost:3000/api/webhooks/pix \
  -H "Content-Type: application/json" \
  -d '{
    "txid": "TXID_TESTE",
    "valor": 80.00,
    "status": "PAGO"
  }'
```

## 📊 Monitoramento

### Logs no N8N
- Ativar logs detalhados em cada nó
- Monitorar execuções com erro
- Configurar alertas para falhas

### Logs na API
- Verificar `logs/combined.log`
- Monitorar erros em `logs/error.log`
- Usar dashboard do Supabase para queries

## 🚀 Deploy em Produção

### N8N
- Hospedar em servidor próprio ou usar n8n.cloud
- Configurar variáveis de ambiente
- Habilitar HTTPS

### API
- Deploy no Render/Railway
- Configurar variáveis de ambiente
- Habilitar HTTPS
- Configurar domínio customizado

### WhatsApp Business API
- Obter acesso à API oficial
- Configurar webhook do WhatsApp para N8N
- Validar número de telefone

## 💡 Dicas

1. **Teste localmente** antes de colocar em produção
2. **Use ngrok** para testar webhooks localmente
3. **Valide sempre** os dados recebidos do WhatsApp
4. **Implemente retry** para requisições que falharem
5. **Monitore** as execuções do N8N regularmente
6. **Documente** o fluxo para facilitar manutenção

## 📞 Suporte

Para dúvidas sobre:
- **API:** Consulte `EXEMPLOS_API.md`
- **Instalação:** Consulte `INSTALACAO.md`
- **N8N:** Acesse [docs.n8n.io](https://docs.n8n.io)
