import React from 'react';
import classnames from 'classnames';
import './SubmitButton.scss';

interface SubmitButtonProps {
  handleClick: () => void;
  disabled: boolean;
}

export const SubmitButton = ({ handleClick, disabled }: SubmitButtonProps) => {
  const classes = classnames({
    submitButton: true,
    disabled: disabled,
  });

  return (
    <button className={classes} onClick={handleClick}>
      SUBMIT
    </button>
  );
};
