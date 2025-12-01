/**
 * Script para popular o banco de dados com dados iniciais
 * Execute: node src/db/seed.js
 */

const bcrypt = require('bcrypt');
const { supabase } = require('./supabase');

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // 1. Inserir quartos individuais (1-11)
    console.log('📦 Inserindo quartos individuais...');
    const quartosIndividuais = [];
    for (let i = 1; i <= 11; i++) {
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
      console.log('✓ 11 quartos individuais inseridos');
    }

    // 2. Inserir quartos triplos (12-13)
    console.log('📦 Inserindo quartos triplos...');
    const quartosTriplos = [
      {
        numero: 12,
        tipo: 'TRIPLO',
        capacidade: 3,
        preco_diaria: 150.00,
        ativo: true
      },
      {
        numero: 13,
        tipo: 'TRIPLO',
        capacidade: 3,
        preco_diaria: 150.00,
        ativo: true
      }
    ];

    const { data: quartosTri, error: errorTri } = await supabase
      .from('quartos')
      .upsert(quartosTriplos, { onConflict: 'numero' });

    if (errorTri) {
      console.error('❌ Erro ao inserir quartos triplos:', errorTri.message);
    } else {
      console.log('✓ 2 quartos triplos inseridos');
    }

    // 3. Inserir funcionário admin
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

    // 4. Inserir configurações padrão
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
    console.log('  - 11 quartos individuais (R$ 80/dia)');
    console.log('  - 2 quartos triplos (R$ 150/dia)');
    console.log('  - 1 funcionário admin');
    console.log('  - 3 configurações padrão');

  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error.message);
    process.exit(1);
  }
}

// Executar seed
seed();
