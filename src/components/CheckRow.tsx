import React, { useContext } from 'react';
import Button from './button/Button';
import { Check, CheckButtonValues, ChecksContext } from '../providers/ChecksContext';
import classnames from 'classnames';

export const CheckRow = ({ check, index }: { check: Check; index: number }) => {
  const { changeCheckValue, activeCheckIndex } = useContext(ChecksContext);

  const handleButtonClick = (value: Exclude<CheckButtonValues, null>) => {
    changeCheckValue(check.id, value, index);
  };

  const classes = classnames({
    checkRow: true,
    active: activeCheckIndex === index,
  });

  return (
    <div className={classes}>
      <h1 className="checkDescription">{check.description}</h1>
      <div className="buttonContainer">
        <Button selected={check.value === 'yes'} handleOnClick={() => handleButtonClick('yes')}>
          Yes
        </Button>
        <Button selected={check.value === 'no'} handleOnClick={() => handleButtonClick('no')}>
          No
        </Button>
      </div>
    </div>
  );
};
