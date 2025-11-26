import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/Common/DataTable/DataTable.jsx';
import Button from '../../../components/Common/Button/Button.jsx';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { alunoService } from '../../../services/alunoService'; // Novo serviço

const Alunos = () => {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAlunos = async () => {
            try {
                const data = await alunoService.getAll();
                setAlunos(data);
            } catch (error) {
                console.error("Erro ao carregar alunos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadAlunos();
    }, []);

    const columns = [
        { key: 'nome', header: 'Nome do Aluno' },
        { key: 'matricula', header: 'Matrícula' },
        { key: 'nomeFamilia', header: 'Família' },
        { key: 'nomePontoParagem', header: 'Ponto de Paragem' },
        {
            key: 'actions',
            header: 'Ações',
            render: (aluno) => (
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
                    <h1>Gestão de Alunos</h1>
                    <p>Liste, adicione e edite os alunos do sistema.</p>
                </div>
                <Button icon={<Plus size={16} />}>Adicionar Aluno</Button>
            </div>

            <DataTable
                columns={columns}
                data={alunos}
                loading={loading}
                emptyMessage="Nenhum aluno encontrado."
            />
        </div>
    );
};
export default Alunos;