import React from 'react';

const MetricCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="metric-card glass">
      <div className={`metric-icon ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className="metric-info">
        <span className="label">{title}</span>
        <h3>{value}</h3>
      </div>
    </div>
  );
};

export default MetricCard;
