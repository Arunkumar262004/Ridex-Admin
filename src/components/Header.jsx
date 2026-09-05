import React from 'react';
import { RefreshCw } from 'lucide-react';

const Header = ({ title, onRefresh }) => {
  return (
    <header className="top-header">
      <h1>{title}</h1>
      <div className="header-actions">
        <span className="live-badge">
          <span className="dot"></span> Backend Live
        </span>
        <button className="btn btn-primary" onClick={onRefresh}>
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>
    </header>
  );
};

export default Header;
