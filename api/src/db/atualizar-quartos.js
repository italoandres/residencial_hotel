/**
 * Script para atualizar a configuração dos quartos no banco de dados
 * Execute: node src/db/atualizar-quartos.js
 */

const { supabase } = require('./supabase');

async function atualizarQuartos() {
  console.log('🔄 Atualizando configuração dos quartos...\n');

  try {
    // 1. Atualizar quartos 1-9 como INDIVIDUAL
    console.log('📦 Atualizando quartos 1-9 como INDIVIDUAL...');
    for (let i = 1; i <= 9; i++) {
      const { error } = await supabase
        .from('quartos')
        .update({
          tipo: 'INDIVIDUAL',
          capacidade: 1,
          preco_diaria: 80.00
        })
        .eq('numero', i);

      if (error) {
        console.error(`❌ Erro ao atualizar quarto ${i}:`, error.message);
      } else {
        console.log(`✓ Quarto ${i} atualizado`);
      }
    }

    // 2. Atualizar quarto 10 como DUPLO
    console.log('\n📦 Atualizando quarto 10 como DUPLO (2 solteiros)...');
    const { error: error10 } = await supabase
      .from('quartos')
      .update({
        tipo: 'DUPLO',
        capacidade: 2,
        preco_diaria: 120.00
      })
      .eq('numero', 10);

    if (error10) {
      console.error('❌ Erro ao atualizar quarto 10:', error10.message);
    } else {
      console.log('✓ Quarto 10 atualizado');
    }

    // 3. Atualizar quarto 11 como CASAL
    console.log('\n📦 Atualizando quarto 11 como CASAL...');
    const { error: error11 } = await supabase
      .from('quartos')
      .update({
        tipo: 'CASAL',
        capacidade: 2,
        preco_diaria: 120.00
      })
      .eq('numero', 11);

    if (error11) {
      console.error('❌ Erro ao atualizar quarto 11:', error11.message);
    } else {
      console.log('✓ Quarto 11 atualizado');
    }

    // 4. Atualizar quarto 12 como DUPLO
    console.log('\n📦 Atualizando quarto 12 como DUPLO (2 solteiros)...');
    const { error: error12 } = await supabase
      .from('quartos')
      .update({
        tipo: 'DUPLO',
        capacidade: 2,
        preco_diaria: 120.00
      })
      .eq('numero', 12);

    if (error12) {
      console.error('❌ Erro ao atualizar quarto 12:', error12.message);
    } else {
      console.log('✓ Quarto 12 atualizado');
    }

    // 5. Atualizar quarto 13 como TRIPLO
    console.log('\n📦 Atualizando quarto 13 como TRIPLO (1 casal + 1 solteiro)...');
    const { error: error13 } = await supabase
      .from('quartos')
      .update({
        tipo: 'TRIPLO',
        capacidade: 3,
        preco_diaria: 150.00
      })
      .eq('numero', 13);

    if (error13) {
      console.error('❌ Erro ao atualizar quarto 13:', error13.message);
    } else {
      console.log('✓ Quarto 13 atualizado');
    }

    console.log('\n✅ Atualização concluída com sucesso!');
    console.log('\n📊 Nova configuração:');
    console.log('  - Quartos 1-9: INDIVIDUAL (1 pessoa) - R$ 80/dia');
    console.log('  - Quarto 10: DUPLO (2 solteiros) - R$ 120/dia');
    console.log('  - Quarto 11: CASAL (1 casal) - R$ 120/dia');
    console.log('  - Quarto 12: DUPLO (2 solteiros) - R$ 120/dia');
    console.log('  - Quarto 13: TRIPLO (1 casal + 1 solteiro) - R$ 150/dia');

  } catch (error) {
    console.error('\n❌ Erro durante a atualização:', error.message);
    process.exit(1);
  }
}

// Executar atualização
atualizarQuartos();
