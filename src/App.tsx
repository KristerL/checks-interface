import React, { useContext, useEffect, useState } from 'react';
import { ChecksView, SubmitData } from './components/ChecksView';
import { ChecksContext } from './providers/ChecksContext';
import { submitCheckResults } from './api';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { loadChecks } = useContext(ChecksContext);

  useEffect(() => {
    loadChecks()
      .catch((err) => {
        setError(err); // TODO error message?
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (data: SubmitData) => {
    submitCheckResults(data)
      .catch((err) => console.log({ err }));
  };

  if (isLoading) {
    return <h1>Loading data...</h1>;
  }

  // if (error) {
  //   return <h1>{error.message}</h1>;
  // }

  return (
    <div className="checksViewContainer">
      <ChecksView handleSubmit={handleSubmit} />
    </div>
  );
}
