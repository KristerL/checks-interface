import React, { useContext } from 'react';
import ToggleButton from '../toggleButton/ToggleButton';
import { Check, CheckButtonValues, ChecksContext } from '../../providers/ChecksContext';
import classnames from 'classnames';

import './CheckRow.scss';

interface CheckRowProps {
  check: Check;
  index: number;
  disabled: boolean;
}

export const CheckRow = ({ check, index, disabled }: CheckRowProps) => {
  const { changeCheckValue, activeCheckIndex } = useContext(ChecksContext);

  const handleButtonClick = (value: Exclude<CheckButtonValues, null>) => {
    if (!disabled) {
      changeCheckValue(check.id, value, index);
    }
  };

  const classes = classnames({
    checkRow: true,
    active: activeCheckIndex === index,
    disabled: disabled,
  });

  return (
    <div className={classes}>
      <h1 className="checkDescription">{check.description}</h1>
      <div className="buttonContainer">
        {Object.values(CheckButtonValues).map((value) => {
          return (
            <ToggleButton
              key={check.id + value}
              selected={check.value === value}
              handleOnClick={() => handleButtonClick(value)}
            >
              {value}
            </ToggleButton>
          );
        })}
      </div>
    </div>
  );
};
