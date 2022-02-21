import React, { useContext } from 'react';
import { CheckRow } from '../checkRow/CheckRow';
import { CheckButtonValues, ChecksContext } from '../../providers/ChecksContext';
import { SubmitButton } from '../submitButton/SubmitButton';

import './ChecksView.scss';

export type SubmitData = { checkId: string; result: string }[];

interface ChecksViewProps {
  handleSubmit: (data: SubmitData) => void;
}

export const ChecksView = ({ handleSubmit }: ChecksViewProps) => {
  const { checks, lastValidIndex } = useContext(ChecksContext);
  const checkValues = Object.values(checks);

  if (checkValues.length === 0) {
    return null;
  }

  const checkValuesHasNo = checkValues.some((check) => check.value === CheckButtonValues.NO);
  const checkValuesHasAllYes = checkValues.every((check) => check.value === CheckButtonValues.YES);
  const canSubmit = checkValuesHasNo || checkValuesHasAllYes;

  const handleSubmitClick = () => {
    if (!canSubmit) {
      return;
    }

    const checksWithDefinitiveValue = Object.values(checks).filter((check) => check.value !== undefined);
    const data: SubmitData = checksWithDefinitiveValue.map((check) => {
      return {
        checkId: check.id,
        result: check.value,
      };
    });
    handleSubmit(data);
  };

  return (
    <div>
      {Object.entries(checks).map(([key, check], index) => {
        return <CheckRow key={key} check={check} index={index} disabled={index > lastValidIndex} />;
      })}
      <div className="submitButtonContainer">
        <SubmitButton handleClick={handleSubmitClick} disabled={!canSubmit} />
      </div>
    </div>
  );
};
