import React, { createContext, useReducer } from 'react';

export const ProposalsContext = createContext();

export const proposalsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROPOSALS':
      return {
        proposals: action.payload
      };
    case 'CREATE_PROPOSAL':
      return {
        proposals: [action.payload] // Ensure state.proposals is an array before spreading
      };
    case 'DELETE_PROPOSAL':
      return {
        proposals: state.proposals.filter((proposal) => proposal._id !== action.payload._id)
      };
    case 'EDIT_PROPOSAL':
      return {
        proposals: state.proposals.map((proposal) =>
          proposal._id === action.payload._id ? action.payload : proposal
        )
      };
    case 'SELECT_PROPOSAL':
      return {
        ...state,
        selectedProposalId: action.payload
      };
    default:
      return state;
  }
};

export const ProposalsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(proposalsReducer, {
    proposals: [], // Initialize as an empty array
    selectedProposalId: null
  });

  return (
    <ProposalsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProposalsContext.Provider>
  );
};

