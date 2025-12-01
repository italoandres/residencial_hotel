const { supabase } = require('../db/supabase');
const AppError = require('../utils/AppError');
const configuracoesService = require('./configuracoes.service');

/**
 * Verifica disponibilidade de quartos para uma data e número de pessoas
 * @param {Date|string} dataCheckin - Data de check-in
 * @param {number} numeroPessoas - Número de pessoas
 * @param {Date|string} dataCheckout - Data de check-out (opcional, padrão: 1 dia após check-in)
 * @param {boolean} limitarParaWhatsApp - Se true, limita quantidade baseado na configuração
 * @returns {Promise<Array>} Lista de quartos disponíveis
 */
async function verificarDisponibilidade(dataCheckin, numeroPessoas, dataCheckout = null, limitarParaWhatsApp = false) {
  // Converter datas para objetos Date
  const checkin = new Date(dataCheckin);
  const checkout = dataCheckout ? new Date(dataCheckout) : new Date(checkin.getTime() + 24 * 60 * 60 * 1000);

  // Validar datas
  if (isNaN(checkin.getTime()) || isNaN(checkout.getTime())) {
    throw new AppError(
      'INVALID_DATE',
      'Data inválida fornecida',
      400
    );
  }

  if (checkout <= checkin) {
    throw new AppError(
      'INVALID_DATE_RANGE',
      'Data de check-out deve ser posterior ao check-in',
      400
    );
  }

  // Determinar tipo de quarto necessário baseado no número de pessoas
  let tipoQuarto;
  if (numeroPessoas === 1) {
    tipoQuarto = 'INDIVIDUAL';
  } else if (numeroPessoas <= 3) {
    tipoQuarto = 'TRIPLO';
  } else {
    throw new AppError(
      'INVALID_CAPACITY',
      'Número de pessoas excede capacidade máxima (3 pessoas)',
      400
    );
  }

  // Buscar todos os quartos do tipo adequado
  let query = supabase
    .from('quartos')
    .select('*')
    .eq('tipo', tipoQuarto)
    .eq('ativo', true);

  // Se for para WhatsApp, filtrar apenas quartos marcados como disponíveis
  if (limitarParaWhatsApp) {
    query = query.eq('disponivel_whatsapp', true);
  }

  const { data: quartos, error: errorQuartos } = await query;

  if (errorQuartos) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao buscar quartos',
      500
    );
  }

  // Para cada quarto, verificar se está disponível
  const quartosDisponiveis = [];

  for (const quarto of quartos) {
    const disponivel = await calcularHorarioDisponivel(
      quarto,
      checkin,
      checkout
    );

    if (disponivel) {
      quartosDisponiveis.push(quarto);
    }
  }

  return quartosDisponiveis;
}

/**
 * Calcula se um quarto está disponível para um período específico
 * Considera horários de check-in (13h) e check-out (11h)
 * @param {Object} quarto - Dados do quarto
 * @param {Date} dataCheckin - Data de check-in desejada
 * @param {Date} dataCheckout - Data de check-out desejada
 * @returns {Promise<boolean>} true se disponível, false caso contrário
 */
async function calcularHorarioDisponivel(quarto, dataCheckin, dataCheckout) {
  // Buscar reservas ativas (não canceladas) para este quarto
  const { data: reservas, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('quarto_id', quarto.id)
    .in('status', ['PENDENTE', 'CONFIRMADA', 'EM_ANDAMENTO'])
    .order('data_checkin', { ascending: true });

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao buscar reservas',
      500
    );
  }

  // Se não há reservas, quarto está disponível
  if (!reservas || reservas.length === 0) {
    return true;
  }

  // Normalizar datas para comparação (apenas data, sem hora)
  const checkinDate = new Date(dataCheckin);
  checkinDate.setHours(13, 0, 0, 0); // Check-in às 13h

  const checkoutDate = new Date(dataCheckout);
  checkoutDate.setHours(11, 0, 0, 0); // Check-out às 11h

  // Verificar conflitos com reservas existentes
  for (const reserva of reservas) {
    const reservaCheckin = new Date(reserva.data_checkin);
    reservaCheckin.setHours(13, 0, 0, 0);

    const reservaCheckout = new Date(reserva.data_checkout);
    reservaCheckout.setHours(11, 0, 0, 0);

    // Verificar sobreposição de datas
    // Há conflito se:
    // 1. Check-in desejado está entre check-in e check-out da reserva existente
    // 2. Check-out desejado está entre check-in e check-out da reserva existente
    // 3. Período desejado engloba completamente a reserva existente

    const conflito = (
      // Check-in desejado durante reserva existente
      (checkinDate >= reservaCheckin && checkinDate < reservaCheckout) ||
      // Check-out desejado durante reserva existente
      (checkoutDate > reservaCheckin && checkoutDate <= reservaCheckout) ||
      // Período desejado engloba reserva existente
      (checkinDate <= reservaCheckin && checkoutDate >= reservaCheckout)
    );

    if (conflito) {
      return false; // Quarto não disponível
    }
  }

  // Nenhum conflito encontrado
  return true;
}

/**
 * Verifica se é possível fazer reserva para hoje
 * Considera que check-in é às 13h
 * @returns {boolean} true se ainda é possível reservar para hoje
 */
function podeReservarParaHoje() {
  const agora = new Date();
  const horaAtual = agora.getHours();
  
  // Pode reservar para hoje se ainda não passou das 13h
  return horaAtual < 13;
}

/**
 * Busca quartos com filtros opcionais
 * @param {Object} filtros - Filtros de busca
 * @returns {Promise<Array>} Lista de quartos
 */
async function buscarQuartos(filtros = {}) {
  let query = supabase
    .from('quartos')
    .select('*')
    .eq('ativo', true);

  // Aplicar filtro de tipo se fornecido
  if (filtros.tipo) {
    query = query.eq('tipo', filtros.tipo);
  }

  const { data: quartos, error } = await query.order('numero', { ascending: true });

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao buscar quartos',
      500
    );
  }

  return quartos;
}

module.exports = {
  verificarDisponibilidade,
  calcularHorarioDisponivel,
  podeReservarParaHoje,
  buscarQuartos
};
