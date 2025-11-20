import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bus, 
  Users, 
  MapPin, 
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import RealTimeMap from '../../../components/Admin/RealTimeMap/RealTimeMap';
import StatsCard from '../../../components/Common/StatsCard/StatsCard';
import RecentActivities from '../../../components/Admin/RecentActivities/RecentActivities';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVeiculos: 0,
    totalMotoristas: 0,
    totalAlunos: 0,
    rotasAtivas: 0,
    alertas: 0,
    pontualidade: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">A carregar...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Visão Geral</h1>
        <p>Monitorização em tempo real do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          icon={<Bus size={24} />}
          title="Veículos Ativos"
          value={stats.totalVeiculos}
          color="#3B82F6"
          link="/admin/veiculos"
        />
        <StatsCard
          icon={<Users size={24} />}
          title="Motoristas"
          value={stats.totalMotoristas}
          color="#10B981"
          link="/admin/motoristas"
        />
        <StatsCard
          icon={<Users size={24} />}
          title="Alunos"
          value={stats.totalAlunos}
          color="#8B5CF6"
          link="/admin/alunos"
        />
        <StatsCard
          icon={<MapPin size={24} />}
          title="Rotas Ativas"
          value={stats.rotasAtivas}
          color="#F59E0B"
          link="/admin/rotas"
        />
        <StatsCard
          icon={<AlertTriangle size={24} />}
          title="Alertas"
          value={stats.alertas}
          color="#EF4444"
          link="/admin/relatorios"
        />
        <StatsCard
          icon={<TrendingUp size={24} />}
          title="Pontualidade"
          value={`${stats.pontualidade}%`}
          color="#06B6D4"
          info="Taxa de chegadas no horário"
        />
      </div>

      <div className="dashboard-content">
        {/* Mapa em Tempo Real */}
        <div className="map-section">
          <div className="section-header">
            <h2>Localização em Tempo Real</h2>
            <Link to="/admin/rotas" className="view-all">
              Ver todas as rotas
            </Link>
          </div>
          <RealTimeMap />
        </div>

        {/* Atividades Recentes */}
        <div className="activities-section">
          <div className="section-header">
            <h2>Atividades Recentes</h2>
            <Clock size={20} />
          </div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;