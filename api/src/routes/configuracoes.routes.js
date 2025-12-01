/**
 * Rotas de Configurações
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const configuracoesService = require('../services/configuracoes.service');
const Joi = require('joi');

/**
 * GET /api/configuracoes
 * Buscar todas as configurações
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const configuracoes = await configuracoesService.buscarConfiguracoes();
    res.json({ configuracoes });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/configuracoes
 * Atualizar configurações
 */
router.patch('/', requireAuth, async (req, res, next) => {
  try {
    // Validar body
    const schema = Joi.object({
      quartosWhatsApp: Joi.number().integer().min(0).max(50),
      horarioCheckin: Joi.number().integer().min(0).max(23),
      horarioCheckout: Joi.number().integer().min(0).max(23)
    }).min(1); // Pelo menos um campo deve ser fornecido

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos',
          details: error.details.map(d => ({
            field: d.path[0],
            message: d.message
          }))
        }
      });
    }

    const configuracoes = await configuracoesService.atualizarConfiguracoes(value);
    res.json({ configuracoes });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
