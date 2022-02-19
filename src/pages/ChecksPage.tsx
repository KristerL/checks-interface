import React, { useContext, useEffect, useState } from 'react';
import { ChecksView, SubmitData } from '../components/checksView/ChecksView';
import { ChecksContext } from '../providers/ChecksContext';
import { submitCheckResults } from '../api';

type errorType = {
  message: string;
  type: 'submit' | 'load';
};

export const ChecksPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<errorType>(null);
  const [submitted, setSubmitted] = useState(false);
  const { loadChecks } = useContext(ChecksContext);

  useEffect(() => {
    handleCheckLoad();
  }, []);

  const handleCheckLoad = () => {
    loadChecks()
      .catch((err: errorType) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (data: SubmitData) => {
    setIsLoading(true);
    submitCheckResults(data)
      .then(() => {
        setError(null);
        setSubmitted(true);
      })
      .catch((err) => setError(err))
      .finally(() => {
        setIsLoading(false)
      })
  };

  const renderErrorMessage = () => {
    const reloadData = () => {
      setIsLoading(true);
      setError(null);
      handleCheckLoad();
    };

    return (
      <div className="errorMessageContainer">
        <h1 className="centerText">{error.message}</h1>
        {error.type === 'load' && (
          <button className="submitButton" onClick={reloadData}>
            Try to load again
          </button>
        )}
      </div>
    );
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const renderLoadingView = () => {
    return (
      <div className="viewContainer">
        <h1 className="centerText">Loading...</h1>
      </div>
    )
  };

  const renderSubmitView = () => {
    return (
      <div className="viewContainer">
        <h1>Submit was successful</h1>
        <button className="submitButton" onClick={refreshPage}>
          Start again
        </button>
      </div>
    );
  };

  if (submitted) {
    return renderSubmitView();
  }

  if (isLoading) {
    return renderLoadingView();
  }

  return (
    <div className="viewContainer">
      {error && renderErrorMessage()}
      <ChecksView handleSubmit={handleSubmit} />
    </div>
  );
};
