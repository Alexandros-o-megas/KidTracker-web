import React, { useState, useEffect } from 'react';
import { rotaService } from '../../../services/rotaService'; // Novo serviço
import './Rotas.css';
import { MapPin, User, ListOrdered } from 'lucide-react';

const Rotas = () => {
    const [rotas, setRotas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRotas = async () => {
            try {
                const data = await rotaService.getAll();
                setRotas(data);
            } catch (error) {
                console.error("Erro ao carregar rotas:", error);
            } finally {
                setLoading(false);
            }
        };
        loadRotas();
    }, []);

    if (loading) return <div>A carregar rotas...</div>;

    return (
        <div className="page-container">
            <h1>Gestão de Rotas</h1>
            <div className="rotas-list">
                {rotas.map(rota => (
                    <div key={rota.id} className="rota-card">
                        <h2>{rota.nome}</h2>
                        <div className="paragens-sequencia">
                            <h3><ListOrdered size={20} /> Sequência de Paragens</h3>
                            <ol>
                                {rota.paragens.map(paragemInfo => (
                                    <li key={paragemInfo.pontoParagem.id}>
                                        <div className="paragem-item">
                                            <MapPin size={16} />
                                            <span>{paragemInfo.pontoParagem.nome}</span>
                                        </div>
                                        <div className="alunos-na-paragem">
                                            {paragemInfo.pontoParagem.alunos.map(aluno => (
                                                <span key={aluno.id}><User size={12}/> {aluno.nome}</span>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rotas;