import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🏨 Residencial Hortel</h1>
        </div>
        
        <div className="navbar-user">
          <span>Olá, {user?.nome}</span>
          <button onClick={logout} className="btn-logout">
            Sair
          </button>
        </div>
      </nav>

      <div className="layout-content">
        <aside className="sidebar">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/quartos" className={({ isActive }) => isActive ? 'active' : ''}>
            🛏️ Quartos
          </NavLink>
          <NavLink to="/reservas" className={({ isActive }) => isActive ? 'active' : ''}>
            📅 Reservas
          </NavLink>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
