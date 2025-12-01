const { supabase } = require('../db/supabase');
const AppError = require('../utils/AppError');

/**
 * Busca hóspede por telefone ou cria novo se não existir (para WhatsApp)
 * @param {string} nome - Nome do hóspede
 * @param {string} telefone - Telefone do hóspede
 * @returns {Promise<Object>} Dados do hóspede
 */
async function buscarOuCriarHospede(nome, telefone) {
  // Primeiro, tentar buscar hóspede existente por telefone
  const { data: hospedeExistente, error: errorBusca } = await supabase
    .from('hospedes')
    .select('*')
    .eq('telefone', telefone)
    .single();

  // Se encontrou, retornar hóspede existente
  if (hospedeExistente) {
    return hospedeExistente;
  }

  // Se não encontrou (erro PGRST116 = nenhum resultado), criar novo
  if (errorBusca && errorBusca.code !== 'PGRST116') {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao buscar hóspede',
      500
    );
  }

  // Criar novo hóspede
  const { data: novoHospede, error: errorCriar } = await supabase
    .from('hospedes')
    .insert([{
      nome,
      telefone
    }])
    .select()
    .single();

  if (errorCriar) {
    // Se erro for de duplicação (telefone já existe), tentar buscar novamente
    if (errorCriar.code === '23505') {
      const { data: hospedeDuplicado } = await supabase
        .from('hospedes')
        .select('*')
        .eq('telefone', telefone)
        .single();
      
      if (hospedeDuplicado) {
        return hospedeDuplicado;
      }
    }

    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao criar hóspede',
      500
    );
  }

  return novoHospede;
}

/**
 * Cria hóspede completo com endereço (para cadastro manual no painel)
 * @param {Object} dados - Dados completos do hóspede
 * @returns {Promise<Object>} Hóspede criado
 */
async function criarHospedeCompleto(dados) {
  const { nome, cpf, telefone, email, cidade, rua, numero, bairro, cep } = dados;

  // Validar campos obrigatórios
  if (!nome || !cpf || !telefone || !cidade) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Nome, CPF, telefone e cidade são obrigatórios',
      400
    );
  }

  // Verificar se já existe hóspede com mesmo CPF ou telefone
  const { data: existente } = await supabase
    .from('hospedes')
    .select('*')
    .or(`cpf.eq.${cpf},telefone.eq.${telefone}`)
    .single();

  if (existente) {
    throw new AppError(
      'DUPLICATE_ERROR',
      'Já existe um hóspede cadastrado com este CPF ou telefone',
      409
    );
  }

  // Criar hóspede
  const { data: hospede, error } = await supabase
    .from('hospedes')
    .insert([{
      nome,
      cpf,
      telefone,
      email: email || null,
      cidade,
      rua: rua || null,
      numero: numero || null,
      bairro: bairro || null,
      cep: cep || null
    }])
    .select()
    .single();

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao criar hóspede: ' + error.message,
      500
    );
  }

  return hospede;
}

/**
 * Atualiza dados de um hóspede
 * @param {string} id - ID do hóspede
 * @param {Object} dados - Dados a serem atualizados
 * @returns {Promise<Object>} Hóspede atualizado
 */
async function atualizarHospede(id, dados) {
  const { data: hospede, error } = await supabase
    .from('hospedes')
    .update(dados)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError(
        'NOT_FOUND',
        'Hóspede não encontrado',
        404
      );
    }

    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao atualizar hóspede',
      500
    );
  }

  return hospede;
}

/**
 * Busca hóspede por ID
 * @param {string} id - ID do hóspede
 * @returns {Promise<Object>} Dados do hóspede
 */
async function buscarHospedePorId(id) {
  const { data: hospede, error } = await supabase
    .from('hospedes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !hospede) {
    throw new AppError(
      'NOT_FOUND',
      'Hóspede não encontrado',
      404
    );
  }

  return hospede;
}

/**
 * Lista todos os hóspedes ordenados por data de cadastro
 * @returns {Promise<Array>} Lista de hóspedes
 */
async function listarTodosHospedes() {
  const { data, error } = await supabase
    .from('hospedes')
    .select('*')
    .order('created_at', { ascending: false }); // Mais recente primeiro

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao listar hóspedes',
      500
    );
  }

  return data;
}

/**
 * Busca hóspede por CPF
 * @param {string} cpf - CPF do hóspede
 * @returns {Promise<Object>} Dados do hóspede
 */
async function buscarHospedePorCPF(cpf) {
  const { data, error } = await supabase
    .from('hospedes')
    .select('*')
    .eq('cpf', cpf)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError(
        'NOT_FOUND',
        'Hóspede não encontrado',
        404
      );
    }

    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao buscar hóspede',
      500
    );
  }

  return data;
}

/**
 * Busca reservas de um hóspede
 * @param {string} hospedeId - ID do hóspede
 * @returns {Promise<Array>} Lista de reservas
 */
async function buscarReservasDoHospede(hospedeId) {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      quarto:quartos(numero, tipo),
      pagamento:pagamentos_pix(status, valor, data_pagamento)
    `)
    .eq('hospede_id', hospedeId)
    .order('data_checkin', { ascending: false });

  if (error) {
    throw new AppError(
      'DATABASE_ERROR',
      'Erro ao buscar reservas do hóspede',
      500
    );
  }

  return data;
}

module.exports = {
  buscarOuCriarHospede,
  criarHospedeCompleto,
  atualizarHospede,
  buscarHospedePorId,
  listarTodosHospedes,
  buscarHospedePorCPF,
  buscarReservasDoHospede
};
