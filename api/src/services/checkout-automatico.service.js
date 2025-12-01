/**
 * Serviço de Check-out Automático
 * Verifica reservas que passaram do horário de check-out e finaliza automaticamente
 */

const { supabase } = require('../db/supabase');
const reservaService = require('./reserva.service');

/**
 * Processa check-outs automáticos
 * Deve ser executado periodicamente (ex: a cada hora)
 */
async function processarCheckoutsAutomaticos() {
  try {
    console.log('[CHECKOUT AUTO] Iniciando verificação de check-outs automáticos...');

    // Buscar configuração de horário de check-out (padrão: 11h)
    const { data: config } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'horarioCheckout')
      .single();

    const horarioCheckout = config?.valor ? parseInt(config.valor) : 11;

    // Data e hora atual
    const agora = new Date();
    const hoje = agora.toISOString().split('T')[0];
    const horaAtual = agora.getHours();

    console.log(`[CHECKOUT AUTO] Horário de check-out configurado: ${horarioCheckout}h`);
    console.log(`[CHECKOUT AUTO] Hora atual: ${horaAtual}h`);

    // Se ainda não passou do horário de check-out, não fazer nada
    if (horaAtual < horarioCheckout) {
      console.log('[CHECKOUT AUTO] Ainda não passou do horário de check-out');
      return {
        processados: 0,
        message: 'Ainda não passou do horário de check-out'
      };
    }

    // Buscar reservas EM_ANDAMENTO com data_checkout <= hoje
    const { data: reservas, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('status', 'EM_ANDAMENTO')
      .lte('data_checkout', hoje);

    if (error) {
      console.error('[CHECKOUT AUTO] Erro ao buscar reservas:', error);
      throw error;
    }

    if (!reservas || reservas.length === 0) {
      console.log('[CHECKOUT AUTO] Nenhuma reserva para check-out automático');
      return {
        processados: 0,
        message: 'Nenhuma reserva para check-out automático'
      };
    }

    console.log(`[CHECKOUT AUTO] Encontradas ${reservas.length} reserva(s) para check-out`);

    // Processar cada reserva
    let processados = 0;
    const erros = [];

    for (const reserva of reservas) {
      try {
        await reservaService.realizarCheckOut(reserva.id);
        processados++;
        console.log(`[CHECKOUT AUTO] Check-out realizado: Reserva ${reserva.id} - Quarto ${reserva.quarto_id}`);
      } catch (error) {
        console.error(`[CHECKOUT AUTO] Erro ao processar reserva ${reserva.id}:`, error);
        erros.push({
          reserva_id: reserva.id,
          erro: error.message
        });
      }
    }

    console.log(`[CHECKOUT AUTO] Processamento concluído: ${processados} check-outs realizados`);

    return {
      processados,
      total: reservas.length,
      erros: erros.length > 0 ? erros : undefined,
      message: `${processados} check-out(s) automático(s) realizado(s)`
    };

  } catch (error) {
    console.error('[CHECKOUT AUTO] Erro no processamento:', error);
    throw error;
  }
}

/**
 * Inicia o serviço de check-out automático
 * Executa a cada hora
 */
function iniciarServicoCheckoutAutomatico() {
  console.log('[CHECKOUT AUTO] Serviço iniciado - Verificação a cada hora');

  // Executar imediatamente na inicialização
  processarCheckoutsAutomaticos().catch(error => {
    console.error('[CHECKOUT AUTO] Erro na execução inicial:', error);
  });

  // Executar a cada hora (3600000 ms)
  setInterval(() => {
    processarCheckoutsAutomaticos().catch(error => {
      console.error('[CHECKOUT AUTO] Erro na execução periódica:', error);
    });
  }, 3600000); // 1 hora
}

module.exports = {
  processarCheckoutsAutomaticos,
  iniciarServicoCheckoutAutomatico
};
