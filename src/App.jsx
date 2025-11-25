import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; // Extensão adicionada

// Layouts e Páginas - IMPORTAÇÕES CORRIGIDAS
import AdminLayout from './components/Layout/AdminLayout.jsx';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Admin/Dashboard/Dashboard.jsx';
import Veiculos from './pages/Admin/Veiculos/Veiculos.jsx';
import PainelViagem from './pages/Motorista/PainelViagem.jsx';
import Register from './pages/Register/Register.jsx';
// Estilos globais
import './styles/global.css';

// ... (O resto do código de ProtectedRoute e HomePage que já tens está correto)
const ProtectedRoute = ({ children, allowedRoles }) => {
    // ... código do componente sem alterações
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
      return <div className="loading">A verificar autenticação...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // O backend agora tem de fornecer `user.roles` como um array de strings
    const userHasRequiredRole = user && user.roles?.some(role => allowedRoles.includes(role));
    
    if (!userHasRequiredRole) {
        return <Navigate to="/login" replace />; // Ou uma página de "Acesso Negado"
    }

    return children;
};

const HomePage = () => {
    const { user } = useAuth();
    const primaryRole = user?.roles?.[0];

    if (primaryRole === 'ROLE_ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    if (primaryRole === 'ROLE_MOTORISTA') {
        return <Navigate to="/motorista/viagem" replace />;
    }
    return <Navigate to="/login" replace />;
};
// ... fim do código que não muda


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota de Login (Pública) */}
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MOTORISTA', 'ROLE_ENCARREGADO']}>
                <HomePage />
              </ProtectedRoute>
            } 
          />

          {/* Rota de Registo (Pública) */}
          <Route path="/register" element={<Register />} />

          {/* ROTAS DO PAINEL DE ADMINISTRAÇÃO */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="veiculos" element={<Veiculos />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />

          {/* ROTA DO PAINEL DO MOTORISTA */}
          <Route
            path="/motorista/viagem"
            element={
              <ProtectedRoute allowedRoles={['ROLE_MOTORISTA']}>
                <PainelViagem />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;