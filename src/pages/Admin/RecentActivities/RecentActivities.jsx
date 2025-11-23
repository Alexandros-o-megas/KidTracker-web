import React, { useState, useEffect } from 'react';
import { activityService } from '../../../services/activityService'; // Vamos criar este serviço
import { Bus, UserPlus, AlertTriangle } from 'lucide-react';
import './RecentActivities.css';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mapeia o tipo de atividade a um ícone
const iconMap = {
  TRIP_START: <Bus size={18} />,
  NEW_DRIVER: <UserPlus size={18} />,
  SPEED_ALERT: <AlertTriangle size={18} />
};

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await activityService.getRecent();
        setActivities(data);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  if (loading) return <div>A carregar atividades...</div>;

  return (
    <div className="recent-activities">
      <ul>
        {activities.map(activity => (
          <li key={activity.id} className="activity-item">
            <div className={`activity-icon icon-${activity.type.toLowerCase()}`}>
              {iconMap[activity.type] || <Bus size={18} />}
            </div>
            <div className="activity-content">
              <p className="activity-text">{activity.text}</p>
              <p className="activity-time">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;