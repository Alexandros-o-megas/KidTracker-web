import React, { useState } from 'react';
import { authService } from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/services/authService.js';
import Button from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/components/Common/Button/Button.jsx';
import { Plus } from 'lucide-react';

// Um formulário simples para adicionar um motorista
const MotoristaForm = ({ onSave }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nome, email, senha });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do motorista" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email do motorista" required />
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha temporária" required />
            <button type="submit">Salvar Motorista</button>
        </form>
    );
};

const Motoristas = () => {
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');

    const handleSaveMotorista = async (motoristaData) => {
        try {
            const response = await authService.createMotorista(motoristaData);
            setMessage(response); // Ex: "Motorista criado com sucesso!"
            setShowForm(false);
            // Aqui você pode também recarregar a lista de motoristas
        } catch (error) {
            setMessage(error.response?.data || "Erro ao criar motorista.");
        }
    };

    return (
        <div className="motoristas-page">
            <div className="page-header">
                <h1>Gestão de Motoristas</h1>
                <Button icon={<Plus size={16} />} onClick={() => setShowForm(!showForm)}>
                    Adicionar Motorista
                </Button>
            </div>

            {message && <p>{message}</p>}

            {showForm && <MotoristaForm onSave={handleSaveMotorista} />}

            {/* Futuramente, aqui estará a DataTable com a lista de motoristas */}
        </div>
    );
};

export default Motoristas;