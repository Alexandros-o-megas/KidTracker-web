// src/App.jsx
import { useState } from 'react';
import RealTimeMap from './components/RealTimeMap';
import './App.css';

export default function App() {
  const [veiculoId, setVeiculoId] = useState(1);

  return (
    <div className="App">
      <header>
        <h1>Painel de Rastreamento de Carrinhas</h1>
      </header>

      <main>
        <h2>A acompanhar o veículo ID: {veiculoId}</h2>

        {/* Exemplo de futura seleção */}
        {/* <select onChange={e => setVeiculoId(Number(e.target.value))}>
          <option value={1}>Carrinha 1</option>
          <option value={2}>Carrinha 2</option>
        </select> */}

        <RealTimeMap veiculoId={veiculoId} />
      </main>
    </div>
  );
}