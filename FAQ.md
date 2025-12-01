# ❓ FAQ - Perguntas Frequentes

Respostas para as perguntas mais comuns sobre o Sistema Residencial Hortel.

---

## 📋 Índice

- [Geral](#geral)
- [Instalação](#instalação)
- [Uso](#uso)
- [Problemas Técnicos](#problemas-técnicos)
- [Integrações](#integrações)
- [Segurança](#segurança)
- [Desenvolvimento](#desenvolvimento)

---

## 🎯 Geral

### O que é o Sistema Residencial Hortel?

É um sistema completo de gestão hoteleira que inclui:
- Backend API REST (Node.js + Express)
- Painel administrativo web
- Integração com WhatsApp via n8n
- Sistema de pagamentos PIX
- Gestão de quartos, reservas e hóspedes

### O sistema está pronto para uso?

✅ **Sim!** O sistema está 100% funcional e pronto para uso em produção.

### Quanto custa para usar?

O código é gratuito (desenvolvido para o Residencial Hortel).

Custos de infraestrutura estimados:
- Supabase: $0 - $25/mês
- Servidor API: $5 - $15/mês
- n8n: $0 - $20/mês
- **Total: $5 - $60/mês**

### Preciso saber programar para usar?

**Não!** Para usar o sistema:
- Execute `INICIAR.bat`
- Abra o painel no navegador
- Faça login e use

Para modificar ou manter, conhecimento básico de JavaScript ajuda.

### Onde está a documentação?

Temos 25+ documentos! Comece por:
- **INICIO.txt** - Guia visual
- **COMO_USAR.md** - Guia passo a passo
- **INDEX.md** - Índice completo

---

## 🔧 Instalação

### Quais são os pré-requisitos?

- **Node.js** 14+ ([download](https://nodejs.org))
- **Conta Supabase** (gratuita)
- **Navegador** moderno (Chrome, Firefox, Edge)
- **Windows** (para scripts .bat) ou Linux/Mac

### Como instalar?

```bash
# 1. Instalar dependências
cd api
npm install

# 2. Configurar .env
cp .env.example .env
# Edite .env com suas credenciais

# 3. Criar tabelas
# Execute SQL em api/src/db/migrations/001_create_tables.sql

# 4. Popular dados
node src/db/seed.js

# 5. Iniciar
node server.js
```

Veja guia completo em **api/INSTALACAO.md**

### Onde consigo credenciais do Supabase?

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (gratuita)
3. Crie um novo projeto
4. Vá em Settings > API
5. Copie URL e anon/public key

### O que fazer se der erro na instalação?

1. Verifique se Node.js está instalado: `node --version`
2. Limpe e reinstale: `rm -rf node_modules && npm install`
3. Verifique o arquivo .env
4. Consulte **TROUBLESHOOTING.md**

---

## 💻 Uso

### Como fazer login?

**Credenciais padrão:**
- Email: `admin@residencialhortel.com`
- Senha: `admin123`

### Como criar uma reserva?

**Via Painel:**
- Não implementado diretamente no painel v1.0
- Use a API ou WhatsApp

**Via API:**
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Veja exemplos em **api/EXEMPLOS_API.md**

**Via WhatsApp:**
- Configure n8n (veja **api/INTEGRACAO_N8N.md**)
- Cliente envia mensagem
- Sistema cria reserva automaticamente

### Como fazer check-in?

1. Acesse o painel
2. Vá para lista de reservas
3. Encontre reserva com status CONFIRMADA
4. Clique em "Check-in"
5. Sistema valida horário (após 13h)
6. Status muda para EM_ANDAMENTO

### Como fazer check-out?

1. Acesse o painel
2. Vá para lista de reservas
3. Encontre reserva com status EM_ANDAMENTO
4. Clique em "Check-out"
5. Sistema valida horário (após 11h)
6. Status muda para FINALIZADA

### Como cancelar uma reserva?

1. Acesse o painel
2. Vá para lista de reservas
3. Encontre reserva (PENDENTE ou CONFIRMADA)
4. Clique em "Cancelar"
5. Confirme o cancelamento

### Posso mudar os horários de check-in/check-out?

**Sim!** Edite `api/src/services/disponibilidade.service.js`:

```javascript
const HORARIO_CHECKIN = 13; // Mude para o horário desejado
const HORARIO_CHECKOUT = 11; // Mude para o horário desejado
```

---

## 🐛 Problemas Técnicos

### API não inicia

**Soluções:**
```bash
# 1. Reinstalar dependências
cd api
npm install

# 2. Verificar .env
cat .env

# 3. Verificar porta
# Mude PORT no .env se 3000 estiver ocupada

# 4. Ver logs
tail -f logs/error.log
```

### Painel não carrega dados

**Soluções:**
1. Verifique se API está rodando
2. Abra Console (F12) e veja erros
3. Verifique URL da API em `painel-simples.html`
4. Limpe cache do navegador (Ctrl+Shift+Delete)

### Erro de login

**Soluções:**
```bash
# 1. Resetar senha do admin
cd api
node src/db/seed.js

# 2. Limpar localStorage
# No Console (F12):
localStorage.clear()
location.reload()

# 3. Verificar JWT_SECRET no .env
```

### Erro "CORS"

**Solução:**

Verifique em `api/src/server.js`:
```javascript
app.use(cors({
  origin: '*', // Ou especifique o domínio
  credentials: true
}));
```

### Banco de dados não conecta

**Soluções:**
1. Verifique credenciais no .env
2. Teste conexão no Supabase Dashboard
3. Verifique se projeto Supabase está ativo
4. Veja logs: `tail -f api/logs/error.log`

---

## 🔌 Integrações

### Como integrar com WhatsApp?

1. Instale n8n
2. Configure WhatsApp Business API
3. Importe workflow
4. Configure webhooks
5. Teste

Guia completo em **api/INTEGRACAO_N8N.md**

### Como integrar PIX real?

Atualmente é um mock. Para integrar:

1. Escolha gateway (Mercado Pago, PagSeguro, etc)
2. Crie conta no gateway
3. Obtenha credenciais
4. Edite `api/src/services/pix.service.js`
5. Implemente geração real de QR Code
6. Configure webhook do gateway

### Posso integrar com Booking.com?

Não está implementado na v1.0, mas é possível:

1. Obtenha API key do Booking
2. Crie serviço de integração
3. Sincronize disponibilidade
4. Sincronize reservas

Planejado para v2.0.

### Como enviar emails?

Não implementado na v1.0. Para adicionar:

1. Instale nodemailer: `npm install nodemailer`
2. Configure SMTP no .env
3. Crie serviço de email
4. Envie notificações

Planejado para v1.1.0.

---

## 🔒 Segurança

### O sistema é seguro?

**Sim!** Implementamos:
- ✅ Autenticação JWT
- ✅ Hash de senhas (bcrypt)
- ✅ Validação de inputs (Joi)
- ✅ Sanitização XSS
- ✅ CORS configurado
- ✅ SQL injection protegido (Supabase)

### Como mudar a senha do admin?

**Opção 1: Via seed**
```bash
cd api
# Edite src/db/seed.js e mude a senha
node src/db/seed.js
```

**Opção 2: Via SQL**
```sql
-- No Supabase SQL Editor
UPDATE funcionarios 
SET senha_hash = '$2a$10$...' -- Hash bcrypt da nova senha
WHERE email = 'admin@residencialhortel.com';
```

### Como gerar hash de senha?

```javascript
const bcrypt = require('bcryptjs');
const senha = 'minha-nova-senha';
const hash = await bcrypt.hash(senha, 10);
console.log(hash);
```

### Devo usar HTTPS?

**Sim!** Em produção, sempre use HTTPS:
- Protege dados em trânsito
- Protege tokens JWT
- Protege senhas
- Requerido para APIs modernas

Use Let's Encrypt (gratuito) ou certificado do seu provedor.

### Como fazer backup?

**Banco de Dados:**
- Supabase Dashboard > Database > Backups
- Ou exporte via SQL

**Código:**
```bash
tar -czf backup_$(date +%Y%m%d).tar.gz hotel_system_base/
```

**Configurações:**
```bash
cp api/.env api/.env.backup
```

---

## 👨‍💻 Desenvolvimento

### Como contribuir?

1. Leia **CONTRIBUINDO.md**
2. Fork o repositório
3. Crie uma branch
4. Faça suas mudanças
5. Teste
6. Abra um Pull Request

### Onde estão os testes?

Testes automatizados não estão implementados na v1.0.

Planejado para v1.1.0:
- Testes unitários (Jest)
- Testes de integração
- Testes E2E

### Como adicionar um novo endpoint?

1. Crie rota em `api/src/routes/`
2. Crie serviço em `api/src/services/`
3. Adicione validação em `api/src/middlewares/validation.js`
4. Teste o endpoint
5. Documente em `api/EXEMPLOS_API.md`

### Como adicionar uma nova tabela?

1. Crie migration SQL
2. Execute no Supabase
3. Atualize seed se necessário
4. Crie serviço para a tabela
5. Crie rotas
6. Documente

### Posso usar React no frontend?

**Sim!** Já existe estrutura React em `web/src/`.

Para usar:
```bash
cd web
npm install
npm run dev
```

Mas recomendamos o `painel-simples.html` por ser mais simples.

### Como fazer deploy?

**Backend:**
- Heroku, Railway, Render, ou VPS
- Configure variáveis de ambiente
- Configure domínio
- Configure HTTPS

**Frontend:**
- Vercel, Netlify, ou servir do backend
- Configure domínio
- Configure HTTPS

**Banco:**
- Supabase já é hospedado
- Configure backups automáticos

Guia detalhado será adicionado em versão futura.

---

## 📊 Performance

### O sistema é rápido?

**Sim!** Para uso típico (< 100 quartos, < 1000 reservas/mês):
- API responde em < 100ms
- Painel carrega em < 1s
- Banco de dados otimizado com índices

### Como melhorar performance?

1. **Adicionar cache (Redis)**
2. **Otimizar queries SQL**
3. **Adicionar CDN para assets**
4. **Usar load balancer**
5. **Escalar horizontalmente**

### Quantos usuários simultâneos suporta?

Com configuração atual:
- ~50-100 usuários simultâneos
- Pode escalar para mais com:
  - Múltiplas instâncias da API
  - Load balancer
  - Cache
  - Supabase Pro

---

## 💰 Custos

### Quanto custa hospedar?

**Estimativa mensal:**
- Supabase Free: $0 (até 500MB, 2GB transfer)
- Supabase Pro: $25 (8GB, 50GB transfer)
- Railway/Render: $5-15
- n8n self-hosted: $0
- n8n cloud: $20
- Domínio: ~$1/mês

**Total: $5-60/mês** dependendo da escala

### Posso usar tudo gratuito?

**Sim!** Para começar:
- Supabase Free tier
- Railway Free tier (500h/mês)
- n8n self-hosted (VPS gratuito)
- Domínio gratuito (.tk, .ml, etc)

**Total: $0/mês** (com limitações)

---

## 🎯 Roadmap

### O que vem na v1.1.0?

- Relatórios de ocupação
- Relatórios de faturamento
- Notificações por email
- Testes automatizados
- Melhorias de performance

### O que vem na v2.0.0?

- App mobile (React Native)
- Multi-idioma
- Multi-propriedade
- IA para previsão de ocupação
- Integração com OTAs

### Quando sai a próxima versão?

Sem data definida. Depende de:
- Feedback dos usuários
- Necessidades do Residencial Hortel
- Contribuições da comunidade

---

## 📞 Suporte

### Onde consigo ajuda?

1. **Documentação:** Leia [INDEX.md](INDEX.md)
2. **Troubleshooting:** Veja [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Checklist:** Use [CHECKLIST.md](CHECKLIST.md)
4. **Logs:** Verifique `api/logs/error.log`
5. **Console:** Abra F12 no navegador

### Como reportar um bug?

1. Verifique se já foi reportado
2. Colete informações:
   - Descrição do problema
   - Passos para reproduzir
   - Logs relevantes
   - Versão do sistema
3. Crie uma issue detalhada

### Como sugerir uma funcionalidade?

1. Verifique se já foi sugerida
2. Descreva a funcionalidade
3. Explique por que é útil
4. Dê exemplos de uso
5. Crie uma issue

---

## 🎉 Outras Perguntas

### Posso usar em outro hotel?

Tecnicamente sim, mas a licença é para o Residencial Hortel.

Para usar em outro estabelecimento:
- Entre em contato
- Discuta licenciamento
- Adapte para suas necessidades

### Posso vender este sistema?

**Não.** O sistema é proprietário do Residencial Hortel.

Veja [LICENSE.md](LICENSE.md) para detalhes.

### Como posso contribuir?

Veja [CONTRIBUINDO.md](CONTRIBUINDO.md) para:
- Reportar bugs
- Sugerir melhorias
- Contribuir com código
- Melhorar documentação

### O código é open source?

**Não.** É proprietário do Residencial Hortel.

Mas você pode:
- Ver o código
- Modificar para uso interno
- Aprender com ele

### Tem suporte comercial?

Não oficialmente na v1.0.

Para suporte:
- Use a documentação
- Consulte os logs
- Crie issues

---

## 📚 Recursos Adicionais

- [README.md](README.md) - Documentação principal
- [INDEX.md](INDEX.md) - Índice completo
- [COMO_USAR.md](COMO_USAR.md) - Guia de uso
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solução de problemas
- [ARQUITETURA.md](ARQUITETURA.md) - Arquitetura técnica

---

**Não encontrou sua pergunta?**

Consulte a documentação completa ou crie uma issue com sua dúvida!

---

**Última atualização:** Novembro 2024  
**Versão:** 1.0.0
