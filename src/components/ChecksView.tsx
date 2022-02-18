import React, { useContext } from 'react';
import { CheckRow } from './CheckRow';
import { ChecksContext } from '../providers/ChecksContext';
import { SubmitButton } from './submitButton/SubmitButton';

export type SubmitData = { checkId: string; result: string }[];

interface ChecksViewProps {
  handleSubmit: (data: SubmitData) => void;
}

export const ChecksView: React.FC<ChecksViewProps> = ({ handleSubmit }) => {
  const { checks, lastValidIndex } = useContext(ChecksContext);
  const checkValues = Object.values(checks);

  const checkValuesHasNo = checkValues.some((check) => check.value === 'no');
  const checkValuesHasAllYes = checkValues.every((check) => check.value === 'yes');
  const canSubmit = checkValuesHasNo || checkValuesHasAllYes;

  const handleSubmitClick = () => {
    const validChecks = Object.values(checks).filter((check) => check.value);
    const data: SubmitData = Object.values(checks).map((check) => {
      return {
        checkId: check.id,
        result: check.value,
      };
    });
    handleSubmit(data);
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
