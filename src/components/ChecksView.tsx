import React, { useContext } from 'react';
import { CheckRow } from './CheckRow';
import { ChecksContext } from '../providers/ChecksContext';
import { SubmitButton } from './submitButton/SubmitButton';
import { submitCheckResults } from '../api';

export const ChecksView = () => {
  const { checks, lastValidIndex } = useContext(ChecksContext);
  const checkValues = Object.values(checks);

  const checkValuesHasNo = checkValues.some((check) => check.value === 'no');
  const checkValuesHasAllYes = checkValues.every((check) => check.value === 'yes');
  const canSubmit = checkValuesHasNo || checkValuesHasAllYes;

  const handleSubmitClick = () => {
    const validChecks = Object.values(checks).filter((check) => check.value);
    const data = Object.values(checks).map((check) => {
      return {
        checkId: check.id,
        result: check.value,
      };
    });
    submitCheckResults(data)
      .then((res) => console.log({ res }))
      .catch((err) => console.log({ err }));
  };

  return (
    <div className="checksView">
      {Object.entries(checks).map(([key, check], index) => {
        return <CheckRow key={key} check={check} index={index} disabled={index > lastValidIndex} />;
      })}
      <SubmitButton handleClick={handleSubmitClick} disabled={!canSubmit} />
    </div>
  );
};
