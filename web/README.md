# 🎨 Painel Admin - Residencial Hortel

Interface visual para funcionários gerenciarem o hotel.

## ⚡ Opção Recomendada: Painel HTML Simples

**Use o arquivo `painel-simples.html` para começar rapidamente!**

✅ Sem necessidade de build ou instalação  
✅ Abre direto no navegador  
✅ Conecta automaticamente com a API  
✅ Interface limpa e responsiva  

**Como usar:**
1. Certifique-se que a API está rodando (`cd api && node server.js`)
2. Abra `painel-simples.html` no navegador
3. Pronto! O sistema já está funcionando

📖 Veja o **GUIA_RAPIDO.md** para instruções completas.

---

## 🔧 Opção Avançada: Painel React

Se preferir usar o painel React com mais recursos:

## 🚀 Instalação

```bash
cd web
npm install
```

## ▶️ Executar

```bash
npm run dev
```

O painel estará disponível em: **http://localhost:5173**

## 🔐 Login

**Credenciais padrão:**
- Email: `admin@residencialhortel.com`
- Senha: `admin123`

## 📱 Funcionalidades

### ✅ Dashboard
- Visão geral com métricas
- Total de quartos
- Quartos disponíveis
- Reservas ativas
- Check-ins do dia

### ✅ Quartos
- Lista todos os quartos
- Filtro por tipo (Individual/Triplo)
- Informações de capacidade e preço

### ✅ Reservas
- Lista todas as reservas
- Filtros por status
- Botões de ação:
  - **Check-in** (para reservas confirmadas)
  - **Check-out** (para reservas em andamento)
  - **Cancelar** (para reservas pendentes/confirmadas)

## 🎨 Tecnologias

- React 18
- React Router DOM
- Axios
- Vite
- CSS Modules

## 📝 Estrutura

```
web/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Layout com navbar e sidebar
│   ├── contexts/
│   │   └── AuthContext.jsx     # Contexto de autenticação
│   ├── pages/
│   │   ├── LoginPage.jsx       # Página de login
│   │   ├── DashboardPage.jsx   # Dashboard
│   │   ├── QuartosPage.jsx     # Gestão de quartos
│   │   └── ReservasPage.jsx    # Gestão de reservas
│   ├── services/
│   │   ├── api.js              # Cliente HTTP
│   │   ├── auth.js             # Serviços de autenticação
│   │   └── storage.js          # LocalStorage
│   ├── App.jsx                 # App principal
│   └── main.jsx                # Entry point
├── package.json
└── vite.config.js
```

## 🔧 Configuração

O painel está configurado para se conectar automaticamente com a API em `http://localhost:3000`.

Se a API estiver em outra porta, edite `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:PORTA_DA_API',
    changeOrigin: true
  }
}
```

## 📸 Screenshots

### Login
Tela de login com validação de credenciais.

### Dashboard
Métricas em tempo real do hotel.

### Quartos
Lista visual de todos os quartos com filtros.

### Reservas
Gestão completa de reservas com ações rápidas.

## 🐛 Troubleshooting

### Erro de conexão com API
- Verifique se a API está rodando em `http://localhost:3000`
- Verifique se o CORS está habilitado na API

### Erro ao fazer login
- Verifique as credenciais
- Verifique se o banco de dados foi populado (seed)

## 📞 Suporte

Para dúvidas, consulte a documentação da API em `api/README.md`
