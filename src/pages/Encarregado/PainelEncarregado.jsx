import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext'; // Para obter dados da família
import { encarregadoService } from '../../services/encarregadoService';
import { Client } from '@stomp/stompjs';
import { Bell, Bus, User, Clock, CheckCircle } from 'lucide-react';
import './PainelEncarregado.css';
import { format } from 'date-fns';
import { SimpleStack } from '../../data_structures/SimpleStack';

const PainelEncarregado = () => {
    const { user } = useAuth(); // Assume que o 'user' tem a informação da família
    const [painelData, setPainelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notificacoesStack, setNotificacoesStack] = useState(() => new SimpleStack());
    const stompClientRef = useRef(null);

    // EFEITO 1: Carregar os dados estáticos dos filhos e da viagem atual
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await encarregadoService.getPainelData();
                setPainelData(data);
                setNotificacoesStack(prevStack =>{
                    const newStack = new SimpleStack();
                    newStack.push({
                        id: 'init', 
                        message: `Sistema conectado. A acompanhar ${data.alunos.length} educando(s).`,
                        timestamp: new Date()
                    });
                    return newStack;
                });
            } catch (error) {
                console.error("Erro ao carregar dados do painel:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // EFEITO 2: Conectar ao WebSocket para receber notificações em tempo real
    useEffect(() => {
        if (!user || !user.familiaId) return;

        const wsUrl = `ws://${window.location.host}/ws`;
        const topic = `/topic/familia/${user.familiaId}`;

        const client = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log(`Conectado ao WebSocket. A subscrever: ${topic}`);
                client.subscribe(topic, (message) => {
                    const novaNotificacao = JSON.parse(message.body);
                    setNotificacoesStack(prevStack => {
                        const newStack = new SimpleStack();
                        const oldItems = prevStack.getItems();
                        for(let i = oldItems.length - 1; i >= 0; i--) {
                            newStack.push(oldItems[i]);
                        }
                        newStack.push({ ...novaNotificacao, id: Date.now() });
                        return newStack;
                    });
                });
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [user]);

    if (loading) return <div className="loading-screen">A carregar o seu painel...</div>;
    if (!painelData) return <div>Não foi possível carregar os dados.</div>;
    
    return (
        <div className="painel-encarregado">
            <header className="painel-header">
                <h1>Painel de Acompanhamento</h1>
                <p>Olá, {painelData.nomeEncarregado}.</p>
            </header>

            {/* LISTA DE NOTIFICAÇÕES EM TEMPO REAL */}
            <div className="feed-notificacoes">
                <div className="feed-header">
                    <Bell size={18} />
                    <h2>Feed de Eventos</h2>
                </div>
                {notificacoesStack.getItems().map(notif => (
                    <div key={notif.id} className="notificacao">
                        <div className="notificacao-icon">
                            {notif.message && notif.message.includes('chegou') ? <CheckCircle /> : <Bus />}
                        </div>
                        <div className="notificacao-conteudo">
                            <p>{notif.message}</p>
                            <span className="timestamp">{notif.timestamp ? format(new Date(notif.timestamp), 'HH:mm:ss') : ''}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* INFORMAÇÃO DOS FILHOS E ETA */}
            <div className="lista-alunos">
                 {painelData.alunos.map(aluno => (
                    <div key={aluno.nomeAluno} className="card-aluno">
                        <div className="card-header-aluno">
                            <User /> {aluno.nomeAluno}
                        </div>
                        <div className="card-conteudo-aluno">
                           <p>Paragem: <strong>{aluno.pontoParagem.nome}</strong></p>
                           <div className="eta-info">
                               <Clock />
                               <span>ETA: <strong>5 min</strong></span> 
                               {/* O backend ainda precisa de enviar esta informação */}
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PainelEncarregado;