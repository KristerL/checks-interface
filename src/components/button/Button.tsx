import React from 'react';
import classnames from 'classnames';
import './Button.scss';

interface ButtonProps {
  disabled?: boolean;
  selected: boolean;
  handleOnClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, handleOnClick, selected }) => {
  const classes = classnames({
    Button: true,
    selected: selected,
  });

  return (
    <button className={classes} onClick={handleOnClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
