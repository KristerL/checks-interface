import React, { useEffect, useState } from 'react';
import { fetchChecks } from './api';
import { ChecksView } from './components/ChecksView';

export interface Check {
  id: string;
  priority: number;
  description: string;
}

export default function App() {
  const [checks, setChecks] = useState<Check[]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChecks()
      .then((res) => {
        const sortedChecks = res.sort((a, b) => b.priority - a.priority);
        setChecks(sortedChecks);
      })
      .catch((err) => {
        setError(err); // TODO error message?
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h1>Loading data...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="checksViewContainer">
      <ChecksView checks={checks} />
    </div>
  );
}
