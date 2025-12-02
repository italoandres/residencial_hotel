const express = require('express');
const router = express.Router();
const disponibilidadeService = require('../services/disponibilidade.service');
const { supabase } = require('../db/supabase');
const { validateQuartoQuery } = require('../middlewares/validation');
const AppError = require('../utils/AppError');

/**
 * GET /api/quartos
 * Lista quartos com filtros opcionais e status visual
 * Query params: data, pessoas, tipo
 */
router.get('/', validateQuartoQuery, async (req, res, next) => {
  try {
    const { data, pessoas, tipo } = req.query;

    // Se data e pessoas fornecidos, buscar apenas disponíveis
    if (data && pessoas) {
      const quartosDisponiveis = await disponibilidadeService.verificarDisponibilidade(
        data,
        parseInt(pessoas)
      );
      
      return res.json({ quartos: quartosDisponiveis });
    }

    // Caso contrário, buscar todos os quartos com filtro opcional de tipo
    const quartos = await disponibilidadeService.buscarQuartos({ tipo });
    
    // Data de referência (hoje ou data fornecida no query)
    let dataStr;
    let dataReferencia;
    
    if (data) {
      // Se data foi fornecida, garantir que é string no formato YYYY-MM-DD
      if (typeof data === 'object' || data.includes('T')) {
        // Se é um objeto Date ou ISO string, converter para YYYY-MM-DD
        const tempDate = new Date(data);
        dataStr = tempDate.toISOString().split('T')[0];
      } else {
        // Já está no formato correto
        dataStr = data;
      }
      dataReferencia = new Date(dataStr + 'T12:00:00');
    } else {
      // Caso contrário, usar hoje
      const hoje = new Date();
      dataStr = hoje.toISOString().split('T')[0];
      dataReferencia = new Date(dataStr + 'T12:00:00');
    }
    
    console.log('Buscando quartos para data:', dataStr);
    
    // Para cada quarto, buscar status e dados do hóspede para a data específica
    const quartosComStatus = await Promise.all(quartos.map(async (quarto) => {
      try {
        // Buscar reservas que incluem a data de referência
        const { data: reservas, error } = await supabase
          .from('reservas')
          .select(`
            *,
            hospede:hospedes(*)
          `)
          .eq('quarto_id', quarto.id)
          .in('status', ['EM_ANDAMENTO', 'CONFIRMADA'])
          .lte('data_checkin', dataStr)
          .gte('data_checkout', dataStr);
        
        if (error) {
          console.error('Erro ao buscar reservas:', error);
        }
        
        // Buscar disponibilidade WhatsApp para esta data específica
        const { data: dispWhatsApp } = await supabase
          .from('disponibilidade_whatsapp')
          .select('disponivel')
          .eq('quarto_id', quarto.id)
          .eq('data', dataStr)
          .single();
        
        // Se não houver registro, considerar disponível por padrão
        const disponivelWhatsApp = dispWhatsApp ? dispWhatsApp.disponivel : true;
        
        if (reservas && reservas.length > 0) {
          console.log(`Quarto ${quarto.numero}: OCUPADO (${reservas.length} reserva(s))`);
          const reserva = reservas[0];
          
          // Calcular dias restantes até checkout a partir da data de referência
          const checkout = new Date(reserva.data_checkout + 'T00:00:00');
          checkout.setHours(0, 0, 0, 0);
          
          const diasRestantes = Math.ceil((checkout - dataReferencia) / (1000 * 60 * 60 * 24));

          return {
            ...quarto,
            status: 'OCUPADO',
            disponivel_whatsapp: disponivelWhatsApp,
            hospede: reserva.hospede,
            reserva: {
              id: reserva.id,
              data_checkin: reserva.data_checkin,
              data_checkout: reserva.data_checkout,
              numero_pessoas: reserva.numero_pessoas,
              status_pagamento: reserva.status_pagamento,
              forma_pagamento: reserva.forma_pagamento,
              valor_total: reserva.valor_total,
              valor_pago: reserva.valor_pago,
              valor_sinal: reserva.valor_sinal
            },
            data_checkout: reserva.data_checkout,
            dias_restantes: diasRestantes
          };
        } else {
          console.log(`Quarto ${quarto.numero}: DISPONÍVEL`);
          return {
            ...quarto,
            status: 'DISPONÍVEL',
            disponivel_whatsapp: disponivelWhatsApp
          };
        }
      } catch (error) {
        console.error(`Erro ao processar quarto ${quarto.numero}:`, error);
        return {
          ...quarto,
          status: 'DISPONÍVEL',
          disponivel_whatsapp: true
        };
      }
    }));
    
    console.log('Retornando', quartosComStatus.length, 'quartos');
    res.json({ quartos: quartosComStatus });
  } catch (error) {
    console.error('ERRO NA ROTA /api/quartos:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
});

/**
 * GET /api/quartos/:id
 * Busca detalhes de um quarto específico
 * Inclui status atual e dados do hóspede se ocupado
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar quarto
    const { data: quarto, error } = await supabase
      .from('quartos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !quarto) {
      throw new AppError(
        'NOT_FOUND',
        'Quarto não encontrado',
        404
      );
    }

    // Buscar reserva ativa para este quarto
    const { data: reservaAtiva } = await supabase
      .from('reservas')
      .select(`
        *,
        hospede:hospedes(*)
      `)
      .eq('quarto_id', id)
      .in('status', ['CONFIRMADA', 'EM_ANDAMENTO'])
      .order('data_checkin', { ascending: true })
      .limit(1)
      .single();

    // Calcular status do quarto
    let status = 'disponivel';
    let hospedeAtual = null;
    let checkoutPrevisto = null;

    if (reservaAtiva) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const checkin = new Date(reservaAtiva.data_checkin);
      checkin.setHours(0, 0, 0, 0);
      
      const checkout = new Date(reservaAtiva.data_checkout);
      checkout.setHours(0, 0, 0, 0);

      if (reservaAtiva.status === 'EM_ANDAMENTO') {
        status = 'ocupado';
        hospedeAtual = reservaAtiva.hospede;
        checkoutPrevisto = reservaAtiva.data_checkout;
      } else if (reservaAtiva.status === 'CONFIRMADA' && checkin <= hoje) {
        status = 'reservado';
      } else if (reservaAtiva.status === 'CONFIRMADA') {
        status = 'reservado';
      }
    }

    // Buscar todas as reservas futuras
    const { data: reservas } = await supabase
      .from('reservas')
      .select('*')
      .eq('quarto_id', id)
      .in('status', ['PENDENTE', 'CONFIRMADA', 'EM_ANDAMENTO'])
      .order('data_checkin', { ascending: true });

    res.json({
      quarto: {
        ...quarto,
        status,
        ...(hospedeAtual && { hospedeAtual }),
        ...(checkoutPrevisto && { checkoutPrevisto })
      },
      reservas: reservas || []
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/quartos/:id/toggle-whatsapp
 * Alterna disponibilidade do quarto para WhatsApp em uma data específica
 */
router.patch('/:id/toggle-whatsapp', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { disponivel, data } = req.body;

    // Validar que disponivel é boolean
    if (typeof disponivel !== 'boolean') {
      throw new AppError(
        'VALIDATION_ERROR',
        'Campo "disponivel" deve ser true ou false',
        400
      );
    }

    // Validar que data foi fornecida
    if (!data) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Campo "data" é obrigatório (formato: YYYY-MM-DD)',
        400
      );
    }

    // Verificar se o quarto existe
    const { data: quarto, error: errorQuarto } = await supabase
      .from('quartos')
      .select('numero')
      .eq('id', id)
      .single();

    if (errorQuarto || !quarto) {
      throw new AppError(
        'NOT_FOUND',
        'Quarto não encontrado',
        404
      );
    }

    // Inserir ou atualizar disponibilidade para a data específica
    const { data: disponibilidadeData, error } = await supabase
      .from('disponibilidade_whatsapp')
      .upsert({
        quarto_id: id,
        data: data,
        disponivel: disponivel,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'quarto_id,data'
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar disponibilidade:', error);
      throw new AppError(
        'DATABASE_ERROR',
        'Erro ao atualizar disponibilidade',
        500
      );
    }

    res.json({ 
      disponibilidade: disponibilidadeData,
      message: `Quarto ${quarto.numero} marcado como ${disponivel ? 'disponível' : 'indisponível'} para WhatsApp em ${data}`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
