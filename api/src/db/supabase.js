const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validar variáveis de ambiente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_URL e SUPABASE_KEY devem estar definidos no .env');
}

// Criar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * Testa a conexão com o Supabase
 * @returns {Promise<boolean>} true se conectado, false caso contrário
 */
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('quartos')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Erro ao testar conexão com Supabase:', error.message);
      return false;
    }
    
    console.log('✓ Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (err) {
    console.error('Erro ao testar conexão:', err.message);
    return false;
  }
}

module.exports = {
  supabase,
  testConnection
};
