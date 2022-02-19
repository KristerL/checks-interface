import React from 'react';
import { ChecksPage } from './pages/ChecksPage';
import { ChecksContextProvider } from './providers/ChecksContextProvider';

export default function App() {
  return (
    <ChecksContextProvider>
      <ChecksPage />
    </ChecksContextProvider>
  );
}
