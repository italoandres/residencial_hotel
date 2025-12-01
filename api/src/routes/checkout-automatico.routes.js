/**
 * Rotas de Check-out Automático
 * Para admin executar manualmente ou verificar status
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const checkoutAutomaticoService = require('../services/checkout-automatico.service');

/**
 * POST /api/checkout-automatico/executar
 * Executa manualmente o processo de check-out automático
 */
router.post('/executar', requireAuth, async (req, res, next) => {
  try {
    const resultado = await checkoutAutomaticoService.processarCheckoutsAutomaticos();
    
    res.json({
      success: true,
      ...resultado
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
