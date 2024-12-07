import React from 'react';

const Button = ({ children, onClick, variant = 'default', disabled = false }) => {
  const buttonStyles = {
    default: 'bg-black text-white',
    outline: 'bg-white text-black border-2 border-black',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  };

  const currentStyle = disabled ? buttonStyles.disabled : buttonStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg ${currentStyle}`}
    >
      {children}
    </button>
  );
};

export default Button;
