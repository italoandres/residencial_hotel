const { supabase } = require('../db/supabase');
const AppError = require('../utils/AppError');
const hospedeService = require('./hospede.service');
const disponibilidadeService = require('./disponibilidade.service');
const pixService = require('./pix.service');

/**
 * Cria uma pré-reserva (status PENDENTE)
 * @param {Object} dados - Dados da reserva
 * @returns {Promise<Object>} Reserva criada com dados do PIX
 */
async function criarPreReserva(dados) {
  const { hospedeNome, hospedeTelefone, dataCheckin, dataCheckout, numeroPessoas } = dados;

  // 1. Buscar ou criar hóspede
  const hospede = await hospedeService.buscarOuCriarHospede(hospedeNome, hospedeTelefone);

  // 2. Verificar disponibilidade
  const quartosDisponiveis = await disponibilidadeService.verificarDisponibilidade(
    dataCheckin,
    numeroPessoas,
    dataCheckout
  );

  if (quartosDisponiveis.length === 0) {
    throw new AppError(
      'NO_AVAILABILITY',
      'Não há quartos disponíveis para o período solicitado',
      409
    );
  }

  // 3. Selecionar primeiro quarto disponível
  const quarto = quartosDisponiveis[0];

  // 4. Calcular valor total
  const checkin = new Date(dataCheckin);
  const checkout = dataCheckout ? new Date(dataCheckout) : new Date(checkin.getTime() + 24 * 60 * 60 * 1000);
  const numeroDias = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
  const valorTotal = quarto.preco_diaria * numeroDias;

  // 5. Criar reserva com status PENDENTE
  const { data: reserva, error } = await supabase
    .from('reservas')
    .insert([{
      hospede_id: hospede.id,
      quarto_id: quarto.id,
      data_checkin: dataCheckin,
      data_checkout: checkout.toISOString().split('T')[0],
      numero_pessoas: numeroPessoas,
      valor_total: valorTotal,
      status: 'PENDENTE'
    }])
    .select()
    .single();

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao criar reserva',
      500
    );
  }

  // 6. Gerar PIX dinâmico
  const pix = await pixService.gerarPixDinamico(valorTotal, reserva.id);

  // 7. Retornar reserva com dados do PIX
  return {
    reserva: {
      ...reserva,
      hospede,
      quarto
    },
    pix: {
      qrCode: pix.qrCode,
      copiaECola: pix.copiaECola,
      valor: pix.valor,
      txid: pix.txid
    }
  };
}

/**
 * Confirma uma reserva após pagamento PIX
 * @param {string} reservaId - ID da reserva
 * @returns {Promise<Object>} Reserva atualizada
 */
async function confirmarReserva(reservaId) {
  const { data: reserva, error } = await supabase
    .from('reservas')
    .update({
      status: 'CONFIRMADA'
    })
    .eq('id', reservaId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError(
        'NOT_FOUND',
        'Reserva não encontrada',
        404
      );
    }

    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao confirmar reserva',
      500
    );
  }

  return reserva;
}

/**
 * Cancela uma reserva
 * @param {string} reservaId - ID da reserva
 * @returns {Promise<void>}
 */
async function cancelarReserva(reservaId) {
  // Buscar reserva para validar
  const { data: reserva, error: errorBusca } = await supabase
    .from('reservas')
    .select('*')
    .eq('id', reservaId)
    .single();

  if (errorBusca || !reserva) {
    throw new AppError(
      'NOT_FOUND',
      'Reserva não encontrada',
      404
    );
  }

  // Não permitir cancelar reserva já concluída
  if (reserva.status === 'CONCLUIDA') {
    throw new AppError(
      'INVALID_STATUS',
      'Não é possível cancelar uma reserva já concluída',
      400
    );
  }

  // Atualizar status para CANCELADA
  const { error } = await supabase
    .from('reservas')
    .update({
      status: 'CANCELADA'
    })
    .eq('id', reservaId);

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao cancelar reserva',
      500
    );
  }
}

/**
 * Realiza check-in de uma reserva
 * @param {string} reservaId - ID da reserva
 * @returns {Promise<Object>} Reserva atualizada
 */
async function realizarCheckIn(reservaId) {
  // Buscar reserva para validar
  const { data: reserva, error: errorBusca } = await supabase
    .from('reservas')
    .select('*')
    .eq('id', reservaId)
    .single();

  if (errorBusca || !reserva) {
    throw new AppError(
      'NOT_FOUND',
      'Reserva não encontrada',
      404
    );
  }

  // Validar que reserva está CONFIRMADA
  if (reserva.status !== 'CONFIRMADA') {
    throw new AppError(
      'INVALID_STATUS',
      `Não é possível fazer check-in de reserva com status ${reserva.status}. Status deve ser CONFIRMADA.`,
      400
    );
  }

  // Atualizar para EM_ANDAMENTO e registrar hora do check-in
  const { data: reservaAtualizada, error } = await supabase
    .from('reservas')
    .update({
      status: 'EM_ANDAMENTO',
      hora_checkin: new Date().toISOString()
    })
    .eq('id', reservaId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao realizar check-in',
      500
    );
  }

  return reservaAtualizada;
}

/**
 * Realiza check-out de uma reserva
 * @param {string} reservaId - ID da reserva
 * @returns {Promise<Object>} Reserva atualizada
 */
async function realizarCheckOut(reservaId) {
  // Buscar reserva para validar
  const { data: reserva, error: errorBusca } = await supabase
    .from('reservas')
    .select('*')
    .eq('id', reservaId)
    .single();

  if (errorBusca || !reserva) {
    throw new AppError(
      'NOT_FOUND',
      'Reserva não encontrada',
      404
    );
  }

  // Validar que reserva está EM_ANDAMENTO
  if (reserva.status !== 'EM_ANDAMENTO') {
    throw new AppError(
      'INVALID_STATUS',
      `Não é possível fazer check-out de reserva com status ${reserva.status}. Status deve ser EM_ANDAMENTO.`,
      400
    );
  }

  // Atualizar para CONCLUIDA e registrar hora do check-out
  const { data: reservaAtualizada, error } = await supabase
    .from('reservas')
    .update({
      status: 'CONCLUIDA',
      hora_checkout: new Date().toISOString()
    })
    .eq('id', reservaId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao realizar check-out',
      500
    );
  }

  return reservaAtualizada;
}

/**
 * Busca reservas com filtros opcionais
 * @param {Object} filtros - Filtros de busca
 * @returns {Promise<Array>} Lista de reservas
 */
async function buscarReservas(filtros = {}) {
  let query = supabase
    .from('reservas')
    .select(`
      *,
      hospede:hospedes(*),
      quarto:quartos(*)
    `);

  // Aplicar filtro de status se fornecido
  if (filtros.status) {
    query = query.eq('status', filtros.status);
  }

  // Aplicar filtro de data se fornecido
  if (filtros.data) {
    query = query.eq('data_checkin', filtros.data);
  }

  // Ordenar por data de check-in
  query = query.order('data_checkin', { ascending: true });

  const { data: reservas, error } = await query;

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao buscar reservas',
      500
    );
  }

  return reservas;
}

/**
 * Busca uma reserva por ID com todos os dados relacionados
 * @param {string} reservaId - ID da reserva
 * @returns {Promise<Object>} Reserva completa
 */
async function buscarReservaPorId(reservaId) {
  const { data: reserva, error } = await supabase
    .from('reservas')
    .select(`
      *,
      hospede:hospedes(*),
      quarto:quartos(*),
      pagamento:pagamentos_pix(*)
    `)
    .eq('id', reservaId)
    .single();

  if (error || !reserva) {
    throw new AppError(
      'NOT_FOUND',
      'Reserva não encontrada',
      404
    );
  }

  return reserva;
}

/**
 * Cria reserva manual (admin) com status EM_ANDAMENTO
 * @param {Object} dados - Dados da reserva
 * @returns {Promise<Object>} Reserva criada
 */
async function criarReservaManual(dados) {
  const { 
    hospede_id, 
    quarto_id, 
    data_checkin, 
    data_checkout, 
    numero_pessoas,
    status_pagamento,
    forma_pagamento,
    valor_pago,
    valor_sinal
  } = dados;

  // Buscar quarto para calcular valor
  const { data: quarto, error: errorQuarto } = await supabase
    .from('quartos')
    .select('*')
    .eq('id', quarto_id)
    .single();

  if (errorQuarto || !quarto) {
    throw new AppError(
      'NOT_FOUND',
      'Quarto não encontrado',
      404
    );
  }

  // Calcular valor total
  const checkin = new Date(data_checkin);
  const checkout = new Date(data_checkout);
  const numeroDias = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
  const valorTotal = quarto.preco_diaria * numeroDias;

  // Preparar observações com informações de pagamento
  let observacoes = `Pagamento: ${status_pagamento}`;
  if (forma_pagamento) {
    observacoes += ` (${forma_pagamento})`;
  }
  if (valor_pago) {
    observacoes += ` - Valor: R$ ${valor_pago.toFixed(2)}`;
  }
  if (valor_sinal) {
    observacoes += ` - Sinal: R$ ${valor_sinal.toFixed(2)}`;
  }

  // Criar reserva com status EM_ANDAMENTO e hora_checkin atual
  const { data: reserva, error } = await supabase
    .from('reservas')
    .insert([{
      hospede_id,
      quarto_id,
      data_checkin,
      data_checkout,
      numero_pessoas,
      valor_total: valorTotal,
      status: 'EM_ANDAMENTO',
      hora_checkin: new Date().toISOString(),
      observacoes: observacoes
    }])
    .select(`
      *,
      hospede:hospedes(*),
      quarto:quartos(*)
    `)
    .single();

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao criar reserva: ' + error.message,
      500
    );
  }

  return reserva;
}

module.exports = {
  criarPreReserva,
  criarReservaManual,
  confirmarReserva,
  cancelarReserva,
  realizarCheckIn,
  realizarCheckOut,
  buscarReservas,
  buscarReservaPorId
};
