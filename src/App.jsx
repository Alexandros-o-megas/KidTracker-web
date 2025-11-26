import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

import AdminLayout from './components/Layout/AdminLayout.jsx';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Admin/Dashboard/Dashboard.jsx';
import Veiculos from './pages/Admin/Veiculos/Veiculos.jsx';
import PainelViagem from './pages/Motorista/PainelViagem.jsx';
import Register from './pages/Register/Register.jsx';
import PainelEncarregado from './pages/Encarregado/PainelEncarregado.jsx';
import Motoristas from './pages/Motorista/Motoristas.jsx';
//import Motoritas from './pages/Motorista/Motoritas.jsx';
import Alunos from './pages/Admin/Alunos/Alunos.jsx';
import Rotas from './pages/Admin/Rotas/Rotas.jsx';
import Relatorios from './pages/Admin/Relatorios/Relatorios.jsx';
import Configuracoes from './pages/Admin/Configuracoes/Configuracoes.jsx';

import './styles/global.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading, user } = useAuth(); // agora dentro do provider

  if (loading) return <div className="loading">A carregar aplicação...</div>;

  const getHomeRoute = () => {
    const roles = user?.roles || [];
    if (roles.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (roles.includes('ROLE_MOTORISTA')) return '/motorista/viagem';
    if (roles.includes('ROLE_ENCARREGADO')) return '/encarregado/dashboard';
    return '/login';
  };

  return (
    <Routes>
      {!isAuthenticated && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
      {isAuthenticated && (
        <>
          <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />

          {user.roles.includes('ROLE_ADMIN') && (
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="veiculos" element={<Veiculos />} />
              <Route path="motoristas" element={<Motoristas />} />
              <Route path="alunos" element={<Alunos />} />
              <Route path="rotas" element={<Rotas />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          )}

          {user.roles.includes('ROLE_MOTORISTA') && (
            <Route path="/motorista/viagem" element={<PainelViagem />} />
          )}

          {user.roles.includes('ROLE_ENCARREGADO') && (
            <Route path="/encarregado/dashboard" element={<PainelEncarregado />} />
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
