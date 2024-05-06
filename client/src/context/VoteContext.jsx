import React, { createContext, useState } from 'react';

export const VoteContext = createContext();

export const voteReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const VoteContextProvider = ({ children }) => {
  const [selectedProposalId, setSelectedProposalId] = useState(null);

  return (
    <VoteContext.Provider value={{ selectedProposalId, setSelectedProposalId }}>
      {children}
    </VoteContext.Provider>
  );
};

