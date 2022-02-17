import React from 'react';
import ReactDOM from 'react-dom';

import './styles.scss';
import App from './App';
import { ChecksContextProvider } from './providers/ChecksContextProvider';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <ChecksContextProvider>
      <App />
    </ChecksContextProvider>
  </React.StrictMode>,
  rootElement
);
