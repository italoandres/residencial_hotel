const API_URL = 'https://residencial-hotel-api.onrender.com/api';
let token = localStorage.getItem('token');
let quartos = [];
let reservas = [];
let clientes = [];

// Verificar se já está logado
if (token) {
    showMainPanel();
    loadDashboard();
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            showMainPanel();
            loadDashboard();
        } else {
            showError('loginError', data.error?.message || 'Erro ao fazer login');
        }
    } catch (error) {
        showError('loginError', 'Erro de conexão');
    }
});

function showMainPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainPanel').style.display = 'block';
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainPanel').style.display = 'none';
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
}

function showTab(tabName) {
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar aba selecionada
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Carregar dados da aba
    switch(tabName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'quartos':
            loadQuartos();
            break;
        case 'reservas':
            loadReservas();
            break;
        case 'clientes':
            loadClientes();
            break;
        case 'configuracoes':
            loadConfiguracoes();
            break;
    }
}

async function loadDashboard() {
    try {
        // Carregar quartos
        const quartosResponse = await fetch(`${API_URL}/quartos`);
        const quartosData = await quartosResponse.json();
        quartos = quartosData.quartos || [];

        // Carregar reservas
        const reservasResponse = await fetch(`${API_URL}/reservas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const reservasData = await reservasResponse.json();
        reservas = reservasData.reservas || [];

        // Calcular estatísticas
        const totalQuartos = quartos.length;
        const quartosOcupados = quartos.filter(q => q.status === 'OCUPADO').length;
        const quartosDisponiveis = totalQuartos - quartosOcupados;
        const reservasAtivas = reservas.filter(r => r.status === 'EM_ANDAMENTO').length;

        // Atualizar dashboard
        document.getElementById('totalQuartos').textContent = totalQuartos;
        document.getElementById('quartosDisponiveis').textContent = quartosDisponiveis;
        document.getElementById('quartosOcupados').textContent = quartosOcupados;
        document.getElementById('reservasAtivas').textContent = reservasAtivas;

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

async function loadQuartos() {
    try {
        // Definir data atual como padrão se não houver filtro
        const filtroData = document.getElementById('filtroData');
        if (!filtroData) {
            // Se o campo não existe ainda, buscar sem filtro
            console.log('Campo filtroData não encontrado, carregando sem filtro');
            const response = await fetch(`${API_URL}/quartos`);
            const data = await response.json();
            quartos = data.quartos || [];
            renderQuartos();
            return;
        }
        
        if (!filtroData.value) {
            const hoje = new Date().toISOString().split('T')[0];
            filtroData.value = hoje;
            console.log('Data definida para hoje:', hoje);
        }

        // Buscar quartos com filtro de data
        const dataFiltro = filtroData.value;
        console.log('Carregando quartos para data:', dataFiltro);
        const response = await fetch(`${API_URL}/quartos?data=${dataFiltro}`);
        const data = await response.json();
        quartos = data.quartos || [];
        console.log('Quartos carregados:', quartos.length);

        // Atualizar texto do botão baseado na data
        atualizarTextoBotaoHoje();

        renderQuartos();
    } catch (error) {
        console.error('Erro ao carregar quartos:', error);
        document.getElementById('quartosGrid').innerHTML = '<div class="error">Erro ao carregar quartos</div>';
    }
}

function atualizarTextoBotaoHoje() {
    const filtroData = document.getElementById('filtroData');
    const btnHoje = document.querySelector('.filtro-data-container .btn-secondary');
    
    if (!filtroData || !btnHoje) return;
    
    const hoje = new Date().toISOString().split('T')[0];
    
    if (filtroData.value === hoje) {
        btnHoje.textContent = '✓ Hoje';
        btnHoje.style.background = '#4CAF50';
    } else {
        btnHoje.textContent = 'Hoje';
        btnHoje.style.background = '#6c757d';
    }
}

function resetarFiltroData() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('filtroData').value = hoje;
    loadQuartos();
}

function renderQuartos() {
    const grid = document.getElementById('quartosGrid');
    
    if (quartos.length === 0) {
        grid.innerHTML = '<div class="loading">Nenhum quarto encontrado</div>';
        return;
    }

    const quartosHtml = quartos.map(quarto => {
        const isOcupado = quarto.status === 'OCUPADO';
        const statusClass = isOcupado ? 'ocupado' : 'disponivel';
        const statusText = quarto.status || 'DISPONÍVEL';
        const disponivelWhatsApp = quarto.disponivel_whatsapp !== false; // default true

        let reservaInfo = '';
        if (isOcupado && quarto.hospede) {
            const checkout = new Date(quarto.data_checkout).toLocaleDateString('pt-BR');
            reservaInfo = `
                <div class="reserva-info">
                    <strong>Hóspede:</strong> ${quarto.hospede.nome}<br>
                    <strong>Check-out:</strong> ${checkout}<br>
                    <strong>Dias restantes:</strong> ${quarto.dias_restantes} dia(s)
                </div>
            `;
        }

        return `
            <div class="quarto-card ${statusClass}">
                <div class="quarto-header">
                    <div class="quarto-numero">Quarto ${quarto.numero}</div>
                    <div class="status-badge ${statusClass}">${statusText}</div>
                </div>
                <div class="quarto-info">
                    <p><strong>Tipo:</strong> ${quarto.tipo}</p>
                    <p><strong>Capacidade:</strong> ${quarto.capacidade} pessoa(s)</p>
                    <p><strong>Preço:</strong> R$ ${quarto.preco_diaria.toFixed(2)}/diária</p>
                </div>
                ${reservaInfo}
                <div class="whatsapp-toggle">
                    <label class="toggle-label">
                        <span>📱 Disponível no WhatsApp:</span>
                        <label class="switch">
                            <input type="checkbox" 
                                   ${disponivelWhatsApp ? 'checked' : ''} 
                                   onchange="toggleWhatsApp('${quarto.id}', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </label>
                </div>
                <button class="btn-ocupar" onclick='abrirModalOcupacao(${JSON.stringify(quarto)})'>
                    ${isOcupado ? '🚪 Gerenciar Quarto' : '🔑 Ocupar Quarto'}
                </button>
            </div>
        `;
    }).join('');

    grid.innerHTML = quartosHtml;
}

async function loadReservas() {
    try {
        const response = await fetch(`${API_URL}/reservas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        reservas = data.reservas || [];

        renderReservas();
    } catch (error) {
        document.getElementById('reservasList').innerHTML = '<div class="error">Erro ao carregar reservas</div>';
    }
}

function renderReservas() {
    const container = document.getElementById('reservasList');
    
    if (reservas.length === 0) {
        container.innerHTML = '<div class="loading">Nenhuma reserva encontrada</div>';
        return;
    }

    const reservasHtml = `
        <table class="table">
            <thead>
                <tr>
                    <th>Quarto</th>
                    <th>Hóspede</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th>Valor</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${reservas.map(reserva => {
                    const checkin = new Date(reserva.data_checkin).toLocaleDateString('pt-BR');
                    const checkout = new Date(reserva.data_checkout).toLocaleDateString('pt-BR');
                    
                    let acoes = '';
                    if (reserva.status === 'CONFIRMADA') {
                        acoes = `<button class="btn btn-success" onclick="fazerCheckin('${reserva.id}')">Check-in</button>`;
                    } else if (reserva.status === 'EM_ANDAMENTO') {
                        acoes = `<button class="btn btn-warning" onclick="fazerCheckout('${reserva.id}')">Check-out</button>`;
                    }
                    if (reserva.status === 'PENDENTE' || reserva.status === 'CONFIRMADA') {
                        acoes += ` <button class="btn btn-danger" onclick="cancelarReserva('${reserva.id}')">Cancelar</button>`;
                    }

                    return `
                        <tr>
                            <td>Quarto ${reserva.quarto?.numero || 'N/A'}</td>
                            <td>${reserva.hospede?.nome || 'N/A'}</td>
                            <td>${checkin}</td>
                            <td>${checkout}</td>
                            <td><span class="status-badge">${reserva.status}</span></td>
                            <td>R$ ${reserva.valor_total?.toFixed(2) || '0.00'}</td>
                            <td>${acoes}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = reservasHtml;
}

async function loadClientes() {
    try {
        const response = await fetch(`${API_URL}/hospedes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        clientes = data.hospedes || [];

        renderClientes();
    } catch (error) {
        document.getElementById('clientesList').innerHTML = '<div class="error">Erro ao carregar clientes</div>';
    }
}

function renderClientes() {
    const container = document.getElementById('clientesList');
    
    if (clientes.length === 0) {
        container.innerHTML = '<div class="loading">Nenhum cliente encontrado</div>';
        return;
    }

    const clientesHtml = `
        <table class="table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Cadastrado em</th>
                </tr>
            </thead>
            <tbody>
                ${clientes.map(cliente => {
                    const cadastrado = new Date(cliente.created_at).toLocaleDateString('pt-BR');
                    return `
                        <tr>
                            <td>${cliente.nome}</td>
                            <td>${cliente.cpf || 'N/A'}</td>
                            <td>${cliente.telefone || 'N/A'}</td>
                            <td>${cliente.email || 'N/A'}</td>
                            <td>${cadastrado}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = clientesHtml;
}

async function buscarClientePorCPF() {
    const cpf = document.getElementById('cpfBusca').value.replace(/\D/g, '');
    
    if (cpf.length !== 11) {
        alert('CPF deve ter 11 dígitos');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/hospedes/cpf/${cpf}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            const cliente = data.hospede;
            const reservas = data.reservas || [];
            
            let reservasHtml = '';
            if (reservas.length > 0) {
                reservasHtml = `
                    <h5 style="margin-top: 15px;">Histórico de Reservas:</h5>
                    <ul>
                        ${reservas.map(r => `
                            <li>Quarto ${r.quarto?.numero} - ${new Date(r.data_checkin).toLocaleDateString('pt-BR')} a ${new Date(r.data_checkout).toLocaleDateString('pt-BR')} - ${r.status}</li>
                        `).join('')}
                    </ul>
                `;
            }
            
            document.getElementById('dadosCliente').innerHTML = `
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>CPF:</strong> ${cliente.cpf || 'N/A'}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone || 'N/A'}</p>
                    <p><strong>Email:</strong> ${cliente.email || 'N/A'}</p>
                    <p><strong>Cadastrado em:</strong> ${new Date(cliente.created_at).toLocaleDateString('pt-BR')}</p>
                    ${reservasHtml}
                </div>
            `;
            document.getElementById('clienteEncontrado').style.display = 'block';
        } else {
            document.getElementById('clienteEncontrado').style.display = 'none';
            alert('Cliente não encontrado');
        }
    } catch (error) {
        alert('Erro ao buscar cliente');
    }
}

async function loadConfiguracoes() {
    try {
        const response = await fetch(`${API_URL}/configuracoes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const configs = data.configuracoes || {};

        document.getElementById('quartosWhatsApp').value = configs.quartosWhatsApp || 5;
        document.getElementById('horarioCheckin').value = configs.horarioCheckin || 13;
        document.getElementById('horarioCheckout').value = configs.horarioCheckout || 11;
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

async function salvarConfiguracoes() {
    const quartosWhatsApp = parseInt(document.getElementById('quartosWhatsApp').value);
    const horarioCheckin = parseInt(document.getElementById('horarioCheckin').value);
    const horarioCheckout = parseInt(document.getElementById('horarioCheckout').value);

    try {
        const response = await fetch(`${API_URL}/configuracoes`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                quartosWhatsApp,
                horarioCheckin,
                horarioCheckout
            })
        });

        if (response.ok) {
            alert('Configurações salvas com sucesso!');
        } else {
            const data = await response.json();
            alert(data.error?.message || 'Erro ao salvar configurações');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
}

async function fazerCheckin(reservaId) {
    if (!confirm('Confirmar check-in?')) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${reservaId}/check-in`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Check-in realizado com sucesso!');
            loadReservas();
            loadDashboard();
        } else {
            const data = await response.json();
            alert(data.error?.message || 'Erro ao fazer check-in');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
}

async function fazerCheckout(reservaId) {
    if (!confirm('Confirmar check-out?')) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${reservaId}/check-out`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Check-out realizado com sucesso!');
            loadReservas();
            loadDashboard();
        } else {
            const data = await response.json();
            alert(data.error?.message || 'Erro ao fazer check-out');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
}

async function cancelarReserva(reservaId) {
    if (!confirm('Confirmar cancelamento da reserva?')) return;

    try {
        const response = await fetch(`${API_URL}/reservas/${reservaId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Reserva cancelada com sucesso!');
            loadReservas();
            loadDashboard();
        } else {
            const data = await response.json();
            alert(data.error?.message || 'Erro ao cancelar reserva');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Formatação de CPF
document.getElementById('cpfBusca').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
});


async function toggleWhatsApp(quartoId, disponivel) {
    try {
        const response = await fetch(`${API_URL}/quartos/${quartoId}/toggle-whatsapp`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ disponivel })
        });

        if (response.ok) {
            const data = await response.json();
            // Mostrar feedback visual
            const toast = document.createElement('div');
            toast.className = 'toast success';
            toast.textContent = data.message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
            
            // Atualizar lista de quartos
            loadQuartos();
        } else {
            const data = await response.json();
            alert(data.error?.message || 'Erro ao atualizar disponibilidade');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
}


let quartoSelecionado = null;

function abrirModalOcupacao(quarto) {
    quartoSelecionado = quarto.id;
    const isOcupado = quarto.status === 'OCUPADO';
    
    document.getElementById('modalQuartoNumero').textContent = quarto.numero;
    document.getElementById('numeroPessoas').max = quarto.capacidade;
    document.getElementById('numeroPessoas').value = 1;
    
    // Definir data de hoje como check-in padrão
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataCheckin').value = hoje;
    
    // Definir amanhã como check-out padrão
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    document.getElementById('dataCheckout').value = amanha.toISOString().split('T')[0];
    
    // Se o quarto está ocupado, preencher dados do hóspede e reserva
    if (isOcupado && quarto.hospede) {
        console.log('Dados do quarto ocupado:', JSON.stringify(quarto, null, 2));
        console.log('Tem reserva?', !!quarto.reserva);
        
        // Dados do hóspede
        document.getElementById('hospedeNome').value = quarto.hospede.nome || '';
        document.getElementById('hospedeCPF').value = quarto.hospede.cpf || '';
        document.getElementById('hospedeTelefone').value = quarto.hospede.telefone || '';
        document.getElementById('hospedeCidade').value = quarto.hospede.cidade || '';
        document.getElementById('hospedeEmail').value = quarto.hospede.email || '';
        document.getElementById('hospedeCEP').value = quarto.hospede.cep || '';
        document.getElementById('hospedeRua').value = quarto.hospede.rua || '';
        document.getElementById('hospedeNumero').value = quarto.hospede.numero || '';
        document.getElementById('hospedeBairro').value = quarto.hospede.bairro || '';
        
        // Dados da reserva
        if (quarto.reserva) {
            console.log('Status pagamento:', quarto.reserva.status_pagamento);
            document.getElementById('dataCheckin').value = quarto.reserva.data_checkin || '';
            document.getElementById('dataCheckout').value = quarto.reserva.data_checkout || '';
            document.getElementById('numeroPessoas').value = quarto.reserva.numero_pessoas || 1;
            
            // Setar status de pagamento (converter para minúsculo se necessário)
            const statusPagamento = (quarto.reserva.status_pagamento || 'pendente').toLowerCase();
            document.getElementById('statusPagamento').value = statusPagamento;
            
            // Mostrar campos de pagamento se necessário
            toggleFormaPagamento();
            
            if (quarto.reserva.forma_pagamento) {
                document.getElementById('formaPagamento').value = quarto.reserva.forma_pagamento;
            }
            if (quarto.reserva.valor_pago) {
                document.getElementById('valorPago').value = quarto.reserva.valor_pago;
            }
            if (quarto.reserva.valor_sinal) {
                document.getElementById('valorSinal').value = quarto.reserva.valor_sinal;
            }
        }
    }
    
    // Mostrar/esconder botões baseado no status
    const btnOcupar = document.querySelector('#formOcupacao button[type="submit"]');
    const btnDesocupar = document.getElementById('btnDesocupar');
    const formOcupacao = document.getElementById('formOcupacao');
    
    if (isOcupado) {
        btnOcupar.style.display = 'none';
        btnDesocupar.style.display = 'block';
        btnDesocupar.style.pointerEvents = 'auto'; // Garantir que o botão seja clicável
        // Desabilitar campos se ocupado
        formOcupacao.style.opacity = '0.6';
        formOcupacao.style.pointerEvents = 'none';
    } else {
        btnOcupar.style.display = 'block';
        btnDesocupar.style.display = 'none';
        formOcupacao.style.opacity = '1';
        formOcupacao.style.pointerEvents = 'auto';
    }
    
    document.getElementById('modalOcupacao').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalOcupacao').style.display = 'none';
    document.getElementById('formOcupacao').reset();
    document.getElementById('formaPagamentoGroup').style.display = 'none';
    document.getElementById('valorPagoGroup').style.display = 'none';
    document.getElementById('valorSinalGroup').style.display = 'none';
    document.getElementById('formOcupacao').style.opacity = '1';
    document.getElementById('formOcupacao').style.pointerEvents = 'auto';
    quartoSelecionado = null;
}

function toggleFormaPagamento() {
    const statusPagamento = document.getElementById('statusPagamento').value;
    const formaPagamentoGroup = document.getElementById('formaPagamentoGroup');
    const formaPagamento = document.getElementById('formaPagamento');
    const valorPagoGroup = document.getElementById('valorPagoGroup');
    const valorPago = document.getElementById('valorPago');
    const valorSinalGroup = document.getElementById('valorSinalGroup');
    const valorSinal = document.getElementById('valorSinal');
    
    // Reset todos os campos
    formaPagamentoGroup.style.display = 'none';
    valorPagoGroup.style.display = 'none';
    valorSinalGroup.style.display = 'none';
    formaPagamento.required = false;
    valorPago.required = false;
    valorSinal.required = false;
    formaPagamento.value = '';
    valorPago.value = '';
    valorSinal.value = '';
    
    if (statusPagamento === 'pago') {
        formaPagamentoGroup.style.display = 'block';
        valorPagoGroup.style.display = 'block';
        formaPagamento.required = true;
        valorPago.required = true;
    } else if (statusPagamento === 'sinal') {
        valorSinalGroup.style.display = 'block';
        valorSinal.required = true;
    }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modalOcupacao');
    if (event.target == modal) {
        fecharModal();
    }
}

async function ocuparQuarto(event) {
    event.preventDefault();
    
    if (!quartoSelecionado) {
        alert('Erro: Nenhum quarto selecionado');
        return;
    }
    
    const statusPagamento = document.getElementById('statusPagamento').value;
    const formaPagamento = document.getElementById('formaPagamento').value;
    
    // Validar forma de pagamento e valor se status for "pago"
    const valorPago = document.getElementById('valorPago').value;
    if (statusPagamento === 'pago') {
        if (!formaPagamento) {
            alert('Por favor, selecione a forma de pagamento');
            return;
        }
        if (!valorPago || parseFloat(valorPago) <= 0) {
            alert('Por favor, informe o valor pago');
            return;
        }
    }
    
    // Validar valor do sinal se status for "sinal"
    const valorSinal = document.getElementById('valorSinal').value;
    if (statusPagamento === 'sinal' && (!valorSinal || parseFloat(valorSinal) <= 0)) {
        alert('Por favor, informe o valor do sinal');
        return;
    }
    
    // Coletar dados do formulário
    const dados = {
        nome: document.getElementById('hospedeNome').value.trim(),
        cpf: document.getElementById('hospedeCPF').value.replace(/\D/g, ''),
        telefone: document.getElementById('hospedeTelefone').value.trim(),
        cidade: document.getElementById('hospedeCidade').value.trim(),
        email: document.getElementById('hospedeEmail').value.trim() || null,
        cep: document.getElementById('hospedeCEP').value.replace(/\D/g, '') || null,
        rua: document.getElementById('hospedeRua').value.trim() || null,
        numero: document.getElementById('hospedeNumero').value.trim() || null,
        bairro: document.getElementById('hospedeBairro').value.trim() || null,
        quarto_id: quartoSelecionado,
        data_checkin: document.getElementById('dataCheckin').value,
        data_checkout: document.getElementById('dataCheckout').value,
        numero_pessoas: parseInt(document.getElementById('numeroPessoas').value),
        status_pagamento: statusPagamento,
        forma_pagamento: formaPagamento && formaPagamento.trim() ? formaPagamento.trim() : null,
        valor_pago: statusPagamento === 'pago' && valorPago ? parseFloat(valorPago) : null,
        valor_sinal: statusPagamento === 'sinal' && valorSinal ? parseFloat(valorSinal) : null
    };
    
    // Limpar campos vazios (converter "" para null)
    Object.keys(dados).forEach(key => {
        if (dados[key] === '' || dados[key] === 'null') {
            dados[key] = null;
        }
    });
    
    console.log('Dados enviados:', dados);
    
    try {
        const response = await fetch(`${API_URL}/ocupacao/manual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Mostrar sucesso
            const toast = document.createElement('div');
            toast.className = 'toast success';
            toast.textContent = '✅ Quarto ocupado com sucesso!';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
            
            // Fechar modal e atualizar
            fecharModal();
            loadQuartos();
            loadDashboard();
        } else {
            console.error('Erro do servidor:', data);
            console.error('Mensagem:', data.error?.message);
            console.error('Detalhes:', data.error?.details);
            
            // Mostrar detalhes do erro
            if (data.error?.details && data.error.details.length > 0) {
                const erroDetalhado = data.error.details.map(d => `${d.field}: ${d.message}`).join('\n');
                console.error('ERRO DETALHADO:', erroDetalhado);
                alert('ERRO:\n' + erroDetalhado);
            } else {
                alert('ERRO: ' + (data.error?.message || 'Erro ao ocupar quarto'));
            }
        }
    } catch (error) {
        alert('Erro de conexão');
    }
}

// Formatação de CPF e busca automática
document.getElementById('hospedeCPF').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
    
    // Buscar cliente quando CPF tiver 11 dígitos
    const cpfLimpo = value.replace(/\D/g, '');
    if (cpfLimpo.length === 11) {
        buscarClientePorCPFModal(cpfLimpo);
    }
});

async function buscarClientePorCPFModal(cpf) {
    try {
        const response = await fetch(`${API_URL}/hospedes/cpf/${cpf}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            const cliente = data.hospede;
            
            // Preencher campos automaticamente
            document.getElementById('hospedeNome').value = cliente.nome || '';
            document.getElementById('hospedeTelefone').value = cliente.telefone || '';
            document.getElementById('hospedeCidade').value = cliente.cidade || '';
            document.getElementById('hospedeEmail').value = cliente.email || '';
            document.getElementById('hospedeCEP').value = cliente.cep || '';
            document.getElementById('hospedeRua').value = cliente.rua || '';
            document.getElementById('hospedeNumero').value = cliente.numero || '';
            document.getElementById('hospedeBairro').value = cliente.bairro || '';
            
            // Mostrar mensagem
            const toast = document.createElement('div');
            toast.className = 'toast success';
            toast.textContent = '✅ Cliente encontrado! Dados preenchidos automaticamente.';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    } catch (error) {
        // Silencioso - se não encontrar, deixa o usuário preencher
        console.log('Cliente não encontrado, permitindo novo cadastro');
    }
}

// Formatação de CEP
document.getElementById('hospedeCEP').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = value;
});


async function desocuparQuarto() {
    if (!quartoSelecionado) {
        alert('Erro: Nenhum quarto selecionado');
        return;
    }
    
    if (!confirm('Tem certeza que deseja desocupar este quarto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/ocupacao/desocupar/${quartoSelecionado}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Mostrar sucesso
            const toast = document.createElement('div');
            toast.className = 'toast success';
            toast.textContent = '✅ Quarto desocupado com sucesso!';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
            
            // Fechar modal e atualizar
            fecharModal();
            loadQuartos();
            loadDashboard();
        } else {
            alert(data.error?.message || 'Erro ao desocupar quarto');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
}
