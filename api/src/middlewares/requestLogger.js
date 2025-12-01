const logger = require('../utils/logger');

/**
 * Middleware para logar todas as requisições HTTP
 */
function requestLogger(req, res, next) {
  const startTime = Date.now();

  // Logar quando a resposta for enviada
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    const logData = {
      method: req.method,
      endpoint: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    // Escolher nível de log baseado no status code
    if (res.statusCode >= 500) {
      logger.error('Requisição com erro', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Requisição com erro de cliente', logData);
    } else {
      logger.info('Requisição bem-sucedida', logData);
    }
  });

  next();
}

module.exports = requestLogger;
