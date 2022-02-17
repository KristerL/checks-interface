import React from 'react';
import { Check } from '../App';
import Button from './button/Button';

export const CheckRow = ({ check }: { check: Check }) => {
  return (
    <div className="checkRow">
      <h1 className="checkDescription">{check.description}</h1>
      <div>
        <Button disabled={false} type={''} handleOnClick={() => null}>
          Yes
        </Button>
        <Button disabled={false} type={''} handleOnClick={() => null}>
          No
        </Button>
      </div>
    </div>
  );
};
