import React, { useContext } from 'react';
import { CheckRow } from './CheckRow';
import { ChecksContext } from '../providers/ChecksContext';

export const ChecksView = () => {
  const { checks } = useContext(ChecksContext);
  return (
    <div className="checksView">
      {Object.entries(checks).map(([key, check], index) => {
        return <CheckRow key={key} check={check} index={index} />;
      })}
    </div>
  );
};
