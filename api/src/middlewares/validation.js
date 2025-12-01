const Joi = require('joi');
const AppError = require('../utils/AppError');

// Schemas de validação
const schemas = {
  // Login
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório'
    }),
    senha: Joi.string().min(6).required().messages({
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
      'any.required': 'Senha é obrigatória'
    })
  }),

  // Criação de reserva
  criarReserva: Joi.object({
    hospedeNome: Joi.string().min(3).max(255).required().messages({
      'string.min': 'Nome deve ter no mínimo 3 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres',
      'any.required': 'Nome do hóspede é obrigatório'
    }),
    hospedeTelefone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
      'string.pattern.base': 'Telefone inválido',
      'any.required': 'Telefone é obrigatório'
    }),
    dataCheckin: Joi.date().iso().min('now').required().messages({
      'date.base': 'Data de check-in inválida',
      'date.min': 'Data de check-in não pode ser no passado',
      'any.required': 'Data de check-in é obrigatória'
    }),
    dataCheckout: Joi.date().iso().greater(Joi.ref('dataCheckin')).messages({
      'date.base': 'Data de check-out inválida',
      'date.greater': 'Data de check-out deve ser posterior ao check-in'
    }),
    numeroPessoas: Joi.number().integer().min(1).max(3).required().messages({
      'number.base': 'Número de pessoas inválido',
      'number.min': 'Número de pessoas deve ser no mínimo 1',
      'number.max': 'Número de pessoas deve ser no máximo 3',
      'any.required': 'Número de pessoas é obrigatório'
    })
  }),

  // Query de quartos
  quartosQuery: Joi.object({
    data: Joi.date().iso().optional(),
    pessoas: Joi.number().integer().min(1).max(3).optional(),
    tipo: Joi.string().valid('INDIVIDUAL', 'TRIPLO').optional()
  }),

  // Query de reservas
  reservasQuery: Joi.object({
    status: Joi.string().valid('PENDENTE', 'CONFIRMADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA').optional(),
    data: Joi.date().iso().optional()
  }),

  // Webhook PIX
  webhookPix: Joi.object({
    txid: Joi.string().required(),
    valor: Joi.number().positive().required(),
    status: Joi.string().valid('PAGO', 'CANCELADO', 'EXPIRADO').required(),
    reservaId: Joi.string().uuid().optional()
  })
};

/**
 * Cria middleware de validação para um schema específico
 * @param {string} schemaName - Nome do schema a ser usado
 * @param {string} source - Fonte dos dados ('body', 'query', 'params')
 */
function validate(schemaName, source = 'body') {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return next(new AppError(
        'INVALID_SCHEMA',
        `Schema de validação '${schemaName}' não encontrado`,
        500
      ));
    }

    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return next(new AppError(
        'VALIDATION_ERROR',
        'Dados inválidos fornecidos',
        400,
        details
      ));
    }

    // Substituir dados originais pelos validados
    req[source] = value;
    next();
  };
}

// Middlewares específicos
const validateLogin = validate('login', 'body');
const validateReserva = validate('criarReserva', 'body');
const validateQuartoQuery = validate('quartosQuery', 'query');
const validateReservasQuery = validate('reservasQuery', 'query');
const validateWebhookPix = validate('webhookPix', 'body');

module.exports = {
  validate,
  validateLogin,
  validateReserva,
  validateQuartoQuery,
  validateReservasQuery,
  validateWebhookPix
};
