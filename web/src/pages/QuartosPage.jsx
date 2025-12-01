import { useState, useEffect } from 'react';
import api from '../services/api';
import './QuartosPage.css';

export default function QuartosPage() {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    loadQuartos();
  }, []);

  const loadQuartos = async () => {
    try {
      const response = await api.get('/quartos');
      setQuartos(response.data.quartos);
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
    } finally {
      setLoading(false);
    }
  };

  const quartosFiltrados = quartos.filter(q => 
    filtro === 'TODOS' || q.tipo === filtro
  );

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="quartos-page">
      <div className="page-header">
        <div>
          <h1>Quartos</h1>
          <p className="subtitle">{quartos.length} quartos cadastrados</p>
        </div>
        
        <div className="filtros">
          <button 
            className={filtro === 'TODOS' ? 'active' : ''}
            onClick={() => setFiltro('TODOS')}
          >
            Todos
          </button>
          <button 
            className={filtro === 'INDIVIDUAL' ? 'active' : ''}
            onClick={() => setFiltro('INDIVIDUAL')}
          >
            Individuais
          </button>
          <button 
            className={filtro === 'TRIPLO' ? 'active' : ''}
            onClick={() => setFiltro('TRIPLO')}
          >
            Triplos
          </button>
        </div>
      </div>

      <div className="quartos-grid">
        {quartosFiltrados.map(quarto => (
          <div key={quarto.id} className="quarto-card">
            <div className="quarto-header">
              <h3>Quarto {quarto.numero}</h3>
              <span className={`badge ${quarto.ativo ? 'ativo' : 'inativo'}`}>
                {quarto.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <div className="quarto-info">
              <div className="info-item">
                <span className="label">Tipo:</span>
                <span className="value">{quarto.tipo}</span>
              </div>
              <div className="info-item">
                <span className="label">Capacidade:</span>
                <span className="value">{quarto.capacidade} pessoa(s)</span>
              </div>
              <div className="info-item">
                <span className="label">Diária:</span>
                <span className="value">R$ {quarto.preco_diaria.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
