import { useState, useEffect } from 'react';
import api from '../services/api';
import './ReservasPage.css';

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODAS');

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data.reservas);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id) => {
    if (!confirm('Confirmar check-in?')) return;
    
    try {
      await api.patch(`/reservas/${id}/check-in`);
      alert('Check-in realizado com sucesso!');
      loadReservas();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Erro ao fazer check-in');
    }
  };

  const handleCheckOut = async (id) => {
    if (!confirm('Confirmar check-out?')) return;
    
    try {
      await api.patch(`/reservas/${id}/check-out`);
      alert('Check-out realizado com sucesso!');
      loadReservas();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Erro ao fazer check-out');
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;
    
    try {
      await api.delete(`/reservas/${id}`);
      alert('Reserva cancelada com sucesso!');
      loadReservas();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Erro ao cancelar reserva');
    }
  };

  const reservasFiltradas = reservas.filter(r => 
    filtro === 'TODAS' || r.status === filtro
  );

  const getStatusBadge = (status) => {
    const badges = {
      PENDENTE: { class: 'pendente', text: 'Pendente' },
      CONFIRMADA: { class: 'confirmada', text: 'Confirmada' },
      EM_ANDAMENTO: { class: 'em-andamento', text: 'Em Andamento' },
      CONCLUIDA: { class: 'concluida', text: 'Concluída' },
      CANCELADA: { class: 'cancelada', text: 'Cancelada' }
    };
    return badges[status] || { class: '', text: status };
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="reservas-page">
      <div className="page-header">
        <div>
          <h1>Reservas</h1>
          <p className="subtitle">{reservas.length} reservas no sistema</p>
        </div>
        
        <div className="filtros">
          <button className={filtro === 'TODAS' ? 'active' : ''} onClick={() => setFiltro('TODAS')}>
            Todas
          </button>
          <button className={filtro === 'CONFIRMADA' ? 'active' : ''} onClick={() => setFiltro('CONFIRMADA')}>
            Confirmadas
          </button>
          <button className={filtro === 'EM_ANDAMENTO' ? 'active' : ''} onClick={() => setFiltro('EM_ANDAMENTO')}>
            Em Andamento
          </button>
        </div>
      </div>

      <div className="reservas-list">
        {reservasFiltradas.map(reserva => {
          const badge = getStatusBadge(reserva.status);
          
          return (
            <div key={reserva.id} className="reserva-card">
              <div className="reserva-header">
                <div>
                  <h3>{reserva.hospede?.nome || 'Hóspede'}</h3>
                  <p className="telefone">{reserva.hospede?.telefone}</p>
                </div>
                <span className={`status-badge ${badge.class}`}>{badge.text}</span>
              </div>

              <div className="reserva-info">
                <div className="info-row">
                  <span className="label">Quarto:</span>
                  <span className="value">Nº {reserva.quarto?.numero} ({reserva.quarto?.tipo})</span>
                </div>
                <div className="info-row">
                  <span className="label">Check-in:</span>
                  <span className="value">{new Date(reserva.data_checkin).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="info-row">
                  <span className="label">Check-out:</span>
                  <span className="value">{new Date(reserva.data_checkout).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="info-row">
                  <span className="label">Valor:</span>
                  <span className="value">R$ {reserva.valor_total.toFixed(2)}</span>
                </div>
              </div>

              <div className="reserva-actions">
                {reserva.status === 'CONFIRMADA' && (
                  <button className="btn-checkin" onClick={() => handleCheckIn(reserva.id)}>
                    ✓ Check-in
                  </button>
                )}
                {reserva.status === 'EM_ANDAMENTO' && (
                  <button className="btn-checkout" onClick={() => handleCheckOut(reserva.id)}>
                    ✓ Check-out
                  </button>
                )}
                {['PENDENTE', 'CONFIRMADA'].includes(reserva.status) && (
                  <button className="btn-cancelar" onClick={() => handleCancelar(reserva.id)}>
                    ✕ Cancelar
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {reservasFiltradas.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma reserva encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
