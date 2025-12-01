const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Middleware para tratar erros da aplicação
 */
function errorHandler(err, req, res, next) {
  // Log do erro
  const logContext = {
    endpoint: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack,
    body: req.body,
    query: req.query,
    params: req.params
  };

  if (err.statusCode >= 500) {
    logger.error('Erro interno do servidor', logContext);
  } else if (err.statusCode >= 400) {
    logger.warn('Erro de cliente', logContext);
  }

  // Se for um AppError, usar os dados dele
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Erros de validação do Joi
  if (err.isJoi) {
    const details = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos fornecidos',
        details,
        timestamp: new Date().toISOString(),
        path: req.path
      }
    });
  }

  // Erros do Supabase
  if (err.code && err.code.startsWith('PGRST')) {
    logger.error('Erro do Supabase', { ...logContext, supabaseCode: err.code });
    
    return res.status(503).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Erro ao acessar o banco de dados',
        timestamp: new Date().toISOString(),
        path: req.path
      }
    });
  }

  // Erro genérico - não expor detalhes em produção
  const isProduction = process.env.NODE_ENV === 'production';
  
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProduction 
        ? 'Erro interno do servidor' 
        : err.message,
      timestamp: new Date().toISOString(),
      path: req.path,
      // Não expor stack trace em produção
      ...(isProduction ? {} : { stack: err.stack })
    }
  });
}

/**
 * Middleware para tratar rotas não encontradas
 */
function notFoundHandler(req, res, next) {
  const error = new AppError(
    'NOT_FOUND',
    `Rota ${req.method} ${req.path} não encontrada`,
    404
  );
  
  logger.warn('Rota não encontrada', {
    endpoint: req.path,
    method: req.method
  });

  res.status(404).json(error.toJSON());
}

module.exports = {
  errorHandler,
  notFoundHandler
};
