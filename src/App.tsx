import React, { useContext, useEffect, useState } from 'react';
import { ChecksView, SubmitData } from './components/ChecksView';
import { ChecksContext } from './providers/ChecksContext';
import { submitCheckResults } from './api';

type errorType = {
  message: string;
  type: 'submit' | 'load';
};
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<errorType>(null);
  const [submitted, setSubmitted] = useState(false);
  const { loadChecks } = useContext(ChecksContext);

  useEffect(() => {
    handleCheckLoad();
  }, []);

  const handleSubmit = (data: SubmitData) => {
    submitCheckResults(data)
      .then(() => {
        setError(null);
        setSubmitted(true);
      })
      .catch((err) => setError(err));
  };

  const handleCheckLoad = () => {
    setIsLoading(true);
    setError(null)
    loadChecks()
      .catch((err: errorType) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderError = () => {
    return (
      <div className="checksViewContainer">
        <h1>{error.message}</h1>
        {error.type === 'load' && <button onClick={handleCheckLoad}>Try to load again</button>}
      </div>
    );
  };

  const renderLoading = () => {
    return <h1>Loading data...</h1>;
  };

  if (submitted) {
    const refreshPage = () => {
      window.location.reload();
    };

    return (
      <div className="checksViewContainer">
        <h1>Submit was successful</h1>
        <button onClick={refreshPage}>Start again</button>
      </div>
    );
  }

  return (
    <div className="checksViewContainer">
      {isLoading && renderLoading()}
      {error && renderError()}
      <ChecksView handleSubmit={handleSubmit} />
    </div>
  );
}
