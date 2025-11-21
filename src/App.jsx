import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importar as páginas e layouts
import AdminLayout from './components/Layout/AdminLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Veiculos from './pages/Admin/Veiculos/Veiculos';
// (Importar as outras páginas de Admin: Motoristas, Alunos, etc.)

// Importar a nova página do Motorista
import PainelViagem from './pages/Motorista/PainelViagem';

// Importar estilos globais
import './styles/global.css';

/**
 * Componente Protetor de Rotas
 * Este componente age como um porteiro para as áreas privadas da aplicação.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    // Mostra um ecrã de carregamento enquanto se verifica a autenticação
    return <div className="loading">A verificar autenticação...</div>;
  }

  if (!isAuthenticated) {
    // Se o utilizador não está autenticado, redireciona-o para a página de login.
    // O 'state' guarda a página onde ele tentou ir, para ser redirecionado de volta após o login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se o utilizador tem permissão para aceder à rota
  // O backend deve fornecer os perfis (roles) do utilizador no objeto 'user'.
  const userHasRequiredRole = user && user.roles?.some(role => allowedRoles.includes(role.nome));

  if (!userHasRequiredRole) {
      // Se não tem permissão, pode ser redirecionado para uma página "Não Autorizado"
      // ou de volta para a sua página principal. Por agora, voltamos ao login.
      // Numa app mais complexa, teria uma página de "Acesso Negado".
      return <Navigate to="/login" replace />;
  }
  
  // Se passou em todas as verificações, mostra a página que foi pedida.
  return children;
};

/**
 * Página de Entrada
 * Decide para onde o utilizador deve ir após o login, com base no seu perfil principal.
 */
const HomePage = () => {
    const { user } = useAuth();
    // Esta lógica assume que o primeiro perfil na lista é o "principal".
    // Pode ser melhorada para um perfil padrão definido no backend.
    const primaryRole = user?.roles?.[0]?.nome;

    if (primaryRole === 'ROLE_ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    if (primaryRole === 'ROLE_MOTORISTA') {
        return <Navigate to="/motorista/viagem" replace />;
    }
    
    // Fallback: Se não tiver um perfil conhecido, vai para o login.
    return <Navigate to="/login" replace />;
};

function App() {
  return (
    // O AuthProvider disponibiliza os dados de autenticação a toda a aplicação.
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota de Login (Pública) */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota Raiz Protegida: Redireciona para o painel correto */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MOTORISTA', 'ROLE_ENCARREGADO']}>
                <HomePage />
              </ProtectedRoute>
            } 
          />

          {/* ROTAS DO PAINEL DE ADMINISTRAÇÃO */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="veiculos" element={<Veiculos />} />
                    {/* <Route path="motoristas" element={<Motoristas />} /> */}
                    {/* ... outras rotas de admin aqui ... */}
                    {/* Redirecionamento para a página principal do admin */}
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
          
          {/* Fallback para qualquer outra rota - redireciona para a raiz */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;