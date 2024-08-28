import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-tooltip/dist/react-tooltip.css';
import './index.css';

import { ProposalsContextProvider } from './context/ProposalContext';
import { VoteContextProvider } from './context/VoteContext';
import { AuthContextProvider } from './context/AuthContext';
import { TeamsContextProvider } from './context/TeamsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
      <ProposalsContextProvider>
        <VoteContextProvider>
          <TeamsContextProvider>
          <App />
          </TeamsContextProvider>  
        </VoteContextProvider>
      </ProposalsContextProvider>
    </AuthContextProvider>
);
