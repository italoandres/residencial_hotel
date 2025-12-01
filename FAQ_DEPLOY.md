# ❓ FAQ - PERGUNTAS FREQUENTES SOBRE DEPLOY

## 🚀 DEPLOY

### P: Quanto tempo leva para fazer o deploy?
**R:** Aproximadamente 20 minutos se você seguir o `DEPLOY_RAPIDO.md`.

### P: Preciso pagar alguma coisa?
**R:** Não! Você pode usar o plano gratuito do Render e Supabase. Custos só se quiser plano profissional.

### P: O que é "sleep" do Render?
**R:** No plano gratuito, o Render "dorme" após 15 minutos de inatividade. O primeiro acesso depois disso demora 30-60 segundos para "acordar".

### P: Como evito o "sleep"?
**R:** Migre para o plano pago ($7/mês por serviço) ou acesse o sistema 2 minutos antes da demonstração.

### P: Posso usar outro serviço além do Render?
**R:** Sim! Você pode usar Railway, Heroku, Vercel (frontend), ou qualquer serviço que suporte Node.js.

### P: Preciso de domínio próprio?
**R:** Não é obrigatório. O Render fornece um domínio gratuito (ex: `seu-app.onrender.com`). Domínio próprio é opcional.

---

## 🔧 CONFIGURAÇÃO

### P: Onde encontro as credenciais do Supabase?
**R:** 
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em Settings → API
4. Copie Project URL e anon/public key

### P: O que é JWT_SECRET?
**R:** É uma chave secreta usada para assinar tokens de autenticação. Pode ser qualquer string longa e aleatória.

### P: Como gero um JWT_SECRET seguro?
**R:** Use qualquer string longa (mínimo 32 caracteres). Exemplo: `hotel_residencial_hortel_secret_2024_muito_seguro_123456`

### P: Preciso configurar CORS?
**R:** Não manualmente. O código já está configurado para aceitar requisições do frontend.

### P: Como sei se as variáveis estão corretas?
**R:** Teste o endpoint `/health` do backend. Se retornar `{"status":"ok"}`, está tudo certo.

---

## 🐛 PROBLEMAS COMUNS

### P: Backend não inicia, o que fazer?
**R:** 
1. Verifique os logs no Render
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique se o Supabase está acessível
4. Confirme que o build completou sem erros

### P: Frontend não conecta ao backend, o que fazer?
**R:**
1. Verifique se `VITE_API_URL` está correto
2. Confirme que o backend está rodando
3. Abra o console do navegador (F12) e veja os erros
4. Verifique se há erros de CORS

### P: Login não funciona, o que fazer?
**R:**
1. Confirme que o usuário admin existe no banco
2. Execute o seed do banco se necessário
3. Verifique se `JWT_SECRET` está configurado
4. Veja os logs do backend para erros

### P: "Failed to fetch" no frontend, o que significa?
**R:** O frontend não consegue se conectar ao backend. Verifique:
1. Backend está rodando?
2. `VITE_API_URL` está correto?
3. Há erros de CORS?

### P: Erro 500 no backend, o que fazer?
**R:**
1. Veja os logs detalhados no Render
2. Verifique conexão com Supabase
3. Confirme que as tabelas existem no banco
4. Execute as migrations se necessário

---

## 📊 DADOS E BANCO

### P: Como criar o usuário admin?
**R:** Execute o seed do banco. Veja `api/src/db/seed.js` ou execute manualmente no Supabase SQL Editor.

### P: Como adicionar dados de teste?
**R:** Siga o guia `PREPARAR_DADOS_DEMO.md` que tem scripts SQL prontos.

### P: Posso usar banco local?
**R:** Sim, mas não é recomendado para demonstração. Use Supabase para ter o sistema totalmente online.

### P: Como fazer backup do banco?
**R:** Supabase faz backup automático. Você também pode exportar via SQL no dashboard.

### P: Como resetar o banco?
**R:** Execute `DELETE` nas tabelas (cuidado!) ou recrie o projeto no Supabase.

---

## 🎬 DEMONSTRAÇÃO

### P: Quanto tempo dura a demonstração?
**R:** Aproximadamente 20 minutos seguindo o roteiro do `CHECKLIST_DEMONSTRACAO.md`.

### P: O que mostrar primeiro?
**R:** Comece com login, depois dashboard, depois funcionalidades principais (quartos, hóspedes, reservas).

### P: E se algo não funcionar durante a demo?
**R:** Mantenha a calma, explique que é algo pontual, mostre outras funcionalidades, e ofereça demonstração posterior.

### P: Preciso de internet durante a demo?
**R:** Sim, o sistema está online. Certifique-se de ter internet estável.

### P: Posso fazer a demo no celular?
**R:** Sim! O sistema é responsivo e funciona em qualquer dispositivo.

### P: Como lidar com perguntas técnicas?
**R:** Seja honesto. Se não souber, anote e responda depois. Foque nos benefícios práticos.

---

## 💰 CUSTOS

### P: Quanto custa manter o sistema online?
**R:** 
- Gratuito: R$ 0/mês (com limitações)
- Profissional: R$ 70-195/mês (sem limitações)

### P: Vale a pena o plano pago?
**R:** Sim, se o hotel usar diariamente. Elimina o "sleep" e é mais rápido e confiável.

### P: Posso começar gratuito e migrar depois?
**R:** Sim! Comece gratuito para testar, migre para pago se o cliente aprovar.

### P: Há custos ocultos?
**R:** Não. Render e Supabase são transparentes. Você só paga se ultrapassar os limites gratuitos.

### P: Como cobrar do cliente?
**R:** Você decide. Pode cobrar mensalidade, taxa única, ou percentual sobre economia gerada.

---

## 🔒 SEGURANÇA

### P: O sistema é seguro?
**R:** Sim! Usa autenticação JWT, HTTPS automático, e o Supabase tem segurança enterprise.

### P: Senhas são criptografadas?
**R:** Sim, usando bcrypt com salt rounds.

### P: Posso mudar a senha do admin?
**R:** Sim, atualize no banco ou crie interface para isso.

### P: Como proteger as variáveis de ambiente?
**R:** Nunca faça commit delas no GitHub. Use apenas as variáveis de ambiente do Render.

### P: O que fazer se alguém descobrir a senha?
**R:** Mude imediatamente no banco e notifique o cliente.

---

## 🔄 ATUALIZAÇÕES

### P: Como atualizar o sistema depois do deploy?
**R:**
1. Faça as mudanças no código local
2. Commit e push para o GitHub
3. Render faz deploy automático

### P: Posso fazer deploy manual?
**R:** Sim, no dashboard do Render clique em "Manual Deploy".

### P: Como reverter para versão anterior?
**R:** No Render, vá em "Deploys" e selecione uma versão anterior para fazer rollback.

### P: Preciso parar o sistema para atualizar?
**R:** Não, o Render faz deploy sem downtime (zero-downtime deployment).

---

## 📱 INTEGRAÇÃO WHATSAPP

### P: Como funciona a integração com WhatsApp?
**R:** Usa N8N para automatizar. Cliente manda mensagem, N8N chama a API, sistema processa.

### P: Preciso configurar N8N agora?
**R:** Não é obrigatório para a demonstração. Você pode explicar o conceito.

### P: Quanto custa o N8N?
**R:** Tem plano gratuito (self-hosted) ou pago (cloud, a partir de $20/mês).

### P: É difícil configurar N8N?
**R:** Não, mas requer conhecimento técnico. Há tutoriais disponíveis.

---

## 🎯 PRÓXIMOS PASSOS

### P: Cliente aprovou, e agora?
**R:**
1. Migre para plano profissional (opcional)
2. Configure domínio personalizado (opcional)
3. Treine a equipe
4. Estabeleça canal de suporte
5. Acompanhe uso e feedback

### P: Cliente pediu mudanças, como proceder?
**R:**
1. Anote todas as solicitações
2. Avalie viabilidade e esforço
3. Faça orçamento se necessário
4. Implemente as mudanças
5. Faça nova demonstração

### P: Como treinar a equipe do hotel?
**R:**
1. Crie manual de uso simplificado
2. Faça sessão de treinamento presencial
3. Deixe contato para dúvidas
4. Acompanhe primeiros dias de uso

### P: Como cobrar suporte?
**R:** Você decide. Pode incluir no pacote, cobrar por hora, ou mensalidade de suporte.

---

## 🆘 AJUDA ADICIONAL

### P: Onde encontro mais informação?
**R:** Consulte os arquivos:
- `GUIA_DEPLOY_DEMONSTRACAO.md` - Guia completo
- `INDICE_DEPLOY.md` - Índice de todos os arquivos
- `TROUBLESHOOTING.md` - Solução de problemas

### P: Posso pedir ajuda?
**R:** Sim! Consulte:
- Documentação do Render: https://render.com/docs
- Documentação do Supabase: https://supabase.com/docs
- Comunidade do Render: https://community.render.com

### P: Como reportar bugs?
**R:** 
1. Anote o erro exato
2. Veja os logs (Render + console do navegador)
3. Tente reproduzir o erro
4. Documente os passos
5. Corrija ou peça ajuda

### P: Posso modificar o sistema?
**R:** Sim! O código é seu. Modifique como quiser.

---

## 💡 DICAS EXTRAS

### P: Como impressionar o cliente?
**R:**
1. Prepare dados realistas
2. Pratique a demonstração
3. Foque nos benefícios práticos
4. Deixe o cliente interagir
5. Antecipe perguntas

### P: Como lidar com objeções?
**R:**
- "É caro" → Mostre ROI e economia de tempo
- "É complicado" → Mostre como é fácil de usar
- "Não preciso" → Mostre problemas que resolve
- "Vou pensar" → Ofereça período de teste

### P: Como fechar a venda?
**R:**
1. Recapitule benefícios
2. Mostre que está pronto para usar
3. Ofereça período de teste
4. Defina próximos passos claros
5. Deixe contato para dúvidas

---

## 🎓 APRENDIZADO

### P: Preciso saber programar para fazer deploy?
**R:** Não! Basta seguir o `DEPLOY_RAPIDO.md` passo a passo.

### P: Preciso saber programar para demonstrar?
**R:** Não! Basta seguir o `CHECKLIST_DEMONSTRACAO.md`.

### P: E se eu quiser modificar o sistema?
**R:** Aí sim, precisará de conhecimento em Node.js, React, e SQL.

### P: Onde aprender mais?
**R:**
- Node.js: https://nodejs.org/en/docs/
- React: https://react.dev/
- Supabase: https://supabase.com/docs
- Render: https://render.com/docs

---

## ✅ CHECKLIST FINAL

Antes de fazer qualquer coisa, confirme:

- [ ] Li o `LEIA_ME_DEPLOY.md`
- [ ] Entendi o fluxo geral
- [ ] Tenho todas as contas necessárias
- [ ] Tenho as credenciais anotadas
- [ ] Sei qual arquivo consultar para cada situação
- [ ] Estou pronto para começar!

---

**AINDA TEM DÚVIDAS?**

Consulte o `INDICE_DEPLOY.md` para encontrar o arquivo certo para sua situação.

**BOA SORTE! 🚀**
