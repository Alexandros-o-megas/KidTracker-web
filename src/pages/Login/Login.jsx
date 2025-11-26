import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bus, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determina para onde o utilizador deve ir APÓS o login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Após o login, simplesmente navegamos para o destino pretendido.
      // A lógica do App.jsx irá garantir que ele aterre no sítio certo.
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Se já estiver logado, nem sequer mostramos o formulário (a lógica de App.jsx tratará disso)
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <Bus size={48} className="logo-icon" />
            <h1>Carrinhas Escolares</h1>
          </div>
          <p>Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="register-link">
          <span>Não tem uma conta? </span>
          <Link to="/register">Cadastre-se aqui</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;