import React from 'react';
import classnames from 'classnames';
import './ToggleButton.scss';

interface ButtonProps {
  disabled?: boolean;
  selected: boolean;
  handleOnClick: () => void;
}

const ToggleButton: React.FC<ButtonProps> = ({ children, disabled, handleOnClick, selected }) => {
  const classes = classnames({
    button: true,
    selected: selected,
  });

  return (
    <button className={classes} onClick={handleOnClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default ToggleButton;
