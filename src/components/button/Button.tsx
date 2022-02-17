import React from 'react';
import './Button.css';

interface ButtonProps {
 text: string;
 disabled: boolean;
 type: string;
 onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
 return <button className="Button">{children}</button>;
};

export default Button;
