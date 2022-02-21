import React from 'react';
import classnames from 'classnames';
import './Button.scss';

interface ButtonProps {
  handleOnClick: (e: React.MouseEvent<HTMLElement>) => void;
  classname?: string;
  disabled?: boolean;
  selected?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, handleOnClick, selected, classname }) => {
  const classes = classnames({
    button: true,
    selected: selected,
    disabled: disabled,
    [classname]: !!classname,
  });

  return (
    <button className={classes} onClick={handleOnClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
