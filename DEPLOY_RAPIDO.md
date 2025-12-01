# 🚀 DEPLOY RÁPIDO - 3 PASSOS

## Passo 1: GitHub (5 minutos)

```bash
# Inicializar repositório
git init
git add .
git commit -m "Sistema Hotel Residencial Hortel pronto"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/SEU_USUARIO/hotel-residencial-hortel.git
git branch -M main
git push -u origin main
```

## Passo 2: Render Backend (10 minutos)

1. Acesse https://render.com e faça login com GitHub
2. Clique em **"New +" → "Web Service"**
3. Selecione o repositório `hotel-residencial-hortel`
4. Configure:
   - **Name:** `hotel-residencial-hortel-api`
   - **Root Directory:** `api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Adicione variáveis de ambiente:
   ```
   NODE_ENV=production
   SUPABASE_URL=sua_url_aqui
   SUPABASE_ANON_KEY=sua_chave_aqui
   JWT_SECRET=qualquer_string_secreta_aqui
   ```
6. Clique em **"Create Web Service"**
7. **Copie a URL gerada** (ex: `https://hotel-residencial-hortel-api.onrender.com`)

## Passo 3: Render Frontend (5 minutos)

1. No Render, clique em **"New +" → "Static Site"**
2. Selecione o mesmo repositório
3. Configure:
   - **Name:** `hotel-residencial-hortel-web`
   - **Root Directory:** `web`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Adicione variável de ambiente:
   ```
   VITE_API_URL=URL_DO_BACKEND_DO_PASSO_2
   ```
5. Clique em **"Create Static Site"**
6. **Copie a URL gerada** (ex: `https://hotel-residencial-hortel-web.onrender.com`)

## ✅ PRONTO!

Acesse a URL do frontend e faça login:
- **Email:** `admin@residencialhortel.com`
- **Senha:** `admin123`

---

## ⚠️ IMPORTANTE

**Primeiro acesso pode demorar 30-60 segundos** porque o plano gratuito do Render "dorme" após inatividade.

**Antes da demonstração:** Acesse o sistema 2 minutos antes para "acordá-lo".

---

## 🆘 PROBLEMAS?

### Backend não inicia
- Verifique os logs no Render
- Confirme que as variáveis de ambiente estão corretas
- Verifique se o Supabase está acessível

### Frontend não conecta ao backend
- Confirme que a variável `VITE_API_URL` está correta
- Verifique se o backend está rodando
- Limpe o cache do navegador

### Login não funciona
- Verifique se o banco de dados tem o usuário admin
- Execute o seed do banco se necessário
- Verifique a variável `JWT_SECRET`

---

## 📞 PRÓXIMO PASSO

Leia o arquivo `GUIA_DEPLOY_DEMONSTRACAO.md` para o roteiro completo de apresentação ao dono do hotel.
