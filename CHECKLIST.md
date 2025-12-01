# ✅ Checklist de Verificação - Sistema Residencial Hortel

Use este checklist para garantir que tudo está funcionando corretamente.

## 📋 Instalação e Configuração

### Backend (API)
- [ ] Node.js instalado (versão 14+)
- [ ] Dependências instaladas (`cd api && npm install`)
- [ ] Arquivo `.env` criado em `api/`
- [ ] Credenciais do Supabase configuradas
- [ ] Tabelas criadas no Supabase (SQL executado)
- [ ] Dados iniciais populados (`node src/db/seed.js`)
- [ ] API iniciando sem erros (`node server.js`)
- [ ] API respondendo em `http://localhost:3000`

### Frontend (Painel)
- [ ] Arquivo `painel-simples.html` existe
- [ ] Painel abre no navegador
- [ ] Console sem erros (F12)

---

## 🧪 Testes Funcionais

### Teste 1: API Básica
```bash
curl http://localhost:3000/api/quartos
```
- [ ] Retorna lista de quartos
- [ ] Status 200 OK
- [ ] JSON válido

### Teste 2: Autenticação
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@residencialhortel.com","senha":"admin123"}'
```
- [ ] Retorna token JWT
- [ ] Status 200 OK
- [ ] Token válido

### Teste 3: Painel Administrativo
- [ ] Painel carrega sem erros
- [ ] Dashboard mostra estatísticas
- [ ] Lista de quartos aparece
- [ ] Lista de reservas aparece

### Teste 4: Login no Painel
- [ ] Formulário de login funciona
- [ ] Credenciais corretas fazem login
- [ ] Credenciais erradas mostram erro
- [ ] Token salvo no localStorage

### Teste 5: Gestão de Reservas
- [ ] Lista de reservas carrega
- [ ] Botão de check-in aparece (reservas confirmadas)
- [ ] Botão de check-out aparece (reservas em andamento)
- [ ] Botão de cancelar aparece (reservas pendentes/confirmadas)
- [ ] Check-in funciona
- [ ] Check-out funciona
- [ ] Cancelamento funciona

---

## 🔌 Endpoints da API

### Públicos (sem autenticação)
- [ ] `GET /api/quartos` - Lista quartos
- [ ] `GET /api/quartos/disponiveis` - Quartos disponíveis
- [ ] `POST /api/auth/login` - Login
- [ ] `POST /api/auth/register` - Registro

### Protegidos (com JWT)
- [ ] `GET /api/reservas` - Lista reservas
- [ ] `POST /api/reservas` - Cria reserva
- [ ] `GET /api/reservas/:id` - Detalhes
- [ ] `PATCH /api/reservas/:id/check-in` - Check-in
- [ ] `PATCH /api/reservas/:id/check-out` - Check-out
- [ ] `DELETE /api/reservas/:id` - Cancela

---

## 🗄️ Banco de Dados

### Tabelas Criadas
- [ ] `quartos` existe
- [ ] `hospedes` existe
- [ ] `reservas` existe
- [ ] `pagamentos_pix` existe
- [ ] `funcionarios` existe

### Dados Iniciais
- [ ] 10 quartos cadastrados
- [ ] 1 funcionário admin existe
- [ ] Reservas de exemplo existem

### Constraints e Índices
- [ ] Foreign keys funcionando
- [ ] Unique constraints ativos
- [ ] Índices criados

---

## 🔐 Segurança

- [ ] JWT_SECRET configurado
- [ ] Senhas hasheadas (bcrypt)
- [ ] Middleware de autenticação funcionando
- [ ] CORS configurado corretamente
- [ ] Validação de inputs ativa
- [ ] SQL injection protegido (Supabase)
- [ ] XSS protegido (sanitização)

---

## 📝 Logs

- [ ] Pasta `api/logs/` existe
- [ ] `combined.log` sendo gerado
- [ ] `error.log` sendo gerado
- [ ] Logs legíveis e úteis

---

## 🎨 Interface

### Painel Administrativo
- [ ] Design responsivo
- [ ] Cores consistentes
- [ ] Ícones visíveis
- [ ] Botões funcionais
- [ ] Feedback visual (loading, erros)
- [ ] Mensagens de sucesso/erro

### UX
- [ ] Navegação intuitiva
- [ ] Ações claras
- [ ] Confirmações para ações críticas
- [ ] Atualização automática após ações

---

## 🔄 Integração WhatsApp (Opcional)

- [ ] n8n instalado
- [ ] Workflow importado
- [ ] Webhook configurado
- [ ] Número WhatsApp conectado
- [ ] Teste de mensagem funcionando
- [ ] Criação de reserva via WhatsApp
- [ ] Envio de QR Code PIX
- [ ] Confirmação de pagamento

---

## 💰 Pagamentos PIX (Mock)

- [ ] Endpoint de geração de QR Code funciona
- [ ] QR Code retornado
- [ ] Webhook de confirmação funciona
- [ ] Status da reserva atualiza após pagamento

---

## 📊 Funcionalidades Principais

### Gestão de Quartos
- [ ] Listar todos os quartos
- [ ] Ver detalhes do quarto
- [ ] Verificar disponibilidade
- [ ] Filtrar por tipo

### Gestão de Reservas
- [ ] Criar nova reserva
- [ ] Listar reservas
- [ ] Filtrar por status
- [ ] Ver detalhes da reserva
- [ ] Fazer check-in
- [ ] Fazer check-out
- [ ] Cancelar reserva

### Gestão de Hóspedes
- [ ] Cadastro automático ao criar reserva
- [ ] Dados salvos corretamente
- [ ] Histórico de reservas

### Dashboard
- [ ] Total de quartos
- [ ] Quartos disponíveis
- [ ] Reservas ativas
- [ ] Estatísticas em tempo real

---

## 🐛 Testes de Erro

### Validações
- [ ] Email inválido rejeitado
- [ ] Senha vazia rejeitada
- [ ] CPF inválido rejeitado
- [ ] Datas inválidas rejeitadas
- [ ] Quarto inexistente rejeitado

### Casos Limite
- [ ] Reserva em quarto ocupado rejeitada
- [ ] Check-in antes da data rejeitado
- [ ] Check-out antes do check-in rejeitado
- [ ] Cancelamento de reserva finalizada rejeitado

### Erros de Rede
- [ ] API offline mostra erro no painel
- [ ] Timeout tratado corretamente
- [ ] Retry em caso de falha

---

## 📱 Compatibilidade

### Navegadores
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile (Chrome/Safari)

### Dispositivos
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

---

## 📚 Documentação

- [ ] README.md completo
- [ ] COMO_USAR.md criado
- [ ] api/README.md detalhado
- [ ] api/EXEMPLOS_API.md com exemplos
- [ ] api/INTEGRACAO_N8N.md explicativo
- [ ] web/GUIA_RAPIDO.md útil
- [ ] Comentários no código

---

## 🚀 Deploy (Futuro)

### Backend
- [ ] Variáveis de ambiente configuradas
- [ ] Logs configurados para produção
- [ ] Rate limiting ativo
- [ ] HTTPS configurado
- [ ] Backup automático do banco

### Frontend
- [ ] Assets otimizados
- [ ] Cache configurado
- [ ] CDN (se necessário)

---

## ✅ Checklist Final

- [ ] Todos os testes passando
- [ ] Documentação completa
- [ ] Código comentado
- [ ] Logs funcionando
- [ ] Segurança implementada
- [ ] Interface responsiva
- [ ] Fluxo completo testado
- [ ] Pronto para uso!

---

## 📞 Suporte

Se algum item não estiver funcionando:

1. Verifique os logs em `api/logs/`
2. Abra o Console do navegador (F12)
3. Consulte a documentação específica
4. Verifique as configurações do `.env`
5. Teste os endpoints individualmente

---

**Data da verificação:** ___/___/______

**Verificado por:** _________________

**Status:** [ ] Aprovado [ ] Pendências

**Observações:**
_________________________________
_________________________________
_________________________________
