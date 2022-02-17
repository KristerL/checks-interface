import React, { useContext } from 'react';
import { CheckRow } from './CheckRow';
import { ChecksContext } from '../providers/ChecksContext';

export const ChecksView = () => {
  const { checks } = useContext(ChecksContext);
  const validChecks = Object.values(checks).filter(check => check.value).length;
  return (
    <div className="checksView">
      {Object.entries(checks).map(([key, check], index) => {
        return <CheckRow key={key} check={check} index={index} disabled={index > validChecks}/>;
      })}
    </div>
  );
};
