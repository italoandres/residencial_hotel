# 🌐 Guia de Acesso ao Site - Residencial Hortel

## 📍 Links Importantes

### Site Principal (Netlify)
- **URL:** https://silly-elf-7f17f3.netlify.app
- **Página de Teste:** https://silly-elf-7f17f3.netlify.app/teste.html

### API (Render)
- **URL Base:** https://residencial-hotel-api.onrender.com
- **Endpoint Quartos:** https://residencial-hotel-api.onrender.com/api/quartos

---

## 🔐 Como Acessar o Painel Admin

### 1. Acesse o Site
Abra: https://silly-elf-7f17f3.netlify.app

### 2. Faça Login
Use as credenciais padrão:
- **Email:** `admin@hotel.com`
- **Senha:** `admin123`

### 3. Pronto!
Você terá acesso ao painel administrativo completo.

---

## ❌ Sobre os Erros que Você Viu

### Erros que PODE IGNORAR:
1. **"Denying load of chrome-extension://..."**
   - Isso é uma extensão do Chrome (PIN Company Discounts)
   - Não tem nada a ver com o seu site
   - Pode desabilitar a extensão se quiser

2. **"Empty token!" do pinComponent.js**
   - Também é da extensão do Chrome
   - Não afeta seu site

3. **"Failed to load resource: net::ERR_FAILED" do chrome-extension://invalid/**
   - Erro da extensão do Chrome
   - Ignore completamente

### Erros REAIS (se houver):
- Se você ver erro 404 no `painel-admin.html`, significa que o arquivo não foi encontrado
- Se você ver "Erro de conexão", significa que a API não está respondendo

---

## 🧪 Página de Teste

Criamos uma página especial para testar a conexão:

**URL:** https://silly-elf-7f17f3.netlify.app/teste.html

Esta página permite:
- ✅ Testar se a API está online
- ✅ Testar se os quartos estão sendo retornados
- ✅ Testar o login
- ✅ Ver as respostas da API em tempo real

---

## 🔍 Como Verificar se Está Tudo OK

### Método 1: Console do Navegador
1. Abra o site
2. Pressione `F12` para abrir o DevTools
3. Vá na aba "Console"
4. Ignore os erros de `chrome-extension://`
5. Procure por erros do seu código (começam com `https://silly-elf-7f17f3.netlify.app`)

### Método 2: Aba Network
1. Abra o DevTools (`F12`)
2. Vá na aba "Network"
3. Recarregue a página
4. Veja se os arquivos estão carregando:
   - ✅ `index.html` - Status 200
   - ✅ `painel-admin.js` - Status 200
   - ✅ `painel-admin.css` - Status 200

### Método 3: Página de Teste
1. Acesse: https://silly-elf-7f17f3.netlify.app/teste.html
2. Clique em "Testar API"
3. Clique em "Testar Quartos"
4. Se tudo estiver verde (✅), está funcionando!

---

## 🚀 Próximos Passos

### Se o site estiver funcionando:
1. Faça login no painel
2. Teste as funcionalidades:
   - Dashboard
   - Quartos
   - Reservas
   - Clientes
   - Configurações

### Se houver problemas:
1. Acesse a página de teste primeiro
2. Veja qual teste está falhando
3. Verifique se a API está online (pode demorar 1-2 minutos para "acordar" no Render)
4. Tente fazer login novamente

---

## 💡 Dicas

### API Lenta?
- A API no Render pode "dormir" após 15 minutos sem uso
- O primeiro acesso pode demorar 30-60 segundos
- Depois disso, fica rápido

### Limpar Cache
Se algo não estiver atualizando:
1. Pressione `Ctrl + Shift + R` (Windows) ou `Cmd + Shift + R` (Mac)
2. Isso força o navegador a baixar tudo de novo

### Testar em Modo Anônimo
Para ter certeza que não é cache:
1. Abra uma janela anônima (`Ctrl + Shift + N`)
2. Acesse o site
3. Faça login

---

## 📞 Credenciais de Teste

### Admin
- Email: `admin@hotel.com`
- Senha: `admin123`

### Recepcionista (se criado)
- Email: `recepcao@hotel.com`
- Senha: `recepcao123`

---

## ✅ Checklist de Verificação

- [ ] Site abre sem erro 404
- [ ] Página de login aparece
- [ ] Consigo fazer login
- [ ] Dashboard carrega os números
- [ ] Aba de Quartos mostra os quartos
- [ ] Consigo ver as reservas
- [ ] Consigo ver os clientes
- [ ] Configurações carregam

Se todos os itens estiverem ✅, seu site está 100% funcional!

---

## 🆘 Problemas Comuns

### "Erro de conexão"
- A API pode estar "dormindo"
- Aguarde 1-2 minutos e tente novamente
- Acesse a página de teste para verificar

### "Email ou senha inválidos"
- Verifique se está usando `admin@hotel.com` e `admin123`
- Certifique-se que não há espaços extras

### Página em branco
- Limpe o cache (`Ctrl + Shift + R`)
- Tente em modo anônimo
- Verifique o console do navegador

### Quartos não aparecem
- A API pode estar inicializando
- Aguarde alguns segundos
- Recarregue a aba de Quartos

---

**Última atualização:** Dezembro 2024
