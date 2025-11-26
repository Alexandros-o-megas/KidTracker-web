import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Bus, Users, BarChart3, MapPin, Settings, LogOut, User } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/veiculos', icon: Bus, label: 'Veículos' },
    { path: '/admin/motoristas', icon: Users, label: 'Motoristas' },
    { path: '/admin/alunos', icon: User, label: 'Alunos' },
    { path: '/admin/rotas', icon: MapPin, label: 'Rotas' },
    { path: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' },
    { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Carrinhas Admin</h2>
          <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
            <h1>{menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}</h1>
          </div>
          <div className="header-right">
            <span>Olá, {user?.nome}</span>
            <button className="logout-btn" onClick={handleLogout}><LogOut size={16} /> Sair</button>
          </div>
        </header>
        <main className="page-content">
          <Outlet /> {/* Aqui renderiza Dashboard, Veículos, etc */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
