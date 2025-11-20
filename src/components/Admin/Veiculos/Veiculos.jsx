import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MapPin } from 'lucide-react';
import { veiculoService } from '../../../services/veiculoService';
import DataTable from '../../../components/Common/DataTable/DataTable';
import Button from '../../../components/Common/Button/Button';
import Modal from '../../../components/Common/Modal/Modal';
import VeiculoForm from '../../../components/Admin/VeiculoForm/VeiculoForm';
import './Veiculos.css';

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVeiculos();
  }, []);

  const loadVeiculos = async () => {
    try {
      const data = await veiculoService.getAll();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVeiculo(null);
    setShowModal(true);
  };

  const handleEdit = (veiculo) => {
    setEditingVeiculo(veiculo);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este veículo?')) {
      try {
        await veiculoService.delete(id);
        await loadVeiculos();
      } catch (error) {
        console.error('Erro ao eliminar veículo:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingVeiculo) {
        await veiculoService.update(editingVeiculo.id, formData);
      } else {
        await veiculoService.create(formData);
      }
      setShowModal(false);
      await loadVeiculos();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
    }
  };

  const filteredVeiculos = veiculos.filter(veiculo =>
    veiculo.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.motorista?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'matricula',
      header: 'Matrícula',
      render: (veiculo) => (
        <div className="veiculo-info">
          <div className="matricula">{veiculo.matricula}</div>
          <div className="modelo">{veiculo.modelo}</div>
        </div>
      )
    },
    {
      key: 'motorista',
      header: 'Motorista',
      render: (veiculo) => veiculo.motorista?.nome || 'Não atribuído'
    },
    {
      key: 'capacidade',
      header: 'Capacidade',
      render: (veiculo) => `${veiculo.capacidade} alunos`
    },
    {
      key: 'status',
      header: 'Status',
      render: (veiculo) => (
        <span className={`status-badge ${veiculo.status.toLowerCase()}`}>
          {veiculo.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (veiculo) => (
        <div className="actions">
          <button 
            className="btn-icon"
            onClick={() => handleEdit(veiculo)}
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button 
            className="btn-icon danger"
            onClick={() => handleDelete(veiculo.id)}
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
          <button 
            className="btn-icon primary"
            onClick={() => {/* Navegar para rastreio */}}
            title="Ver localização"
          >
            <MapPin size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="veiculos-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestão de Veículos</h1>
          <p>Gerir carrinhas e motoristas atribuídos</p>
        </div>
        <Button 
          icon={<Plus size={16} />}
          onClick={handleCreate}
        >
          Adicionar Veículo
        </Button>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Pesquisar veículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={16} />
          Filtros
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredVeiculos}
        loading={loading}
        emptyMessage="Nenhum veículo encontrado"
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingVeiculo ? 'Editar Veículo' : 'Adicionar Veículo'}
      >
        <VeiculoForm
          veiculo={editingVeiculo}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Veiculos;