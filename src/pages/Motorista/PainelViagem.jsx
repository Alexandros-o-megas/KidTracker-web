import React, { useState, useEffect, useMemo, useRef } from 'react';
import { viagemService } from '../../services/viagemService.js';
import { localizacaoService } from '../../services/localizacaoService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Home, School, CarFront, CheckCircle, Navigation, UserCheck, Users, Timer } from 'lucide-react';
import { getDrawablePoints } from '../../utils/mapUtils';
import './PainelViagem.css';

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 700;

const PainelViagem = () => {
    const { user } = useAuth();
    const [viagem, setViagem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusDaViagem, setStatusDaViagem] = useState('AGENDADA');
    const [drawablePoints, setDrawablePoints] = useState([]);
    const [pontosVisitados, setPontosVisitados] = useState([]);
    const [pontoAtualIndex, setPontoAtualIndex] = useState(0);
    const [posicaoVan, setPosicaoVan] = useState({ x: 50, y: SVG_HEIGHT / 2 });
    const watchIdRef = useRef(null);

    const [alunosAbordo, setAlunosAbordo] = useState([]);    
    const [alunosEntregues, setAlunosEntregues] = useState([]); 

    const historyPathString = useMemo(() => {
        if (pontosVisitados.length === 0 || drawablePoints.length === 0) return "";

        const visitedDrawablePoints = drawablePoints.filter(p => pontosVisitados.includes(p.id));
        if (visitedDrawablePoints.length === 0) return "";

        let d = `M ${visitedDrawablePoints[0].x} ${visitedDrawablePoints[0].y}`;
        for (let i = 1; i < visitedDrawablePoints.length; i++) {
            d += ` L ${visitedDrawablePoints[i].x} ${visitedDrawablePoints[i].y}`;
        }
        return d;
    }, [pontosVisitados, drawablePoints]);

    useEffect(() => {
        const fetchViagem = async () => {
            try {
                const viagemAtiva = await viagemService.getMinhaProximaViagem();
                setViagem(viagemAtiva);
                setStatusDaViagem(viagemAtiva.status || 'AGENDADA');

                if (viagemAtiva && viagemAtiva.rota && viagemAtiva.rota.paragens) {
                    const points = getDrawablePoints(viagemAtiva.rota.paragens, SVG_WIDTH, SVG_HEIGHT);
                    setDrawablePoints(points);
                    if (points.length > 0) {
                        setPosicaoVan({ x: points[0].x, y: points[0].y });
                    }
                }
            } catch (error) {
                console.error("Não foi possível carregar a próxima viagem:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchViagem();
    }, []);

    const targetPoint = drawablePoints[pontoAtualIndex];

    const handleIniciarViagem = async () => {
        // Lógica para chamar a API /api/viagens/{id}/iniciar
        setStatusDaViagem('EM_CURSO');
        if ("geolocation" in navigator) {
            watchIdRef.current = navigator.geolocation.watchPosition((pos) => {});
        }
    };

    useEffect(() => {
        if (statusDaViagem !== 'EM_CURSO' || !targetPoint) return;

        const moveVan = () => {
            setPosicaoVan(prev => {
                const dx = targetPoint.x - prev.x;
                const dy = targetPoint.y - prev.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 5) return prev;

                return {
                    x: prev.x + dx * 0.05,
                    y: prev.y + dy * 0.05
                };
            });
        };

        const interval = setInterval(moveVan, 100); 
        return () => clearInterval(interval);
    }, [statusDaViagem, targetPoint]);

    const handleProximoPonto = async () => {
        const paragemAtual = drawablePoints[pontoAtualIndex];
        if (!paragemAtual) return;

        try {
            await viagemService.notificarChegada(paragemAtual.id);
        } catch (error) {
            console.error("Não foi possível notificar chegada:", error);
        }

        const ehEscola = paragemAtual.label.toLowerCase().includes('escola'); 

        if (ehEscola) {
            setAlunosEntregues(prev => [...prev, ...alunosAbordo]);
            setAlunosAbordo([]);
            
            setStatusDaViagem('CONCLUIDA');
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        } else {
            setAlunosAbordo(prevAbordo => [...prevAbordo, ...paragemAtual.alunos]);
        }

        setPontosVisitados(prev => [...prev, paragemAtual.id]);
        if (pontoAtualIndex < drawablePoints.length - 1) {
            setPontoAtualIndex(pontoAtualIndex + 1);
        }
    };


    if (loading) return <div className="loading-screen">A carregar dados...</div>;
    if (!viagem || drawablePoints.length === 0) return <div>Nenhuma viagem válida encontrada.</div>;


    return (
        <div className="painel-motorista-grafico">
            <div className="svg-container">
                <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="map-canvas">
                    {/* Linha que mostra o percurso já feito */}
                    <path
                        d={historyPathString}
                        fill="none" stroke="#10b981" strokeWidth="4"
                    />

                    {/* Linha animada da van para o próximo ponto */}
                    {statusDaViagem === 'EM_CURSO' && targetPoint && (
                        <line
                            x1={posicaoVan.x} y1={posicaoVan.y}
                            x2={targetPoint.x} y2={targetPoint.y}
                            stroke="#6366f1" strokeWidth="3" strokeDasharray="10 6"
                            className="animate-dash"
                        />
                    )}

                    {/* Vértices (Pontos de Paragem) */}
                    {drawablePoints.map((point) => {
                        const isVisited = pontosVisitados.includes(point.id);
                        const isTarget = point.id === targetPoint?.id && statusDaViagem === 'EM_CURSO';
                        const isLastStop = point.alunos.length === 0; // Ex: A escola

                        return (
                            <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
                                <circle
                                    r="25"
                                    fill={isVisited ? "#064e3b" : "#0f172a"}
                                    stroke={isVisited ? '#10b981' : isTarget ? '#6366f1' : '#f59e0b'}
                                    strokeWidth="3"
                                />
                                <foreignObject x="-15" y="-15" width="30" height="30">
                                    <div className="icon-wrapper">
                                        {isVisited ? <CheckCircle size={24} className="text-emerald-500" /> : isLastStop ? <School size={24} className="text-blue-400" /> : <Home size={24} className="text-amber-500" />}
                                    </div>
                                </foreignObject>
                                <text y="45" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="bold">
                                    {point.label}
                                </text>
                                <text y="65" textAnchor="middle" fill="#64748b" fontSize="12">
                                    {isVisited ? "Alcançado" : (isTarget ? `Alunos: ${point.alunos.length}` : "")}
                                </text>
                            </g>
                        );
                    })}

                    {/* A Van */}
                    {statusDaViagem === 'EM_CURSO' && (
                        <g transform={`translate(${posicaoVan.x}, ${posicaoVan.y})`} className="van-marker">
                            <circle r="22" fill="#4f46e5" stroke="white" strokeWidth="2" />
                            <foreignObject x="-14" y="-14" width="28" height="28">
                                <div className="icon-wrapper">
                                    <CarFront size={20} />
                                </div>
                            </foreignObject>
                        </g>
                    )}
                </svg>
            </div>

            <aside className="sidebar-motorista">
                <div className="controles">
                    <h2>Controlo da Viagem</h2>
                    {statusDaViagem === 'AGENDADA' && <button onClick={handleIniciarViagem}><Navigation size={18} /> Iniciar Viagem</button>}
                    {statusDaViagem === 'EM_CURSO' && <button onClick={handleProximoPonto}><Timer size={18} /> Cheguei / Próxima Paragem</button>}
                    {statusDaViagem === 'CONCLUIDA' && <h4><CheckCircle size={18} /> Viagem Concluída!</h4>}
                </div>
                
                <hr />

                <div className="paragem-atual">
                    <h3>Próximo Destino</h3>
                    {targetPoint ? (
                        <>
                           <p><strong>{targetPoint.label}</strong></p>
                           <p className="detail-info">Aguardando embarque de **{targetPoint.alunos.length}** alunos.</p>
                        </>
                    ) : (
                        <p>Fim da rota.</p>
                    )}
                </div>

                <hr />

                <div className="lista-passageiros">
                    <h3><Users size={18}/> Alunos a Bordo ({alunosAbordo.length})</h3>
                    <ul>
                        {alunosAbordo.map(aluno => (
                            // Assumimos que cada aluno tem um 'id' e 'nome'
                            <li key={aluno.id} className="aluno-abordo">
                                <UserCheck size={16} /> {aluno.nome}
                            </li>
                        ))}
                        {alunosAbordo.length === 0 && <li className="empty-list">Nenhum aluno a bordo.</li>}
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default PainelViagem;