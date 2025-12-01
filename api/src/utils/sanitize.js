/**
 * Sanitiza string removendo caracteres perigosos para SQL injection
 * NOTA: O Supabase já usa queries parametrizadas, mas esta é uma camada extra de segurança
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sanitizada
 */
function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // Remover caracteres perigosos comuns em SQL injection
  return str
    .replace(/['";\\]/g, '') // Remove aspas simples, duplas, ponto-e-vírgula e barra invertida
    .replace(/--/g, '') // Remove comentários SQL
    .replace(/\/\*/g, '') // Remove início de comentário de bloco
    .replace(/\*\//g, '') // Remove fim de comentário de bloco
    .replace(/xp_/gi, '') // Remove comandos extended procedures
    .replace(/exec\s/gi, '') // Remove comando EXEC
    .replace(/execute\s/gi, '') // Remove comando EXECUTE
    .replace(/drop\s/gi, '') // Remove comando DROP
    .replace(/delete\s/gi, '') // Remove comando DELETE
    .replace(/insert\s/gi, '') // Remove comando INSERT
    .replace(/update\s/gi, '') // Remove comando UPDATE
    .trim();
}

/**
 * Sanitiza objeto recursivamente
 * @param {Object} obj - Objeto a ser sanitizado
 * @returns {Object} Objeto sanitizado
 */
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Middleware para sanitizar body, query e params
 */
function sanitizeMiddleware(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
}

module.exports = {
  sanitizeString,
  sanitizeObject,
  sanitizeMiddleware
};
