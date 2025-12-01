/**
 * Serviço de Configurações
 * Gerencia configurações do sistema
 */

const { supabase } = require('../db/supabase');

/**
 * Buscar todas as configurações
 * @returns {Promise<Object>} Objeto com configurações
 */
async function buscarConfiguracoes() {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('*');

  if (error) {
    throw new Error(`Erro ao buscar configurações: ${error.message}`);
  }

  // Converter array de configurações em objeto
  const configs = {};
  data.forEach(config => {
    // Converter valores numéricos
    const valor = isNaN(config.valor) ? config.valor : Number(config.valor);
    
    // Converter chave para camelCase
    const chaveCamelCase = config.chave.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    configs[chaveCamelCase] = valor;
  });

  return configs;
}

/**
 * Atualizar configurações
 * @param {Object} dados - Objeto com configurações a atualizar
 * @returns {Promise<Object>} Configurações atualizadas
 */
async function atualizarConfiguracoes(dados) {
  const updates = [];

  // Converter camelCase para snake_case e preparar updates
  for (const [chave, valor] of Object.entries(dados)) {
    const chaveSnakeCase = chave.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    updates.push({
      chave: chaveSnakeCase,
      valor: String(valor)
    });
  }

  // Atualizar cada configuração
  for (const update of updates) {
    const { error } = await supabase
      .from('configuracoes')
      .update({ valor: update.valor })
      .eq('chave', update.chave);

    if (error) {
      throw new Error(`Erro ao atualizar configuração ${update.chave}: ${error.message}`);
    }
  }

  // Retornar configurações atualizadas
  return buscarConfiguracoes();
}

/**
 * Obter quantidade de quartos para WhatsApp
 * @returns {Promise<number>} Quantidade de quartos
 */
async function obterQuartosWhatsApp() {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('valor')
    .eq('chave', 'quartos_whatsapp')
    .single();

  if (error) {
    console.warn('Erro ao buscar quartos_whatsapp, usando padrão 5:', error.message);
    return 5; // Valor padrão
  }

  return Number(data.valor) || 5;
}

module.exports = {
  buscarConfiguracoes,
  atualizarConfiguracoes,
  obterQuartosWhatsApp
};
