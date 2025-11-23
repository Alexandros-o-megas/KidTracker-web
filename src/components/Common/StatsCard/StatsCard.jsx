import React from 'react';
import { Link } from 'react-router-dom';
import './StatsCard.css'; // Vamos criar este CSS a seguir

const StatsCard = ({ icon, title, value, color, link, info }) => {
  const content = (
    <>
      <div className="card-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
        {info && <p className="card-info">{info}</p>}
      </div>
    </>
  );

  if (link) {
    return (
      <Link to={link} className="stats-card-link">
        {content}
      </Link>
    );
  }

  return (
    <div className="stats-card">
      {content}
    </div>
  );
};

export default StatsCard;