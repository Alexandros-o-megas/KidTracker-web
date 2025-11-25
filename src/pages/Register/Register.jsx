// Ficheiro: src/pages/Register/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService'; // Precisamos de um novo método aqui
import './Register.css'; // Criar este CSS a seguir

const Register = () => {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.register(formData);
            setSuccess('Registo efetuado com sucesso! Será redirecionado para o login.');
            setTimeout(() => navigate('/login'), 2000); // Redireciona após 2s
        } catch (err) {
            setError(err.response?.data || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Criar Conta de Encarregado</h1>
                <p>Registe-se para acompanhar as viagens.</p>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    {/* Campo Nome */}
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input type="text" name="nome" id="nome" onChange={handleChange} required />
                    </div>

                    {/* Campo Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" onChange={handleChange} required />
                    </div>

                    {/* Campo Senha */}
                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <input type="password" name="senha" id="senha" onChange={handleChange} required />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'A registar...' : 'Criar Conta'}
                    </button>
                </form>
                <div className="login-link">
                    <span>Já tem uma conta? </span>
                    <Link to="/login">Faça o login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;