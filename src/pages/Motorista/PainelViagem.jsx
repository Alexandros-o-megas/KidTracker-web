import React, { useState, useEffect, useRef } from 'react';
import { rotaService } from '../../services/rotaService'; // Terá de ser criado
import { localizacaoService } from '../../services/localizacaoService'; // Terá de ser criado
import { useAuth } from '../../context/AuthContext'; // Para obter o ID do motorista
import { Client } from '@stomp/stompjs';

// Ícones para uma melhor UI
import { Flag, CheckCircle, Navigation, Radio } from 'lucide-react';

import './PainelViagem.css'; // Estilos dedicados

const PainelViagem = () => {
    const { user } = useAuth(); // Assume que o 'user' tem o ID
    const [status, setStatus] = useState('Parado');
    const [rota, setRota] = useState(null);
    const [loading, setLoading] = useState(true);
    const [proximoPontoIndex, setProximoPontoIndex] = useState(0);
    const [etaInfo, setEtaInfo] = useState({ distanciaKm: '-', tempoEstimado: '-' });
    const watchIdRef = useRef(null);
    const stompClientRef = useRef(null);

    // EFEITO 1: Ir buscar a rota do motorista quando o componente monta
    useEffect(() => {
        const fetchRota = async () => {
            try {
                const rotaAtiva = await rotaService.getMinhaRotaAtiva();
                setRota(rotaAtiva);
            } catch (error) {
                console.error("Não foi possível carregar a rota ativa:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRota();
    }, []);

    // EFEITO 2: Configurar a ligação WebSocket para receber ETAs
    useEffect(() => {
        if (!user || !user.id) return; // Só conecta se tivermos o ID do motorista

        const wsUrl = `ws://${window.location.host}/ws`;
        const driverTopic = `/topic/motorista/${user.id}`;
        
        const client = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log(`Conectado ao WebSocket. A subscrever: ${driverTopic}`);
                client.subscribe(driverTopic, (message) => {
                    const update = JSON.parse(message.body);
                    setEtaInfo(update);
                });
            },
        });
        
        client.activate();
        stompClientRef.current = client;

        return () => { // Limpeza
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [user]);

    // Lógica de controlo da viagem
    const enviarLocalizacao = (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        // O ID do veículo vem da rota que foi carregada
        if (rota && rota.veiculo) {
            localizacaoService.enviar(rota.veiculo.id, { latitude, longitude, speed });
        }
    };

    const iniciarViagem = () => {
        if ("geolocation" in navigator) {
            setStatus('Em Rota');
            watchIdRef.current = navigator.geolocation.watchPosition(
                enviarLocalizacao,
                (error) => console.error("Erro de Geolocalização:", error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            alert('Geolocalização não é suportada.');
        }
    };

    const terminarViagem = () => {
        setStatus('Parado');
        if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
    
    // Função para avançar para a próxima paragem (ex: botão "Cheguei")
    const avancarParaProximoPonto = () => {
        if (proximoPontoIndex < rota.paragens.length - 1) {
            setProximoPontoIndex(proximoPontoIndex + 1);
        } else {
            // Última paragem alcançada
            setStatus('Rota Concluída');
            terminarViagem();
        }
    };
    
    if (loading) return <div>A carregar dados da rota...</div>;
    if (!rota) return <div>Nenhuma rota ativa encontrada para si.</div>;

    const proximoPonto = rota.paragens[proximoPontoIndex]?.pontoParagem;

    return (
        <div className="painel-motorista">
            <header className="painel-header">
                <h1>Painel de Viagem: {rota.nome}</h1>
                <div className={`status-badge ${status.replace(' ', '-').toLowerCase()}`}>
                    <Radio size={16} /> {status}
                </div>
            </header>

            {/* Painel de controlo e info do próximo destino */}
            <div className="control-panel">
                <div className="next-stop-info">
                    <h2>Próxima Paragem <Navigation size={20} /></h2>
                    {proximoPonto ? (
                        <>
                            <p className="stop-name">{proximoPonto.nome}</p>
                            <div className="eta-details">
                                <span>Distância: <strong>{etaInfo.distanciaKm}</strong></span>
                                <span>Chegada em: <strong>{etaInfo.tempoEstimado}</strong></span>
                            </div>
                        </>
                    ) : <p>Destino final</p>
                    }
                </div>
                <div className="action-buttons">
                    {status === 'Parado' && <button className="btn-start" onClick={iniciarViagem}>Iniciar Viagem</button>}
                    {status === 'Em Rota' && <button className="btn-stop" onClick={terminarViagem}>Pausar/Parar</button>}
                    {status === 'Em Rota' && <button className="btn-next" onClick={avancarParaProximoPonto}>Cheguei / Próximo</button>}
                </div>
            </div>

            {/* Grafo de Prioridade da Rota */}
            <div className="rota-visualizer">
                <h3>Progresso da Rota</h3>
                <div className="stops-list">
                    {rota.paragens.map((paragemInfo, index) => {
                        const status = index < proximoPontoIndex ? 'completed' : index === proximoPontoIndex ? 'next' : 'pending';
                        const Icon = status === 'completed' ? CheckCircle : status === 'next' ? Navigation : Flag;
                        
                        return (
                            <div key={paragemInfo.pontoParagem.id} className={`stop-item ${status}`}>
                                <div className="stop-icon"><Icon size={24} /></div>
                                <div className="stop-details">
                                    <h4>{paragemInfo.pontoParagem.nome}</h4>
                                    {/* Mostrar alunos na paragem - Informação útil */}
                                    <p className="alunos-list">
                                        Alunos: {paragemInfo.pontoParagem.alunos.map(a => a.nome).join(', ')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PainelViagem;