# ✅ TESTAR DEPLOY - VERIFICAÇÃO PÓS-DEPLOY

## 🎯 OBJETIVO

Verificar se o sistema está funcionando corretamente após o deploy.

---

## 📋 CHECKLIST DE TESTES

### 1. Backend (API) - 5 minutos

#### 1.1 Health Check
```
URL: https://SEU-BACKEND.onrender.com/health
Método: GET
Resposta esperada: {"status":"ok"}
```

**Como testar:**
1. Abra o navegador
2. Cole a URL acima (substitua SEU-BACKEND)
3. Deve aparecer: `{"status":"ok"}`

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique logs no Render

#### 1.2 Endpoint de Quartos
```
URL: https://SEU-BACKEND.onrender.com/api/quartos
Método: GET
Resposta esperada: Array de quartos
```

**Como testar:**
1. Abra o navegador
2. Cole a URL acima
3. Deve aparecer JSON com lista de quartos

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Variáveis de ambiente (SUPABASE_URL, SUPABASE_ANON_KEY)
- Logs no Render
- Conexão com Supabase

#### 1.3 Endpoint de Login
```
URL: https://SEU-BACKEND.onrender.com/api/auth/login
Método: POST
Body: {
  "email": "admin@residencialhortel.com",
  "senha": "admin123"
}
Resposta esperada: Token JWT
```

**Como testar (usando Postman ou Insomnia):**
1. Crie requisição POST
2. URL: endpoint acima
3. Body (JSON):
```json
{
  "email": "admin@residencialhortel.com",
  "senha": "admin123"
}
```
4. Envie
5. Deve retornar token

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- JWT_SECRET configurado
- Usuário admin existe no banco
- Execute seed do banco se necessário

---

### 2. Frontend (Web) - 5 minutos

#### 2.1 Página Carrega
```
URL: https://SEU-FRONTEND.onrender.com
```

**Como testar:**
1. Abra o navegador
2. Cole a URL acima
3. Deve aparecer tela de login

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Build do frontend completou
- Logs no Render
- Configuração de rotas

#### 2.2 Login Funciona
**Como testar:**
1. Na tela de login, digite:
   - Email: `admin@residencialhortel.com`
   - Senha: `admin123`
2. Clique em "Entrar"
3. Deve redirecionar para dashboard

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- VITE_API_URL está correto
- Backend está respondendo
- Console do navegador (F12) para erros

#### 2.3 Dashboard Carrega
**Como testar:**
1. Após login, deve aparecer dashboard
2. Deve mostrar estatísticas
3. Deve mostrar lista de quartos

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Console do navegador (F12)
- Network tab para ver requisições
- Backend está respondendo

#### 2.4 Navegação Funciona
**Como testar:**
1. Clique em "Quartos" no menu
2. Deve mostrar lista de quartos
3. Clique em "Hóspedes" no menu
4. Deve mostrar lista de hóspedes
5. Clique em "Reservas" no menu
6. Deve mostrar lista de reservas

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Rotas do React Router
- Console do navegador

---

### 3. Funcionalidades Principais - 10 minutos

#### 3.1 Visualizar Quartos
**Como testar:**
1. Vá para página "Quartos"
2. Deve mostrar todos os 13 quartos
3. Deve mostrar status (disponível/ocupado)
4. Cores devem estar corretas (verde/vermelho)

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique dados no banco

#### 3.2 Ocupar Quarto
**Como testar:**
1. Clique em um quarto disponível
2. Clique em "Ocupar Quarto"
3. Preencha dados do hóspede
4. Salve
5. Status deve mudar para OCUPADO

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Endpoint POST /api/ocupacao
- Logs do backend
- Console do navegador

#### 3.3 Desocupar Quarto
**Como testar:**
1. Clique em um quarto ocupado
2. Clique em "Desocupar Quarto"
3. Confirme
4. Status deve mudar para DISPONÍVEL

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Endpoint DELETE /api/ocupacao
- Logs do backend

#### 3.4 Buscar Hóspede por CPF
**Como testar:**
1. Vá para página "Hóspedes"
2. Digite um CPF de teste
3. Clique em "Buscar"
4. Deve mostrar dados do hóspede

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Endpoint GET /api/hospedes/cpf/:cpf
- Hóspede existe no banco

#### 3.5 Visualizar Reservas
**Como testar:**
1. Vá para página "Reservas"
2. Deve mostrar lista de reservas
3. Status devem estar corretos
4. Cores devem estar corretas

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique dados no banco

---

### 4. Integração Backend-Frontend - 5 minutos

#### 4.1 CORS Configurado
**Como testar:**
1. Abra console do navegador (F12)
2. Vá para tab "Network"
3. Navegue pelo sistema
4. Não deve ter erros de CORS

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- CORS configurado no backend
- Origem permitida inclui URL do frontend

#### 4.2 Autenticação Funciona
**Como testar:**
1. Faça logout
2. Tente acessar página protegida diretamente
3. Deve redirecionar para login
4. Faça login novamente
5. Deve funcionar normalmente

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Middleware de autenticação
- Token sendo enviado no header

#### 4.3 Erros São Tratados
**Como testar:**
1. Tente fazer login com senha errada
2. Deve mostrar mensagem de erro
3. Tente buscar CPF inexistente
4. Deve mostrar mensagem apropriada

✅ Funcionou? Prossiga
❌ Não funcionou? Verifique:
- Error handling no backend
- Error handling no frontend

---

### 5. Performance - 3 minutos

#### 5.1 Tempo de Resposta
**Como testar:**
1. Abra Network tab (F12)
2. Navegue pelo sistema
3. Verifique tempo de resposta das APIs
4. Deve ser < 2 segundos

✅ Funcionou? Prossiga
❌ Lento? Normal no plano gratuito do Render

#### 5.2 Primeiro Acesso (Cold Start)
**Como testar:**
1. Aguarde 15 minutos sem acessar
2. Acesse novamente
3. Primeiro acesso pode demorar 30-60 segundos
4. Acessos seguintes devem ser rápidos

✅ Funcionou? Normal no plano gratuito
❌ Sempre lento? Considere plano pago

---

## 📊 RESULTADO DOS TESTES

### ✅ Tudo Funcionando
**Parabéns! Sistema está pronto para demonstração.**

Próximos passos:
1. Prepare dados de demonstração
2. Revise roteiro de apresentação
3. Pratique a demonstração

### ⚠️ Alguns Problemas
**Identifique e corrija antes da demonstração.**

Checklist de correção:
- [ ] Verifique logs no Render
- [ ] Confirme variáveis de ambiente
- [ ] Teste conexão com Supabase
- [ ] Verifique dados no banco
- [ ] Limpe cache do navegador

### ❌ Muitos Problemas
**Revise o deploy.**

Ações recomendadas:
1. Verifique `DEPLOY_RAPIDO.md` novamente
2. Confirme todos os passos foram seguidos
3. Verifique `VARIAVEIS_AMBIENTE.txt`
4. Consulte logs detalhados no Render
5. Teste localmente primeiro

---

## 🔍 LOGS E DEBUGGING

### Ver Logs do Backend
1. Acesse Render Dashboard
2. Clique no serviço backend
3. Vá em "Logs"
4. Procure por erros (linhas vermelhas)

### Ver Logs do Frontend
1. Abra console do navegador (F12)
2. Vá para tab "Console"
3. Procure por erros (linhas vermelhas)

### Ver Requisições HTTP
1. Abra console do navegador (F12)
2. Vá para tab "Network"
3. Navegue pelo sistema
4. Veja todas as requisições
5. Clique em uma para ver detalhes

---

## 🆘 PROBLEMAS COMUNS

### Backend não responde
**Solução:**
- Aguarde 1 minuto (pode estar "acordando")
- Verifique se deploy completou
- Verifique logs no Render

### Frontend não conecta ao backend
**Solução:**
- Verifique VITE_API_URL
- Confirme que backend está rodando
- Verifique CORS

### Login não funciona
**Solução:**
- Verifique JWT_SECRET
- Confirme usuário admin existe
- Execute seed do banco

### Dados não aparecem
**Solução:**
- Verifique conexão com Supabase
- Confirme que tabelas existem
- Execute migrations
- Execute seed

---

## ✅ CHECKLIST FINAL

Antes da demonstração, confirme:

- [ ] Backend responde (/health)
- [ ] Frontend carrega
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Quartos aparecem com status correto
- [ ] Ocupar quarto funciona
- [ ] Desocupar quarto funciona
- [ ] Busca por CPF funciona
- [ ] Reservas aparecem
- [ ] Navegação funciona
- [ ] Sem erros no console
- [ ] Performance aceitável

---

## 🎯 PRÓXIMO PASSO

Se todos os testes passaram:
→ Leia `PREPARAR_DADOS_DEMO.md` para criar dados de demonstração

Se alguns testes falharam:
→ Corrija os problemas e teste novamente

Se muitos testes falharam:
→ Revise `DEPLOY_RAPIDO.md` e refaça o deploy

---

**BOA SORTE! 🚀**
