# 🔄 Guia de Migração - Sistema Residencial Hortel

Este documento descreve como migrar entre versões do sistema.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Antes de Migrar](#antes-de-migrar)
- [Migração v1.0.0 → v1.1.0](#migração-v100--v110-futuro)
- [Rollback](#rollback)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### O Que É Migração?

Migração é o processo de atualizar o sistema de uma versão para outra, incluindo:
- Atualização de código
- Mudanças no banco de dados
- Novas configurações
- Atualizações de dependências

### Quando Migrar?

Migre quando:
- ✅ Houver uma nova versão estável
- ✅ Precisar de novas funcionalidades
- ✅ Houver correções de segurança importantes
- ✅ Houver correções de bugs críticos

Não migre quando:
- ❌ Sistema está em produção crítica
- ❌ Não há backup recente
- ❌ Não há tempo para testes
- ❌ Versão é beta/experimental

---

## 🔒 Antes de Migrar

### Checklist Pré-Migração

- [ ] **Backup completo do banco de dados**
- [ ] **Backup do código atual**
- [ ] **Backup do arquivo .env**
- [ ] **Documentar configurações atuais**
- [ ] **Ler CHANGELOG da nova versão**
- [ ] **Verificar breaking changes**
- [ ] **Planejar janela de manutenção**
- [ ] **Notificar usuários (se aplicável)**
- [ ] **Preparar ambiente de teste**

### Fazer Backup

#### Banco de Dados (Supabase)

```bash
# No Supabase Dashboard:
# 1. Vá para Database > Backups
# 2. Clique em "Create Backup"
# 3. Aguarde conclusão
# 4. Download do backup (opcional)

# Ou via SQL:
# Exporte cada tabela
```

#### Código

```bash
# Criar backup do código
cd ..
cp -r hotel_system_base hotel_system_base_backup_v1.0.0

# Ou criar arquivo zip
tar -czf hotel_system_backup_v1.0.0.tar.gz hotel_system_base/
```

#### Configurações

```bash
# Backup do .env
cp api/.env api/.env.backup

# Backup de logs (opcional)
cp -r api/logs api/logs_backup
```

---

## 🚀 Migração v1.0.0 → v1.1.0 (Futuro)

> **Nota:** Esta seção será atualizada quando a v1.1.0 for lançada.

### Mudanças Esperadas

#### Código
- Novos endpoints de relatórios
- Melhorias de performance
- Correções de bugs

#### Banco de Dados
- Possível nova tabela `relatorios`
- Novos índices para performance
- Novos campos em tabelas existentes

#### Configurações
- Novas variáveis de ambiente
- Configurações de email
- Configurações de relatórios

### Passos de Migração

#### 1. Preparação

```bash
# 1. Fazer backup (veja seção anterior)

# 2. Parar o sistema
# Feche o servidor API (Ctrl+C)

# 3. Baixar nova versão
git pull origin main
# Ou baixar arquivo zip da nova versão
```

#### 2. Atualizar Dependências

```bash
cd api
npm install
```

#### 3. Atualizar Banco de Dados

```bash
# Executar migrations da nova versão
# (Se houver arquivo de migration)
# No Supabase SQL Editor, execute:
# api/src/db/migrations/002_update_v1.1.0.sql
```

#### 4. Atualizar Configurações

```bash
# Comparar .env.example com seu .env
# Adicionar novas variáveis se necessário

# Exemplo:
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=seu-email@gmail.com
# EMAIL_PASS=sua-senha
```

#### 5. Testar

```bash
# Iniciar API
node server.js

# Verificar logs
tail -f logs/combined.log

# Testar endpoints principais
curl http://localhost:3000/api/quartos
curl http://localhost:3000/api/reservas -H "Authorization: Bearer TOKEN"

# Abrir painel e testar funcionalidades
```

#### 6. Validar

- [ ] API inicia sem erros
- [ ] Endpoints respondem corretamente
- [ ] Painel carrega normalmente
- [ ] Login funciona
- [ ] Reservas funcionam
- [ ] Check-in/out funcionam
- [ ] Novas funcionalidades funcionam

---

## ⏮️ Rollback

Se algo der errado durante a migração:

### Rollback de Código

```bash
# Parar o sistema
# Ctrl+C no terminal da API

# Restaurar código anterior
cd ..
rm -rf hotel_system_base
mv hotel_system_base_backup_v1.0.0 hotel_system_base

# Ou descompactar backup
tar -xzf hotel_system_backup_v1.0.0.tar.gz

# Reiniciar sistema
cd hotel_system_base/api
node server.js
```

### Rollback de Banco de Dados

```bash
# No Supabase Dashboard:
# 1. Vá para Database > Backups
# 2. Selecione o backup anterior
# 3. Clique em "Restore"
# 4. Confirme a restauração
# 5. Aguarde conclusão
```

### Rollback de Configurações

```bash
# Restaurar .env
cp api/.env.backup api/.env
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"

**Causa:** Dependências não instaladas

**Solução:**
```bash
cd api
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Table does not exist"

**Causa:** Migration não executada

**Solução:**
```bash
# Execute a migration no Supabase SQL Editor
# Arquivo: api/src/db/migrations/00X_*.sql
```

### Erro: "Invalid token"

**Causa:** JWT_SECRET mudou

**Solução:**
```bash
# Verifique JWT_SECRET no .env
# Faça login novamente no painel
# Token antigo será invalidado
```

### Erro: "Port already in use"

**Causa:** Processo anterior ainda rodando

**Solução:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Sistema lento após migração

**Causa:** Índices não criados ou cache não limpo

**Solução:**
```bash
# Verificar índices no banco
# Limpar cache do navegador
# Reiniciar API
```

---

## 📝 Checklist Pós-Migração

Após migração bem-sucedida:

- [ ] Sistema funcionando normalmente
- [ ] Todas as funcionalidades testadas
- [ ] Logs sem erros críticos
- [ ] Performance aceitável
- [ ] Backup da nova versão criado
- [ ] Documentação atualizada
- [ ] Usuários notificados (se aplicável)
- [ ] Monitorar por 24-48h

---

## 📊 Histórico de Migrações

### v1.0.0 (Atual)

**Data:** Novembro 2024  
**Tipo:** Lançamento inicial  
**Mudanças:** Sistema completo implementado  
**Downtime:** N/A  
**Problemas:** Nenhum  

---

### v1.1.0 (Planejado)

**Data:** TBD  
**Tipo:** Minor release  
**Mudanças Esperadas:**
- Relatórios de ocupação
- Relatórios de faturamento
- Notificações por email
- Melhorias de performance

**Downtime Estimado:** ~15 minutos  
**Complexidade:** Média  

---

### v2.0.0 (Planejado)

**Data:** TBD  
**Tipo:** Major release  
**Mudanças Esperadas:**
- App mobile
- Multi-idioma
- Multi-propriedade
- Breaking changes na API

**Downtime Estimado:** ~1 hora  
**Complexidade:** Alta  

---

## 🔍 Verificação de Versão

### Verificar Versão Atual

```bash
# No código
cat package.json | grep version

# Na API
curl http://localhost:3000/api/health

# No painel
# Rodapé do painel mostra versão
```

### Comparar Versões

```bash
# Ver mudanças entre versões
cat CHANGELOG.md

# Ver commits
git log v1.0.0..v1.1.0
```

---

## 📞 Suporte

Se tiver problemas durante a migração:

1. **Consulte** este guia
2. **Verifique** TROUBLESHOOTING.md
3. **Revise** logs em api/logs/
4. **Faça** rollback se necessário
5. **Documente** o problema

---

## 🎯 Melhores Práticas

### Antes da Migração
- ✅ Sempre faça backup
- ✅ Teste em ambiente de desenvolvimento primeiro
- ✅ Leia o CHANGELOG completo
- ✅ Planeje janela de manutenção
- ✅ Notifique usuários

### Durante a Migração
- ✅ Siga os passos na ordem
- ✅ Não pule etapas
- ✅ Monitore logs
- ✅ Teste cada etapa
- ✅ Documente problemas

### Após a Migração
- ✅ Teste todas as funcionalidades
- ✅ Monitore por alguns dias
- ✅ Mantenha backup da versão anterior
- ✅ Atualize documentação
- ✅ Colete feedback

---

## 📚 Recursos Adicionais

- [CHANGELOG.md](CHANGELOG.md) - Histórico de mudanças
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solução de problemas
- [CHECKLIST.md](CHECKLIST.md) - Verificação do sistema
- [COMO_USAR.md](COMO_USAR.md) - Guia de uso

---

**Última atualização:** Novembro 2024  
**Versão do documento:** 1.0.0
