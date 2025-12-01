const express = require('express');
const router = express.Router();
const pixService = require('../services/pix.service');
const reservaService = require('../services/reserva.service');
const { validateWebhookPix } = require('../middlewares/validation');
const logger = require('../utils/logger');

/**
 * POST /api/webhooks/pix
 * Webhook para confirmação de pagamento PIX
 * Chamado automaticamente pelo provedor PIX quando pagamento é confirmado
 */
router.post('/pix', validateWebhookPix, async (req, res, next) => {
  try {
    const { txid, valor, status, reservaId } = req.body;

    logger.info('Webhook PIX recebido', { txid, valor, status, reservaId });

    // Atualizar status do pagamento
    const pagamento = await pixService.atualizarStatusPagamento(txid, status);

    // Se pagamento foi confirmado, atualizar reserva
    if (status === 'PAGO') {
      await reservaService.confirmarReserva(pagamento.reserva_id);
      
      logger.info('Reserva confirmada após pagamento PIX', {
        reservaId: pagamento.reserva_id,
        txid,
        valor
      });
    }

    res.json({ 
      success: true,
      message: 'Webhook processado com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao processar webhook PIX', {
      error: error.message,
      body: req.body
    });
    
    next(error);
  }
});

module.exports = router;
