/**
 * Script para executar a migration de tipos de quartos
 * Execute: node src/db/executar-migration-tipos.js
 */

const { supabase } = require('./supabase');

async function executarMigration() {
  console.log('🔄 Executando migration para adicionar tipos de quartos...\n');

  try {
    // Executar SQL diretamente
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Remover a constraint antiga
        ALTER TABLE quartos DROP CONSTRAINT IF EXISTS quartos_tipo_check;

        -- Adicionar nova constraint com todos os tipos
        ALTER TABLE quartos ADD CONSTRAINT quartos_tipo_check 
          CHECK (tipo IN ('INDIVIDUAL', 'DUPLO', 'CASAL', 'TRIPLO'));
      `
    });

    if (error) {
      console.error('❌ Erro ao executar migration:', error.message);
      console.log('\n⚠️  Execute manualmente no SQL Editor do Supabase:');
      console.log('\nALTER TABLE quartos DROP CONSTRAINT IF EXISTS quartos_tipo_check;');
      console.log("ALTER TABLE quartos ADD CONSTRAINT quartos_tipo_check CHECK (tipo IN ('INDIVIDUAL', 'DUPLO', 'CASAL', 'TRIPLO'));");
    } else {
      console.log('✅ Migration executada com sucesso!');
    }

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.log('\n⚠️  Execute manualmente no SQL Editor do Supabase:');
    console.log('\nALTER TABLE quartos DROP CONSTRAINT IF EXISTS quartos_tipo_check;');
    console.log("ALTER TABLE quartos ADD CONSTRAINT quartos_tipo_check CHECK (tipo IN ('INDIVIDUAL', 'DUPLO', 'CASAL', 'TRIPLO'));");
  }
}

// Executar migration
executarMigration();
