import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { usuarioService } from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/services/usuarioService.js'; 
import { authService } from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/services/authService.js';
import DataTable from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/components/Common/DataTable/DataTable.jsx';
import Button from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/components/Common/Button/Button.jsx';
import Modal from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/components/Common/Modal/Modal.jsx';
import './Motoristas.css'; 

const MotoristaForm = ({ onSave, onCancel }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nome, email, senha });
    };

    return (
        <form onSubmit={handleSubmit} className="motorista-form">
            <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Senha Provisória</label>
                <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
            </div>
            <div className="form-actions">
                <Button type="button" onClick={onCancel} className="btn-secondary">Cancelar</Button>
                <Button type="submit">Salvar Motorista</Button>
            </div>
        </form>
    );
};


const Motoristas = () => {
    const [motoristas, setMotoristas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    
    const loadMotoristas = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.getAllMotoristas();
            setMotoristas(data);
        } catch (error) {
            console.error("Erro ao carregar motoristas:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadMotoristas();
    }, []);

    const handleSave = async (motoristaData) => {
        try {
            const response = await authService.createMotorista(motoristaData);
            setMessage(response);
            setShowModal(false);
            loadMotoristas(); // Recarrega a lista para mostrar o novo motorista
        } catch (error) {
            setMessage(error.response?.data || "Erro ao criar motorista.");
        }
    };
    
    const columns = [
        { key: 'nome', header: 'Nome' },
        { key: 'email', header: 'Email' },
        { 
            key: 'veiculos', 
            header: 'Veículos Atribuídos', 
            render: (motorista) => 'N/A' // Lógica futura aqui
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (motorista) => (
                <div className="actions">
                    <button className="btn-icon" title="Editar"><Edit size={16} /></button>
                    <button className="btn-icon danger" title="Eliminar"><Trash2 size={16} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="motoristas-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>Gestão de Motoristas</h1>
                    <p>Adicionar, editar e visualizar motoristas.</p>
                </div>
                <Button icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
                    Adicionar Motorista
                </Button>
            </div>

            {message && <p>{message}</p>}
            
            <DataTable
                columns={columns}
                data={motoristas}
                loading={loading}
                emptyMessage="Nenhum motorista encontrado."
            />
            
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Adicionar Novo Motorista"
            >
                <MotoristaForm 
                    onSave={handleSave} 
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        </div>
    );
};

export default Motoristas;