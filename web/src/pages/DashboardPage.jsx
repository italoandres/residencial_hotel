import { useState, useEffect } from 'react';
import api from '../services/api';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalQuartos: 0,
    quartosDisponiveis: 0,
    reservasAtivas: 0,
    checkinsHoje: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [quartosRes, reservasRes] = await Promise.all([
        api.get('/quartos'),
        api.get('/reservas')
      ]);

      const quartos = quartosRes.data.quartos;
      const reservas = reservasRes.data.reservas;

      const hoje = new Date().toISOString().split('T')[0];
      const reservasAtivas = reservas.filter(r => 
        ['CONFIRMADA', 'EM_ANDAMENTO'].includes(r.status)
      );
      const checkinsHoje = reservas.filter(r => 
        r.data_checkin === hoje && r.status === 'CONFIRMADA'
      );

      setStats({
        totalQuartos: quartos.length,
        quartosDisponiveis: quartos.length - reservasAtivas.length,
        reservasAtivas: reservasAtivas.length,
        checkinsHoje: checkinsHoje.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p className="subtitle">Visão geral do hotel</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛏️</div>
          <div className="stat-content">
            <h3>{stats.totalQuartos}</h3>
            <p>Total de Quartos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.quartosDisponiveis}</h3>
            <p>Quartos Disponíveis</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.reservasAtivas}</h3>
            <p>Reservas Ativas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3>{stats.checkinsHoje}</h3>
            <p>Check-ins Hoje</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Bem-vindo ao Painel Administrativo</h2>
        <p>Use o menu lateral para navegar entre as seções:</p>
        <ul>
          <li><strong>Quartos:</strong> Visualize todos os quartos e seu status atual</li>
          <li><strong>Reservas:</strong> Gerencie reservas, faça check-in e check-out</li>
        </ul>
      </div>
    </div>
  );
}
