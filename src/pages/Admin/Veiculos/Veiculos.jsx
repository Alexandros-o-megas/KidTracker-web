import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MapPin } from 'lucide-react';
import { veiculoService } from '../../../services/veiculoService';
import DataTable from '../../../components/Common/DataTable/DataTable';
import Button from '../../../components/Common/Button/Button';
import Modal from '../../../components/Common/Modal/Modal';
import VeiculoForm from '../../../pages/Admin/VeiculoForm/VeiculoForm';
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

  const filteredVeiculos = veiculos.filter(veiculo => {
    const search = searchTerm.toLowerCase();

    // Verificação defensiva para cada campo antes de chamar toLowerCase()
    const matriculaMatch = veiculo.matricula && veiculo.matricula.toLowerCase().includes(search);
    const modeloMatch = veiculo.modelo && veiculo.modelo.toLowerCase().includes(search);
    
    // Verificação defensiva para o motorista (o campo problemático)
    const motoristaMatch = veiculo.motorista && veiculo.motorista.nome &&
                           veiculo.motorista.nome.toLowerCase().includes(search);

    return matriculaMatch || modeloMatch || motoristaMatch;
  });

  const columns = [
    {
      key: 'matricula',
      header: 'Matrícula',
      render: (veiculo) => (
        <div className="veiculo-info">
          <div className="matricula">{veiculo.matricula || '-'}</div>
          <div className="modelo">{veiculo.modelo || '-'}</div>
        </div>
      )
    },
    {
      key: 'motorista',
      header: 'Motorista',
      // CORREÇÃO: Usar o operador opcional `?.` e um fallback 'Não atribuído'
      render: (veiculo) => veiculo.motorista?.nome || 'Não atribuído'
    },
    {
      key: 'capacidade',
      header: 'Capacidade',
      render: (veiculo) => veiculo.capacidade ? `${veiculo.capacidade} alunos` : '-'
    },
    {
      key: 'status',
      header: 'Status',
      render: (veiculo) => (
        // CORREÇÃO: Lidar com status nulo ou indefinido
        <span className={`status-badge ${veiculo.status ? veiculo.status.toLowerCase() : 'desconhecido'}`}>
          {veiculo.status || 'Desconhecido'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (veiculo) => (
        <div className="actions">
           {/* Adicionar aqui os botões de ação que já tinhas */}
        </div>
      )
    }
  ];

  return (
    <div className="veiculos-page">
      {/* ... o teu JSX do header e da toolbar que já tens ... */}
       <div className="page-header">
        <div className="header-content">
          <h1>Gestão de Veículos</h1>
          <p>Gerir carrinhas e motoristas atribuídos</p>
        </div>
        <Button 
          icon={<Plus size={16} />}
          onClick={() => { setEditingVeiculo(null); setShowModal(true); }}
        >
          Adicionar Veículo
        </Button>
      </div>

       <div className="page-toolbar">
         <div className="search-box">
           <Search size={20} />
           <input
            type="text"
            placeholder="Pesquisar por matrícula, modelo ou motorista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
       </div>


      <DataTable
        columns={columns}
        data={filteredVeiculos}
        loading={loading}
        emptyMessage="Nenhum veículo encontrado."
      />

       <Modal
         isOpen={showModal}
         onClose={() => setShowModal(false)}
         title={editingVeiculo ? 'Editar Veículo' : 'Adicionar Veículo'}
       >
         <VeiculoForm
          veiculo={editingVeiculo}
          onSubmit={async (formData) => { /* ... lógica de submit ... */ }}
          onCancel={() => setShowModal(false)}
         />
       </Modal>
    </div>
  );
};

export default Veiculos;