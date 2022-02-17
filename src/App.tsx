import React, { useContext, useEffect, useState } from 'react';
import { ChecksView } from './components/ChecksView';
import { ChecksContext } from './providers/ChecksContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { loadChecks, handleKeyBoardEvent } = useContext(ChecksContext);

  const handleKeyPress = ({ key }) => {
    if (!['ArrowUp', 'ArrowDown', '1', '2'].includes(key)) {
      return;
    }
    handleKeyBoardEvent(key);
  };

  useEffect(() => {
    loadChecks()
      .catch((err) => {
        setError(err); // TODO error message?
      })
      .finally(() => {
        setIsLoading(false);
      });

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (isLoading) {
    return <h1>Loading data...</h1>;
  }

  // if (error) {
  //   return <h1>{error.message}</h1>;
  // }

  return (
    <div className="checksViewContainer">
      <ChecksView />
    </div>
  );
}
