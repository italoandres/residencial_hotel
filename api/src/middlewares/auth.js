const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { supabase } = require('../db/supabase');

/**
 * Middleware que exige autenticação JWT
 * Adiciona req.user com dados do funcionário autenticado
 */
async function requireAuth(req, res, next) {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError(
        'NO_TOKEN',
        'Token de autenticação não fornecido',
        401
      );
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError(
        'INVALID_TOKEN_FORMAT',
        'Formato de token inválido. Use: Bearer TOKEN',
        401
      );
    }

    const token = parts[1];

    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar funcionário no banco
    const { data: funcionario, error } = await supabase
      .from('funcionarios')
      .select('id, nome, email, ativo')
      .eq('id', decoded.id)
      .single();

    if (error || !funcionario) {
      throw new AppError(
        'USER_NOT_FOUND',
        'Funcionário não encontrado',
        401
      );
    }

    // Verificar se funcionário está ativo
    if (!funcionario.ativo) {
      throw new AppError(
        'USER_INACTIVE',
        'Funcionário inativo',
        403
      );
    }

    // Adicionar dados do funcionário ao request
    req.user = funcionario;
    
    next();
  } catch (error) {
    // Erros específicos do JWT
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError(
        'INVALID_TOKEN',
        'Token inválido',
        401
      ));
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(
        'TOKEN_EXPIRED',
        'Token expirado',
        401
      ));
    }

    next(error);
  }
}

/**
 * Middleware opcional que adiciona dados do usuário se token estiver presente
 * Não retorna erro se token não estiver presente
 */
async function attachUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: funcionario } = await supabase
      .from('funcionarios')
      .select('id, nome, email, ativo')
      .eq('id', decoded.id)
      .single();

    if (funcionario && funcionario.ativo) {
      req.user = funcionario;
    }

    next();
  } catch (error) {
    // Ignorar erros e continuar sem usuário
    next();
  }
}

module.exports = {
  requireAuth,
  attachUser
};
