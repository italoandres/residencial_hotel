const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db/supabase');
const AppError = require('../utils/AppError');

/**
 * Realiza login de funcionário
 * @param {string} email - Email do funcionário
 * @param {string} senha - Senha do funcionário
 * @returns {Promise<{token: string, funcionario: Object}>}
 */
async function login(email, senha) {
  // Buscar funcionário por email
  const { data: funcionario, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !funcionario) {
    throw new AppError(
      'INVALID_CREDENTIALS',
      'Email ou senha inválidos',
      401
    );
  }

  // Verificar se funcionário está ativo
  if (!funcionario.ativo) {
    throw new AppError(
      'USER_INACTIVE',
      'Funcionário inativo. Entre em contato com o administrador.',
      403
    );
  }

  // Verificar senha
  const senhaValida = await bcrypt.compare(senha, funcionario.senha_hash);

  if (!senhaValida) {
    throw new AppError(
      'INVALID_CREDENTIALS',
      'Email ou senha inválidos',
      401
    );
  }

  // Gerar token JWT
  const token = jwt.sign(
    { 
      id: funcionario.id,
      email: funcionario.email,
      nome: funcionario.nome
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '24h' }
  );

  // Retornar token e dados do funcionário (sem senha)
  return {
    token,
    funcionario: {
      id: funcionario.id,
      nome: funcionario.nome,
      email: funcionario.email,
      ativo: funcionario.ativo
    }
  };
}

/**
 * Verifica se um token JWT é válido
 * @param {string} token - Token JWT
 * @returns {Promise<Object>} Dados decodificados do token
 */
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar funcionário para garantir que ainda existe e está ativo
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

    if (!funcionario.ativo) {
      throw new AppError(
        'USER_INACTIVE',
        'Funcionário inativo',
        403
      );
    }

    return {
      valid: true,
      funcionario
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError(
        'INVALID_TOKEN',
        'Token inválido',
        401
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      throw new AppError(
        'TOKEN_EXPIRED',
        'Token expirado',
        401
      );
    }

    throw error;
  }
}

/**
 * Cria hash de senha usando bcrypt
 * @param {string} senha - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
async function hashPassword(senha) {
  return bcrypt.hash(senha, 10);
}

module.exports = {
  login,
  verifyToken,
  hashPassword
};
