import React from 'react';
import './Button.css';

interface ButtonProps {
  disabled: boolean;
  type: string;
  handleOnClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, handleOnClick }) => {
  return (
    <button className="Button" onClick={handleOnClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
