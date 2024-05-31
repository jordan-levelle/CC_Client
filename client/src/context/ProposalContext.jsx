import React, { createContext, useReducer } from 'react';

export const ProposalsContext = createContext();

export const proposalsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROPOSALS':
      return {
        ...state,
        proposals: action.payload,
      };
    case 'CREATE_PROPOSAL':
      return {
        ...state,
        proposals: [action.payload, ...state.proposals],
      };
    case 'DELETE_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.filter((proposal) => proposal._id !== action.payload._id),
      };
    case 'EDIT_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.map((proposal) =>
          proposal._id === action.payload._id ? action.payload : proposal
        ),
      };
    case 'SELECT_PROPOSAL':
      return {
        ...state,
        selectedProposalId: action.payload,
      };
    case 'SET_PARTICIPATED_PROPOSALS':
      return {
        ...state,
        participatedProposals: action.payload,
      };
    default:
      return state;
  }
};

export const ProposalsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(proposalsReducer, {
    proposals: [],
    selectedProposalId: null,
    participatedProposals: [], // Initialize participated proposals
  });

  return (
    <ProposalsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProposalsContext.Provider>
  );
};