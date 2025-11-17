import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Client } from '@stomp/stompjs';
import 'leaflet/dist/leaflet.css'; // Essencial para o mapa renderizar corretamente

// Componente para recentralizar o mapa quando a posição muda
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const RealTimeMap = ({ veiculoId }) => {
  const [position, setPosition] = useState([-25.9653, 32.5832]); // Posição inicial (ex: Maputo)
  const stompClientRef = useRef(null); // Usar useRef para manter a instância do cliente entre renders

  useEffect(() => {
    // URL do endpoint WebSocket do nosso backend Spring Boot
    const WS_URL = 'ws://localhost:8080/ws';
    const topic = `/topic/veiculo/${veiculoId}`;

    console.log(`Tentando conectar ao WebSocket em ${WS_URL} e subscrever ao tópico ${topic}`);

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('CONECTADO ao WebSocket!');
        client.subscribe(topic, (message) => {
          try {
            const locationUpdate = JSON.parse(message.body);
            console.log('Nova localização recebida:', locationUpdate);
            // Atualiza a posição do marcador no mapa
            setPosition([locationUpdate.lat, locationUpdate.lon]);
          } catch (error) {
            console.error('Erro ao processar mensagem JSON:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Erro de broker relatado:', frame.headers['message']);
        console.error('Detalhes adicionais:', frame.body);
      },
      onWebSocketError: (error) => {
        console.error('Erro no WebSocket:', error);
      }
    });

    client.activate();
    stompClientRef.current = client;

    // Função de limpeza: será executada quando o componente for "desmontado"
    return () => {
      if (stompClientRef.current && stompClientRef.current.active) {
        stompClientRef.current.deactivate();
        console.log('Desconectado do WebSocket.');
      }
    };
  }, [veiculoId]); // O efeito será re-executado se o veiculoId mudar

  return (
    <MapContainer center={position} zoom={16} style={{ height: '600px', width: '100%' }}>
      <ChangeView center={position} zoom={16} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>Localização atual da carrinha.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default RealTimeMap;