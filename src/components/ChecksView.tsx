import React from 'react';
import { Check } from '../App';
import { CheckRow } from './CheckRow';

export const ChecksView = ({ checks }: { checks: Check[] }) => {
  return (
    <div className="checksView">
      {checks.map((check) => (
        <CheckRow key={check.id} check={check} />
      ))}
    </div>
  );
};
