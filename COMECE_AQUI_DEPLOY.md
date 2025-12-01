# 🚀 COMECE AQUI - DEPLOY EM 3 PASSOS

## ⚡ OBJETIVO
Colocar o sistema online em 20 minutos para demonstrar ao dono do hotel.

---

## 📋 PRÉ-REQUISITOS (5 MIN)

```bash
# Execute este comando para verificar:
verificar-deploy.bat
```

**Precisa ter:**
- ✅ Git instalado
- ✅ Node.js instalado  
- ✅ Conta GitHub
- ✅ Conta Render (gratuita)
- ✅ Projeto Supabase configurado

---

## 🚀 PASSO 1: GITHUB (5 MIN)

```bash
# Na pasta do projeto, execute:
git init
git add .
git commit -m "Sistema Hotel Residencial Hortel"
```

**Depois:**
1. Crie repositório em https://github.com/new
2. Nome: `hotel-residencial-hortel`
3. Execute:
```bash
git remote add origin https://github.com/SEU_USUARIO/hotel-residencial-hortel.git
git branch -M main
git push -u origin main
```

---

## 🌐 PASSO 2: RENDER BACKEND (8 MIN)

1. Acesse https://render.com
2. **New + → Web Service**
3. Conecte repositório GitHub
4. Configure:
   - **Name:** `hotel-residencial-hortel-api`
   - **Root Directory:** `api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. **Adicione variáveis de ambiente:**
```
NODE_ENV=production
PORT=3000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_do_supabase
JWT_SECRET=hotel_residencial_hortel_secret_2024
```

6. **Create Web Service**
7. **📝 COPIE A URL GERADA**

---

## 🌐 PASSO 3: RENDER FRONTEND (7 MIN)

1. No Render: **New + → Static Site**
2. Mesmo repositório
3. Configure:
   - **Name:** `hotel-residencial-hortel-web`
   - **Root Directory:** `web`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Adicione variável:**
```
VITE_API_URL=URL_DO_BACKEND_DO_PASSO_2
```

5. **Create Static Site**
6. **📝 COPIE A URL GERADA**

---

## ✅ TESTAR (5 MIN)

### 1. Backend
Acesse: `https://seu-backend.onrender.com/health`
Deve retornar: `{"status":"ok"}`

### 2. Frontend
Acesse: `https://seu-frontend.onrender.com`
Deve mostrar tela de login

### 3. Login
- Email: `admin@residencialhortel.com`
- Senha: `admin123`

---

## 🎯 PRONTO!

**Sistema está online!** 🎉

### Próximos passos:

1. **Preparar dados de demonstração**
   → Leia: `PREPARAR_DADOS_DEMO.md`

2. **Revisar roteiro de apresentação**
   → Leia: `CHECKLIST_DEMONSTRACAO.md`

3. **Praticar demonstração**
   → Teste todas as funcionalidades

---

## 🆘 PROBLEMAS?

### Backend não inicia
→ Verifique logs no Render
→ Confirme variáveis de ambiente

### Frontend não conecta
→ Verifique `VITE_API_URL`
→ Confirme que backend está rodando

### Login não funciona
→ Verifique `JWT_SECRET`
→ Execute seed do banco

### Mais ajuda
→ Leia: `FAQ_DEPLOY.md`
→ Leia: `TROUBLESHOOTING.md`

---

## 📚 DOCUMENTAÇÃO COMPLETA

**Para mais detalhes:**
- `DEPLOY_RAPIDO.md` - Versão detalhada deste guia
- `GUIA_DEPLOY_DEMONSTRACAO.md` - Guia completo
- `INDICE_DEPLOY.md` - Índice de todos os arquivos
- `FAQ_DEPLOY.md` - Perguntas frequentes

---

## 💡 DICAS

1. **Primeiro acesso demora?**
   - Normal! Plano gratuito "dorme" após inatividade
   - Acesse 2 minutos antes da demonstração

2. **Quer evitar o "sleep"?**
   - Migre para plano pago ($7/mês por serviço)

3. **Precisa de domínio próprio?**
   - Não é obrigatório
   - Pode configurar depois se quiser

---

## 🎬 DEMONSTRAÇÃO

**Roteiro básico (20 min):**

1. **Login** (2 min) - Mostre segurança
2. **Dashboard** (3 min) - Visão geral
3. **Quartos** (5 min) - Ocupar/desocupar
4. **Hóspedes** (3 min) - Busca por CPF
5. **Reservas** (3 min) - Check-in/out
6. **Configurações** (2 min) - Checkout automático
7. **Fechamento** (2 min) - Benefícios e próximos passos

**Roteiro completo:**
→ Leia: `CHECKLIST_DEMONSTRACAO.md`

---

## 💰 CUSTOS

### Gratuito
- Render: R$ 0/mês
- Supabase: R$ 0/mês
- **Total: R$ 0/mês**
- ⚠️ Com limitações (sleep após inatividade)

### Profissional
- Render: R$ 70/mês
- Supabase: R$ 125/mês (opcional)
- **Total: R$ 70-195/mês**
- ✅ Sem limitações

---

## ✅ CHECKLIST FINAL

Antes da demonstração:

- [ ] Sistema deployado
- [ ] Backend respondendo
- [ ] Frontend carregando
- [ ] Login funcionando
- [ ] Dados de teste preparados
- [ ] Roteiro revisado
- [ ] Tudo testado
- [ ] Sistema acessado 2 min antes (para "acordar")

---

## 🎯 BENEFÍCIOS PARA DESTACAR

✅ **Automação Total** - Checkout automático
✅ **Acesso Remoto** - Funciona de qualquer lugar
✅ **Visão em Tempo Real** - Status sempre atualizado
✅ **Integração WhatsApp** - Cliente reserva sozinho
✅ **Fácil de Usar** - Interface intuitiva
✅ **Seguro** - Login protegido
✅ **Sem Instalação** - Funciona no navegador

---

## 📞 SUPORTE

**Precisa de ajuda?**
- `FAQ_DEPLOY.md` - Perguntas frequentes
- `INDICE_DEPLOY.md` - Encontre o arquivo certo
- Logs do Render - Para debugging

---

**VOCÊ CONSEGUE! BOA SORTE! 🚀**

**Tempo total: ~20 minutos**
**Dificuldade: Fácil**
**Resultado: Sistema online e pronto para demonstração!**
