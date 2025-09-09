import React from 'react';
import './Alert.css';

const Alert = ({ message, type, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span className="alert-message">{message}</span>
        <button className="alert-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Alert;