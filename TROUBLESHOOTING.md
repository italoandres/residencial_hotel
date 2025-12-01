# 🔧 Guia de Troubleshooting - Residencial Hortel

Soluções para problemas comuns do sistema.

---

## 🚨 Problemas com a API

### ❌ API não inicia

**Sintomas:**
- Erro ao executar `node server.js`
- Mensagem: "Cannot find module..."

**Soluções:**
```bash
# 1. Instalar dependências
cd api
npm install

# 2. Verificar versão do Node
node --version  # Deve ser 14+

# 3. Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# 4. Tentar iniciar novamente
node server.js
```

---

### ❌ Erro de conexão com Supabase

**Sintomas:**
- "Error connecting to Supabase"
- "Invalid API key"

**Soluções:**

1. **Verificar arquivo .env**
```bash
# Arquivo: api/.env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-aqui
JWT_SECRET=seu-segredo-jwt
PORT=3000
```

2. **Testar credenciais**
```bash
# No Supabase Dashboard:
# Settings > API > URL e anon/public key
```

3. **Verificar conexão**
```javascript
// Teste rápido em api/test-connection.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

supabase.from('quartos').select('*').then(console.log);
```

---

### ❌ Tabelas não existem

**Sintomas:**
- "relation 'quartos' does not exist"
- "table not found"

**Soluções:**

1. **Executar SQL de criação**
```sql
-- No Supabase SQL Editor, execute:
-- api/src/db/migrations/001_create_tables.sql
```

2. **Verificar tabelas criadas**
```sql
-- No Supabase SQL Editor:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

3. **Popular dados iniciais**
```bash
cd api
node src/db/seed.js
```

---

### ❌ Porta 3000 já em uso

**Sintomas:**
- "Error: listen EADDRINUSE: address already in use :::3000"

**Soluções:**

**Windows:**
```bash
# Encontrar processo na porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Ou mudar porta no .env
PORT=3001
```

**Linux/Mac:**
```bash
# Encontrar e matar processo
lsof -ti:3000 | xargs kill -9

# Ou mudar porta
PORT=3001
```

---

### ❌ CORS Error

**Sintomas:**
- "Access to fetch blocked by CORS policy"
- Erro no console do navegador

**Soluções:**

1. **Verificar configuração CORS**
```javascript
// Em api/src/server.js
app.use(cors({
  origin: '*', // Ou especifique: 'http://localhost:5173'
  credentials: true
}));
```

2. **Adicionar headers manualmente**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
```

---

## 🌐 Problemas com o Painel

### ❌ Painel não carrega dados

**Sintomas:**
- Tela branca
- "Carregando..." infinito
- Dados não aparecem

**Soluções:**

1. **Verificar se API está rodando**
```bash
# Testar endpoint
curl http://localhost:3000/api/quartos
```

2. **Abrir Console do navegador (F12)**
```javascript
// Procurar por erros:
// - Network errors
// - CORS errors
// - 404 Not Found
```

3. **Verificar URL da API**
```javascript
// Em painel-simples.html, linha ~240
const API_URL = 'http://localhost:3000/api';
// Deve corresponder à porta da API
```

4. **Limpar cache do navegador**
```
Ctrl + Shift + Delete
Ou
Ctrl + F5 (hard refresh)
```

---

### ❌ Login não funciona

**Sintomas:**
- "Erro ao fazer login"
- "Invalid credentials"
- Token não salva

**Soluções:**

1. **Verificar credenciais**
```
Email: admin@residencialhortel.com
Senha: admin123
```

2. **Verificar se seed foi executado**
```bash
cd api
node src/db/seed.js
```

3. **Testar login via curl**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@residencialhortel.com","senha":"admin123"}'
```

4. **Limpar localStorage**
```javascript
// No Console do navegador (F12)
localStorage.clear();
location.reload();
```

5. **Verificar JWT_SECRET**
```bash
# Em api/.env
JWT_SECRET=algum-segredo-forte-aqui
```

---

### ❌ Botões não funcionam

**Sintomas:**
- Click não faz nada
- Erro no console
- Ações não executam

**Soluções:**

1. **Verificar erros no Console (F12)**
```javascript
// Procurar por:
// - Uncaught TypeError
// - Function not defined
// - Network errors
```

2. **Verificar token de autenticação**
```javascript
// No Console (F12)
console.log(localStorage.getItem('token'));
// Deve retornar um token JWT
```

3. **Testar endpoint manualmente**
```bash
# Exemplo: Check-in
curl -X PATCH http://localhost:3000/api/reservas/ID/check-in \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🗄️ Problemas com Banco de Dados

### ❌ Dados não salvam

**Sintomas:**
- Operação parece funcionar mas dados não aparecem
- Erro silencioso

**Soluções:**

1. **Verificar logs da API**
```bash
# Em api/logs/error.log
tail -f api/logs/error.log
```

2. **Verificar constraints do banco**
```sql
-- No Supabase SQL Editor
-- Verificar foreign keys
SELECT * FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY';
```

3. **Testar inserção manual**
```sql
-- Exemplo: Inserir quarto
INSERT INTO quartos (numero, tipo, capacidade, preco_diaria)
VALUES (999, 'INDIVIDUAL', 1, 100.00);
```

---

### ❌ Erro de foreign key

**Sintomas:**
- "violates foreign key constraint"
- "Key is not present in table"

**Soluções:**

1. **Verificar se registro pai existe**
```sql
-- Exemplo: Verificar se quarto existe
SELECT * FROM quartos WHERE id = 'uuid-aqui';
```

2. **Usar IDs válidos**
```bash
# Listar quartos disponíveis
curl http://localhost:3000/api/quartos
# Copiar um ID válido
```

3. **Verificar ordem de criação**
```javascript
// Criar na ordem correta:
// 1. Quarto
// 2. Hóspede
// 3. Reserva
```

---

### ❌ Dados duplicados

**Sintomas:**
- "duplicate key value violates unique constraint"
- Erro ao inserir

**Soluções:**

1. **Verificar constraints UNIQUE**
```sql
-- Exemplo: CPF duplicado
SELECT cpf, COUNT(*) 
FROM hospedes 
GROUP BY cpf 
HAVING COUNT(*) > 1;
```

2. **Atualizar em vez de inserir**
```javascript
// Verificar se existe antes de criar
const existing = await supabase
  .from('hospedes')
  .select('*')
  .eq('cpf', cpf)
  .single();

if (existing.data) {
  // Atualizar
} else {
  // Inserir
}
```

---

## 🔐 Problemas de Autenticação

### ❌ Token expirado

**Sintomas:**
- "Token expired"
- "Invalid token"
- Logout automático

**Soluções:**

1. **Fazer login novamente**
```javascript
// Token JWT expira após 24h (padrão)
// Fazer novo login
```

2. **Ajustar tempo de expiração**
```javascript
// Em api/src/services/auth.service.js
const token = jwt.sign(
  { id: funcionario.id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // 7 dias em vez de 24h
);
```

3. **Implementar refresh token (futuro)**

---

### ❌ Senha não aceita

**Sintomas:**
- "Invalid password"
- Login falha com senha correta

**Soluções:**

1. **Resetar senha do admin**
```javascript
// Em api/src/db/seed.js
// Executar novamente para resetar senha
node src/db/seed.js
```

2. **Verificar hash da senha**
```javascript
// Testar hash manualmente
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('admin123', 10);
console.log(hash);
```

---

## 📱 Problemas com WhatsApp/n8n

### ❌ n8n não recebe mensagens

**Sintomas:**
- Mensagens no WhatsApp não disparam workflow
- Webhook não é chamado

**Soluções:**

1. **Verificar conexão do WhatsApp**
```
# No n8n:
# Credentials > WhatsApp > Test Connection
```

2. **Verificar webhook URL**
```
# Deve ser acessível publicamente
# Use ngrok para testes locais:
ngrok http 5678
```

3. **Testar webhook manualmente**
```bash
curl -X POST http://localhost:5678/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"message":"teste"}'
```

---

### ❌ Reserva não é criada via WhatsApp

**Sintomas:**
- Mensagem recebida mas reserva não aparece
- Erro no workflow n8n

**Soluções:**

1. **Verificar logs do n8n**
```
# No n8n UI:
# Executions > Ver detalhes do erro
```

2. **Verificar formato dos dados**
```javascript
// Dados enviados devem corresponder ao schema:
{
  "quarto_id": "uuid-valido",
  "hospede": {
    "nome": "string",
    "cpf": "11 dígitos",
    "telefone": "string"
  },
  "data_checkin": "YYYY-MM-DD",
  "data_checkout": "YYYY-MM-DD",
  "numero_hospedes": number
}
```

3. **Testar criação manual**
```bash
# Usar mesmos dados do n8n
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 💰 Problemas com PIX

### ❌ QR Code não é gerado

**Sintomas:**
- Resposta sem qr_code
- Campo vazio

**Soluções:**

1. **Verificar mock do PIX**
```javascript
// Em api/src/services/pix.service.js
// Mock sempre retorna QR Code
// Se não retorna, verificar logs
```

2. **Implementar PIX real**
```javascript
// Integrar com:
// - Mercado Pago
// - PagSeguro
// - Banco do Brasil
// Veja documentação específica
```

---

### ❌ Webhook PIX não atualiza reserva

**Sintomas:**
- Pagamento feito mas status não muda
- Reserva continua PENDENTE

**Soluções:**

1. **Testar webhook manualmente**
```bash
curl -X POST http://localhost:3000/api/webhooks/pix \
  -H "Content-Type: application/json" \
  -d '{
    "pagamento_id": "uuid-do-pagamento",
    "status": "APROVADO"
  }'
```

2. **Verificar logs**
```bash
tail -f api/logs/combined.log
# Procurar por "Webhook PIX"
```

3. **Verificar ID do pagamento**
```sql
-- No Supabase
SELECT * FROM pagamentos_pix WHERE id = 'uuid-aqui';
```

---

## 🐛 Erros Comuns

### ❌ "Cannot read property of undefined"

**Causa:** Tentando acessar propriedade de objeto nulo/undefined

**Solução:**
```javascript
// Usar optional chaining
const nome = reserva?.hospede?.nome || 'Sem nome';

// Ou verificar antes
if (reserva && reserva.hospede) {
  const nome = reserva.hospede.nome;
}
```

---

### ❌ "Unexpected token in JSON"

**Causa:** JSON malformado

**Solução:**
```javascript
// Validar JSON antes de enviar
try {
  JSON.parse(jsonString);
} catch (e) {
  console.error('JSON inválido:', e);
}

// Usar JSON.stringify corretamente
const body = JSON.stringify({ key: 'value' });
```

---

### ❌ "Network request failed"

**Causa:** API offline ou URL incorreta

**Solução:**
```javascript
// 1. Verificar se API está rodando
// 2. Verificar URL
// 3. Verificar CORS
// 4. Verificar firewall

// Adicionar timeout
fetch(url, {
  timeout: 5000,
  signal: AbortSignal.timeout(5000)
})
```

---

## 📊 Ferramentas de Debug

### Console do Navegador (F12)
```javascript
// Ver erros
console.error('Erro:', error);

// Ver dados
console.log('Dados:', data);

// Ver requisições
// Aba Network > Ver requests/responses
```

### Logs da API
```bash
# Ver todos os logs
tail -f api/logs/combined.log

# Ver apenas erros
tail -f api/logs/error.log

# Buscar por termo
grep "erro" api/logs/combined.log
```

### Supabase Dashboard
```
# Ver dados:
Table Editor > Selecionar tabela

# Ver logs:
Logs > API Logs

# Executar SQL:
SQL Editor > New Query
```

### Postman/Insomnia
```
# Testar endpoints manualmente
# Importar collection
# Ver responses detalhados
```

---

## 🆘 Quando Pedir Ajuda

Se nenhuma solução funcionou:

1. **Coletar informações:**
   - Mensagem de erro completa
   - Logs da API (api/logs/)
   - Console do navegador (F12)
   - Versão do Node.js
   - Sistema operacional

2. **Verificar documentação:**
   - README.md
   - COMO_USAR.md
   - api/EXEMPLOS_API.md

3. **Testar em ambiente limpo:**
   - Reinstalar dependências
   - Limpar cache
   - Testar em outro navegador

4. **Criar issue com:**
   - Descrição do problema
   - Passos para reproduzir
   - Logs relevantes
   - O que já tentou

---

## ✅ Checklist de Debug

Antes de pedir ajuda, verifique:

- [ ] API está rodando
- [ ] Banco de dados conectado
- [ ] Tabelas criadas
- [ ] Dados populados (seed)
- [ ] .env configurado corretamente
- [ ] Dependências instaladas
- [ ] Porta correta
- [ ] CORS configurado
- [ ] Console sem erros
- [ ] Logs verificados
- [ ] Endpoints testados manualmente
- [ ] Cache limpo
- [ ] Navegador atualizado

---

**Última atualização:** Novembro 2024  
**Versão:** 1.0.0
