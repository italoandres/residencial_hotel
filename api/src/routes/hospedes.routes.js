/**
 * Rotas de Hóspedes
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const hospedeService = require('../services/hospede.service');

/**
 * GET /api/hospedes
 * Listar todos os hóspedes
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const hospedes = await hospedeService.listarTodosHospedes();
    res.json({ hospedes });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/hospedes/cpf/:cpf
 * Buscar hóspede por CPF
 */
router.get('/cpf/:cpf', requireAuth, async (req, res, next) => {
  try {
    const { cpf } = req.params;

    // Validar formato do CPF (apenas números)
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'CPF inválido. Deve conter 11 dígitos.'
        }
      });
    }

    const hospede = await hospedeService.buscarHospedePorCPF(cpfLimpo);
    const reservas = await hospedeService.buscarReservasDoHospede(hospede.id);

    res.json({
      hospede,
      reservas
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
