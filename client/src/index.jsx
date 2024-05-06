import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-tooltip/dist/react-tooltip.css'
import './index.css';
import App from './App';
import { ProposalsContextProvider } from './context/ProposalContext';
import { VoteContextProvider } from './context/VoteContext';
import { AuthContextProvider } from './context/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProposalsContextProvider>
        <VoteContextProvider>
          <App />
        </VoteContextProvider>
      </ProposalsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


