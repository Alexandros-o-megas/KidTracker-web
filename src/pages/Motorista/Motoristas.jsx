import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

import { authService } from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/services/authService.js';
import Button from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/components/Common/Button/Button.jsx';

import DataTable from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/components/Common//DataTable/DataTable.jsx';
import Modal from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/components/Common//Modal/Modal.jsx';
import { usuarioService } from 'C:/Users/Quive/Programador/sistema_carrinhas_escolares_KidTracker/carrinhas-web/src/services/usuarioService.js';

const MotoristaForm = ({ onSave, onCancel }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ nome, email, senha });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="motorista-form">
            <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="senha">Senha Provisória</label>
                <input id="senha" type="password" value={senha} placeholder="Mínimo 8 caracteres" required />
            </div>
            <div className="form-actions">
                <Button type="button" onClick={onCancel} className="btn-secondary">Cancelar</Button>
                <Button type="submit" disabled={loading}>{loading ? 'A salvar...' : 'Salvar Motorista'}</Button>
            </div>
        </form>
    );
};


const Motoristas = () => {
    const [motoristas, setMotoristas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    
    // Função para carregar a lista de motoristas da API
    const loadMotoristas = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.getAllMotoristas();
            setMotoristas(data);
        } catch (error) {
            console.error("Erro ao carregar motoristas:", error);
            setMessage("Falha ao carregar a lista de motoristas.");
        } finally {
            setLoading(false);
        }
    };
    
    // O useEffect com [] garante que a lista é carregada apenas uma vez
    useEffect(() => {
        loadMotoristas();
    }, []);

    const handleSave = async (motoristaData) => {
        try {
            const responseMessage = await authService.createMotorista(motoristaData);
            setMessage(responseMessage || "Motorista criado com sucesso!"); // Usa a mensagem da API ou uma padrão
            setShowModal(false);
            loadMotoristas(); // Recarrega a lista para mostrar o novo motorista
        } catch (error) {
            setMessage(error.response?.data?.message || "Erro ao criar motorista.");
        }
    };
    
    // Definição das colunas para a DataTable
    const columns = [
        { 
          key: 'nome', 
          header: 'Nome',
          // A API devolve um UsuarioDTO com nome e email, então o acesso é direto
          render: (motorista) => <strong>{motorista.nome}</strong> 
        },
        { key: 'email', header: 'Email' },
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
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Gestão de Motoristas</h1>
                    <p>Adicione, edite e visualize os motoristas do sistema.</p>
                </div>
                <Button icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
                    Adicionar Motorista
                </Button>
            </div>

            {/* Exibe mensagens de sucesso ou erro */}
            {message && <div className="alert-message">{message}</div>}
            
            {/* ======================================================= */}
            {/*     SUBSTITUIÇÃO DO PLACEHOLDER PELA DATATABLE REAL     */}
            {/* ======================================================= */}
            <DataTable
                columns={columns}
                data={motoristas}
                loading={loading}
                emptyMessage="Nenhum motorista encontrado. Clique em 'Adicionar Motorista' para criar um."
            />
            
            {/* O Modal para adicionar novos motoristas */}
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