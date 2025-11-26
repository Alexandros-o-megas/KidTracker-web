import React, { useState, useEffect } from 'react';
import { encarregadoService } from '../../services/encarregadoService'; // Verifique o caminho
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PainelEncarregado.css';
import { Bus, User, MapPin } from 'lucide-react';

// Corrigir o ícone do Leaflet que pode dar problemas
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const PainelEncarregado = () => {
    const [painelData, setPainelData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await encarregadoService.getPainelData();
                setPainelData(data);
            } catch (error) {
                console.error("Erro ao carregar dados do painel:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        
        // No futuro, podemos adicionar aqui o WebSocket para as notificações de ETA
    }, []);

    if (loading) return <div className="loading-screen">A carregar o seu painel...</div>;
    if (!painelData) return <div>Não foi possível carregar os seus dados.</div>;
    
    // Simplificação: vamos assumir o primeiro aluno para mostrar no mapa.
    const primeiroAluno = painelData.alunos[0];

    return (
        <div className="painel-encarregado">
            <header className="painel-header">
                <h1>Olá, {painelData.nomeEncarregado}</h1>
                <p>Acompanhe a viagem dos seus educandos.</p>
            </header>

            {/* Iterar sobre cada aluno/viagem */}
            {painelData.alunos.map((aluno) => (
                <div key={aluno.nomeAluno} className="viagem-card">
                    <div className="viagem-header">
                        <div className="aluno-info">
                            <User /> <span>{aluno.nomeAluno}</span>
                        </div>
                        <div className="rota-info">
                           <Bus /> <span>{aluno.nomeRota} ({aluno.viagem.matriculaVeiculo})</span>
                        </div>
                    </div>

                    <div className="map-container">
                       <MapContainer 
                           center={[aluno.viagem.latAtual, aluno.viagem.lonAtual]} 
                           zoom={14}
                           style={{ height: '300px', width: '100%' }}
                       >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {/* Marcador da Carrinha */}
                            <Marker position={[aluno.viagem.latAtual, aluno.viagem.lonAtual]}>
                                <Popup>Carrinha</Popup>
                            </Marker>
                            {/* Marcador do Ponto de Paragem */}
                            <Marker position={[aluno.pontoParagem.lat, aluno.pontoParagem.lon]} >
                               <Popup>{aluno.pontoParagem.nome}</Popup>
                            </Marker>
                       </MapContainer>
                    </div>

                    <div className="eta-notificacao">
                        <h2>Próxima Paragem: {aluno.pontoParagem.nome} <MapPin size={20}/></h2>
                        <div className="eta-detalhes">
                            <span>Distância: <strong>1.2 km</strong></span>
                            <span>Tempo Estimado: <strong>5 min</strong></span>
                        </div>
                        <p className="status-viagem">Status: Em trânsito</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PainelEncarregado;