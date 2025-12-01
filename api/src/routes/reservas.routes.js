const express = require('express');
const router = express.Router();
const reservaService = require('../services/reserva.service');
const { requireAuth } = require('../middlewares/auth');
const { validateReserva, validateReservasQuery } = require('../middlewares/validation');

/**
 * POST /api/reservas
 * Cria uma nova pré-reserva
 * Público (não requer autenticação) - usado pelo N8N/WhatsApp
 */
router.post('/', validateReserva, async (req, res, next) => {
  try {
    const resultado = await reservaService.criarPreReserva(req.body);
    
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/reservas
 * Lista todas as reservas com filtros opcionais
 * Requer autenticação
 */
router.get('/', requireAuth, validateReservasQuery, async (req, res, next) => {
  try {
    const reservas = await reservaService.buscarReservas(req.query);
    
    res.json({ reservas });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/reservas/:id
 * Busca detalhes completos de uma reserva
 * Requer autenticação
 */
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const reserva = await reservaService.buscarReservaPorId(id);
    
    res.json(reserva);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/reservas/:id/check-in
 * Realiza check-in de uma reserva
 * Requer autenticação
 */
router.patch('/:id/check-in', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const reserva = await reservaService.realizarCheckIn(id);
    
    res.json({ 
      message: 'Check-in realizado com sucesso',
      reserva 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/reservas/:id/check-out
 * Realiza check-out de uma reserva
 * Requer autenticação
 */
router.patch('/:id/check-out', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const reserva = await reservaService.realizarCheckOut(id);
    
    res.json({ 
      message: 'Check-out realizado com sucesso',
      reserva 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/reservas/:id
 * Cancela uma reserva
 * Requer autenticação
 */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await reservaService.cancelarReserva(id);
    
    res.json({ 
      message: 'Reserva cancelada com sucesso'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
