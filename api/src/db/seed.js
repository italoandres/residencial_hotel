/**
 * Script para popular o banco de dados com dados iniciais
 * Execute: node src/db/seed.js
 */

const bcrypt = require('bcrypt');
const { supabase } = require('./supabase');

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // 1. Inserir quartos individuais (1-9)
    console.log('📦 Inserindo quartos individuais (1-9)...');
    const quartosIndividuais = [];
    for (let i = 1; i <= 9; i++) {
      quartosIndividuais.push({
        numero: i,
        tipo: 'INDIVIDUAL',
        capacidade: 1,
        preco_diaria: 80.00,
        ativo: true
      });
    }

    const { data: quartosInd, error: errorInd } = await supabase
      .from('quartos')
      .upsert(quartosIndividuais, { onConflict: 'numero' });

    if (errorInd) {
      console.error('❌ Erro ao inserir quartos individuais:', errorInd.message);
    } else {
      console.log('✓ 9 quartos individuais inseridos');
    }

    // 2. Inserir quartos duplos solteiro (10 e 12)
    console.log('📦 Inserindo quartos duplos solteiro (10 e 12)...');
    const quartosDuplos = [
      {
        numero: 10,
        tipo: 'DUPLO',
        capacidade: 2,
        preco_diaria: 120.00,
        ativo: true
      },
      {
        numero: 12,
        tipo: 'DUPLO',
        capacidade: 2,
        preco_diaria: 120.00,
        ativo: true
      }
    ];

    const { data: quartosDup, error: errorDup } = await supabase
      .from('quartos')
      .upsert(quartosDuplos, { onConflict: 'numero' });

    if (errorDup) {
      console.error('❌ Erro ao inserir quartos duplos:', errorDup.message);
    } else {
      console.log('✓ 2 quartos duplos solteiro inseridos');
    }

    // 3. Inserir quarto casal (11)
    console.log('📦 Inserindo quarto casal (11)...');
    const quartoCasal = [
      {
        numero: 11,
        tipo: 'CASAL',
        capacidade: 2,
        preco_diaria: 120.00,
        ativo: true
      }
    ];

    const { data: quartoCas, error: errorCas } = await supabase
      .from('quartos')
      .upsert(quartoCasal, { onConflict: 'numero' });

    if (errorCas) {
      console.error('❌ Erro ao inserir quarto casal:', errorCas.message);
    } else {
      console.log('✓ 1 quarto casal inserido');
    }

    // 4. Inserir quarto triplo misto (13)
    console.log('📦 Inserindo quarto triplo misto (13)...');
    const quartoTriplo = [
      {
        numero: 13,
        tipo: 'TRIPLO',
        capacidade: 3,
        preco_diaria: 150.00,
        ativo: true
      }
    ];

    const { data: quartoTri, error: errorTri } = await supabase
      .from('quartos')
      .upsert(quartoTriplo, { onConflict: 'numero' });

    if (errorTri) {
      console.error('❌ Erro ao inserir quarto triplo:', errorTri.message);
    } else {
      console.log('✓ 1 quarto triplo misto inserido');
    }

    // 5. Inserir funcionário admin
    console.log('👤 Inserindo funcionário admin...');
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    const { data: admin, error: errorAdmin } = await supabase
      .from('funcionarios')
      .upsert([{
        nome: 'Administrador',
        email: 'admin@residencialhortel.com',
        senha_hash: senhaHash,
        ativo: true
      }], { onConflict: 'email' });

    if (errorAdmin) {
      console.error('❌ Erro ao inserir funcionário admin:', errorAdmin.message);
    } else {
      console.log('✓ Funcionário admin inserido');
      console.log('  Email: admin@residencialhortel.com');
      console.log('  Senha: admin123');
      console.log('  ⚠️  IMPORTANTE: Altere esta senha após o primeiro login!');
    }

    // 6. Inserir configurações padrão
    console.log('⚙️  Inserindo configurações padrão...');
    const configuracoes = [
      {
        chave: 'quartos_whatsapp',
        valor: '5',
        descricao: 'Quantidade de quartos disponíveis exibidos no WhatsApp'
      },
      {
        chave: 'horario_checkin',
        valor: '13',
        descricao: 'Horário de check-in (formato 24h)'
      },
      {
        chave: 'horario_checkout',
        valor: '11',
        descricao: 'Horário de check-out (formato 24h)'
      }
    ];

    const { data: configs, error: errorConfigs } = await supabase
      .from('configuracoes')
      .upsert(configuracoes, { onConflict: 'chave' });

    if (errorConfigs) {
      console.error('❌ Erro ao inserir configurações:', errorConfigs.message);
    } else {
      console.log('✓ Configurações padrão inseridas');
    }

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log('  - 9 quartos individuais (1-9) - R$ 80/dia');
    console.log('  - 2 quartos duplos solteiro (10, 12) - R$ 120/dia');
    console.log('  - 1 quarto casal (11) - R$ 120/dia');
    console.log('  - 1 quarto triplo misto (13) - R$ 150/dia');
    console.log('  - 1 funcionário admin');
    console.log('  - 3 configurações padrão');

  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error.message);
    process.exit(1);
  }
}

// Executar seed
seed();
