import React from 'react';

const Alert = ({ message, type = 'info' }) => {
  const alertStyles = {
    info: 'bg-blue-100 text-blue-800 border-blue-400',
    success: 'bg-green-100 text-green-800 border-green-400',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    error: 'bg-red-100 text-red-800 border-red-400',
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-lg ${alertStyles[type] || alertStyles.info}`}
    >
      <p>{message}</p>
    </div>
  );
};

export default Alert;
