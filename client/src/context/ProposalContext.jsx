import React, { createContext, useReducer } from 'react';

export const ProposalsContext = createContext();

const initialState = {
  proposals: [],
  selectedProposalId: null,
  participatedProposals: [],
};

const proposalsReducer = (state, action) => {
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
    case 'REMOVE_PROPOSAL':
      return {
        ...state,
        participatedProposals: state.participatedProposals.filter(
          (proposal) => proposal.proposalId !== action.payload.proposalId
        ),
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
          proposal._id === action.payload._id ? { ...proposal, ...action.payload } : proposal
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
    case 'ARCHIVE_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.map((proposal) =>
          proposal._id === action.payload._id ? { ...proposal, archived: true } : proposal
        ),
      };
    default:
      return state;
  }
};

export const ProposalsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(proposalsReducer, initialState);

  return (
    <ProposalsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProposalsContext.Provider>
  );
};
