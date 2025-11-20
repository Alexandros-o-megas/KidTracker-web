import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Client } from '@stomp/stompjs';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RealTimeMap.css';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const RealTimeMap = () => {
    // Estado para guardar a localização de múltiplos veículos
    const [vehicleLocations, setVehicleLocations] = useState({});
    const [center] = useState([-25.9653, 32.5832]); // Centro inicial (Maputo)
    const stompClientRef = useRef(null);

    useEffect(() => {
        // O backend precisa publicar todas as atualizações de localização neste tópico geral
        const generalTopic = '/topic/locations/updates';
        
        // Constrói a URL do WebSocket a partir da localização atual da página
        const wsUrl = `ws://${window.location.host}/ws`;

        const client = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Mapa: Conectado ao WebSocket!');
                client.subscribe(generalTopic, (message) => {
                    const update = JSON.parse(message.body);
                    // O backend deve enviar um payload com: { veiculoId, lat, lon, matricula, ... }
                    setVehicleLocations(prev => ({
                        ...prev,
                        [update.veiculoId]: update,
                    }));
                });
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                console.log('Mapa: Desconectado do WebSocket.');
            }
        };
    }, []);

    // Converte o objeto de localizações para um array para renderização
    const vehicles = Object.values(vehicleLocations);

    return (
        <div className="real-time-map">
            <MapContainer center={center} zoom={12} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {vehicles.map((veiculo) => (
                    <Marker key={veiculo.veiculoId} position={[veiculo.lat, veiculo.lon]}>
                        <Popup>
                            <div className="veiculo-popup">
                                <h3>{veiculo.matricula || `Veículo ID: ${veiculo.veiculoId}`}</h3>
                                <p><strong>Velocidade:</strong> {veiculo.velocidade?.toFixed(1) || 0} km/h</p>
                                <p><strong>Última atualização:</strong> {new Date(veiculo.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default RealTimeMap;