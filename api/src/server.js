require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const { testConnection } = require('./db/supabase');
const requestLogger = require('./middlewares/requestLogger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { sanitizeMiddleware } = require('./utils/sanitize');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const quartosRoutes = require('./routes/quartos.routes');
const reservasRoutes = require('./routes/reservas.routes');
const webhooksRoutes = require('./routes/webhooks.routes');
const hospedesRoutes = require('./routes/hospedes.routes');
const configuracoesRoutes = require('./routes/configuracoes.routes');
const ocupacaoRoutes = require('./routes/ocupacao.routes');
const checkoutAutomaticoRoutes = require('./routes/checkout-automatico.routes');

// Importar serviço de check-out automático
const { iniciarServicoCheckoutAutomatico } = require('./services/checkout-automatico.service');

// Criar app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitização de inputs
app.use(sanitizeMiddleware);

// Logger de requisições
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../web')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/quartos', quartosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/hospedes', hospedesRoutes);
app.use('/api/configuracoes', configuracoesRoutes);
app.use('/api/ocupacao', ocupacaoRoutes);
app.use('/api/checkout-automatico', checkoutAutomaticoRoutes);

// Rota raiz - servir o painel administrativo melhorado
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/painel-admin.html'));
});

// Handler para rotas não encontradas
app.use(notFoundHandler);

// Handler de erros (deve ser o último middleware)
app.use(errorHandler);

// Iniciar servidor
async function startServer() {
  try {
    // Testar conexão com banco
    logger.info('Testando conexão com Supabase...');
    const connected = await testConnection();
    
    if (!connected) {
      logger.error('Falha ao conectar com Supabase. Verifique as credenciais no .env');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando na porta ${PORT}`);
      logger.info(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`📚 API docs: http://localhost:${PORT}/`);
      
      // Iniciar serviço de check-out automático
      iniciarServicoCheckoutAutomatico();
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar
startServer();

module.exports = app;
