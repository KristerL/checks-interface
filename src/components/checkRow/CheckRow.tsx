import React, { useContext } from 'react';
import { Check, CheckButtonValues, ChecksContext } from '../../providers/ChecksContext';
import classnames from 'classnames';
import Button from '../button/Button';

import './CheckRow.scss';

interface CheckRowProps {
  check: Check;
  index: number;
  disabled: boolean;
}

export const CheckRow = ({ check, index, disabled }: CheckRowProps) => {
  const { changeCheckValue, activeCheckIndex, setActiveIndex } = useContext(ChecksContext);

  const handleButtonClick = (e: React.MouseEvent<HTMLElement>, value: Exclude<CheckButtonValues, null>) => {
    e.stopPropagation();
    if (!disabled) {
      changeCheckValue(check.id, value, index);
    }
  };

  const handleRowClick = () => {
    setActiveIndex(index);
  };

  const classes = classnames({
    checkRow: true,
    active: activeCheckIndex === index,
    disabled: disabled,
  });

  return (
    <div className={classes} onClick={handleRowClick}>
      <h1 className="checkDescription">{check.description}</h1>
      <div className="buttonContainer">
        {Object.values(CheckButtonValues).map((value) => {
          return (
            <Button
              key={check.id + value}
              classname="toggleButton"
              selected={check.value === value}
              handleOnClick={(e) => handleButtonClick(e, value)}
            >
              {value}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
