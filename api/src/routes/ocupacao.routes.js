/**
 * Rotas de Ocupação Manual
 * Para admin cadastrar hóspede e ocupar quarto diretamente
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const hospedeService = require('../services/hospede.service');
const reservaService = require('../services/reserva.service');
const Joi = require('joi');

/**
 * POST /api/ocupacao/manual
 * Cadastra hóspede e ocupa quarto imediatamente
 */
router.post('/manual', requireAuth, async (req, res, next) => {
  try {
    // Log dos dados recebidos ANTES da validação
    console.log('=== DADOS RECEBIDOS ===');
    console.log(JSON.stringify(req.body, null, 2));
    
    // Validar dados
    const schema = Joi.object({
      // Dados do hóspede (obrigatórios)
      nome: Joi.string().required(),
      cpf: Joi.string().min(11).max(11).required(),
      telefone: Joi.string().required(),
      cidade: Joi.string().required(),
      
      // Dados do hóspede (opcionais)
      email: Joi.string().email().allow('', null).optional(),
      rua: Joi.string().allow('', null).optional(),
      numero: Joi.string().allow('', null).optional(),
      bairro: Joi.string().allow('', null).optional(),
      cep: Joi.string().allow('', null).optional(),
      
      // Dados da reserva
      quarto_id: Joi.string().uuid().required(),
      data_checkin: Joi.date().required(),
      data_checkout: Joi.date().greater(Joi.ref('data_checkin')).required(),
      numero_pessoas: Joi.number().integer().min(1).max(3).required(),
      
      // Dados de pagamento
      status_pagamento: Joi.string().valid('nao_pago', 'pago', 'sinal').required(),
      forma_pagamento: Joi.string().valid('dinheiro', 'cartao', 'pix').allow('', null).optional(),
      valor_pago: Joi.number().positive().allow(null).optional(),
      valor_sinal: Joi.number().positive().allow(null).optional()
    }).unknown(true); // Permitir campos extras temporariamente

    // Converter strings vazias para null
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === '' || req.body[key] === 'null') {
        req.body[key] = null;
      }
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log('Erro de validação:', error.details);
      console.log('Dados recebidos:', req.body);
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos: ' + error.details.map(d => `${d.path[0]}: ${d.message}`).join(', '),
          details: error.details.map(d => ({
            field: d.path[0],
            message: d.message
          }))
        }
      });
    }

    // Buscar ou criar hóspede
    let hospede;
    try {
      // Tentar buscar hóspede existente por CPF
      hospede = await hospedeService.buscarHospedePorCPF(value.cpf);
      console.log('Hóspede existente encontrado:', hospede.id);
    } catch (error) {
      // Se não encontrar, criar novo
      console.log('Criando novo hóspede...');
      hospede = await hospedeService.criarHospedeCompleto({
        nome: value.nome,
        cpf: value.cpf,
        telefone: value.telefone,
        email: value.email,
        cidade: value.cidade,
        rua: value.rua,
        numero: value.numero,
        bairro: value.bairro,
        cep: value.cep
      });
    }

    // Criar reserva com status EM_ANDAMENTO (já ocupado)
    const reserva = await reservaService.criarReservaManual({
      hospede_id: hospede.id,
      quarto_id: value.quarto_id,
      data_checkin: value.data_checkin,
      data_checkout: value.data_checkout,
      numero_pessoas: value.numero_pessoas,
      status_pagamento: value.status_pagamento,
      forma_pagamento: value.forma_pagamento,
      valor_pago: value.valor_pago,
      valor_sinal: value.valor_sinal
    });

    res.status(201).json({
      message: 'Quarto ocupado com sucesso',
      hospede,
      reserva
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/ocupacao/desocupar/:quarto_id
 * Desocupa quarto (finaliza reserva ativa)
 */
router.patch('/desocupar/:quarto_id', requireAuth, async (req, res, next) => {
  try {
    const { quarto_id } = req.params;
    const { supabase } = require('../db/supabase');

    // Buscar reserva ativa do quarto
    const { data: reserva, error: errorReserva } = await supabase
      .from('reservas')
      .select('*')
      .eq('quarto_id', quarto_id)
      .eq('status', 'EM_ANDAMENTO')
      .single();

    if (errorReserva || !reserva) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Nenhuma reserva ativa encontrada para este quarto'
        }
      });
    }

    // Finalizar reserva (check-out)
    const reservaFinalizada = await reservaService.realizarCheckOut(reserva.id);

    res.json({
      message: 'Quarto desocupado com sucesso',
      reserva: reservaFinalizada
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
