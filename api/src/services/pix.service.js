const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../db/supabase');
const AppError = require('../utils/AppError');

/**
 * Gera PIX dinâmico para uma reserva
 * NOTA: Esta é uma implementação MOCK para desenvolvimento
 * Em produção, integrar com API real de PIX (Banco do Brasil, Mercado Pago, etc.)
 * 
 * @param {number} valor - Valor em reais
 * @param {string} reservaId - ID da reserva
 * @returns {Promise<Object>} Dados do PIX gerado
 */
async function gerarPixDinamico(valor, reservaId) {
  // Gerar txid único
  const txid = uuidv4();

  // MOCK: Em produção, chamar API real do provedor PIX
  // Exemplo com Mercado Pago, PagSeguro, ou API do banco
  
  // Gerar QR Code mock (em produção, vem da API)
  const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
  
  // Gerar código copia e cola mock (em produção, vem da API)
  const copiaECola = `00020126580014br.gov.bcb.pix0136${txid}520400005303986540${valor.toFixed(2)}5802BR5925Residencial Hortel6009SAO PAULO62070503***6304${Math.random().toString(36).substring(7).toUpperCase()}`;

  // Salvar pagamento no banco
  const { data: pagamento, error } = await supabase
    .from('pagamentos_pix')
    .insert([{
      reserva_id: reservaId,
      txid,
      qr_code: qrCode,
      copia_e_cola: copiaECola,
      valor,
      status: 'PENDENTE'
    }])
    .select()
    .single();

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao salvar pagamento PIX',
      500
    );
  }

  return {
    id: pagamento.id,
    txid,
    qrCode,
    copiaECola,
    valor,
    status: 'PENDENTE'
  };
}

/**
 * Verifica status de um pagamento PIX
 * NOTA: Em produção, consultar API real do provedor
 * 
 * @param {string} txid - Transaction ID do PIX
 * @returns {Promise<Object>} Status do pagamento
 */
async function verificarPagamento(txid) {
  const { data: pagamento, error } = await supabase
    .from('pagamentos_pix')
    .select('*')
    .eq('txid', txid)
    .single();

  if (error || !pagamento) {
    throw new AppError(
      'NOT_FOUND',
      'Pagamento não encontrado',
      404
    );
  }

  // MOCK: Em produção, consultar API real para verificar se foi pago
  // const statusReal = await consultarAPIProvedor(txid);

  return {
    txid: pagamento.txid,
    status: pagamento.status,
    valor: pagamento.valor,
    dataPagamento: pagamento.data_pagamento
  };
}

/**
 * Atualiza status de um pagamento PIX
 * Chamado pelo webhook quando pagamento é confirmado
 * 
 * @param {string} txid - Transaction ID do PIX
 * @param {string} novoStatus - Novo status ('PAGO', 'EXPIRADO', 'CANCELADO')
 * @returns {Promise<Object>} Pagamento atualizado
 */
async function atualizarStatusPagamento(txid, novoStatus) {
  const updates = {
    status: novoStatus
  };

  // Se status é PAGO, registrar data/hora do pagamento
  if (novoStatus === 'PAGO') {
    updates.data_pagamento = new Date().toISOString();
  }

  const { data: pagamento, error } = await supabase
    .from('pagamentos_pix')
    .update(updates)
    .eq('txid', txid)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError(
        'NOT_FOUND',
        'Pagamento não encontrado',
        404
      );
    }

    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao atualizar pagamento',
      500
    );
  }

  return pagamento;
}

/**
 * Busca pagamento por reserva
 * @param {string} reservaId - ID da reserva
 * @returns {Promise<Object>} Dados do pagamento
 */
async function buscarPagamentoPorReserva(reservaId) {
  const { data: pagamento, error } = await supabase
    .from('pagamentos_pix')
    .select('*')
    .eq('reserva_id', reservaId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !pagamento) {
    throw new AppError(
      'NOT_FOUND',
      'Pagamento não encontrado para esta reserva',
      404
    );
  }

  return pagamento;
}

module.exports = {
  gerarPixDinamico,
  verificarPagamento,
  atualizarStatusPagamento,
  buscarPagamentoPorReserva
};
