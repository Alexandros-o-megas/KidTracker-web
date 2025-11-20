import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/Layout/AdminLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Veiculos from './pages/Admin/Veiculos/Veiculos';
import Motoristas from './pages/Admin/Motoristas/Motoristas';
import Alunos from './pages/Admin/Alunos/Alunos';
import Rotas from './pages/Admin/Rotas/Rotas';
import Relatorios from './pages/Admin/Relatorios/Relatorios';
import Configuracoes from './pages/Admin/Configuracoes/Configuracoes';
import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">A verificar autenticação...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">A verificar autenticação...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="veiculos" element={<Veiculos />} />
                    <Route path="motoristas" element={<Motoristas />} />
                    <Route path="alunos" element={<Alunos />} />
                    <Route path="rotas" element={<Rotas />} />
                    <Route path="relatorios" element={<Relatorios />} />
                    <Route path="configuracoes" element={<Configuracoes />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;