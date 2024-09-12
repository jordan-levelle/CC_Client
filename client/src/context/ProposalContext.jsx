import React, { createContext, useReducer, useContext } from 'react';

export const ProposalsContext = createContext();

const initialState = {
  proposals: [],
  selectedProposalId: null,
  participatedProposals: [],
  archivedProposals: [],
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
        archivedProposals: [...state.archivedProposals, action.payload],
      };
    case 'UNARCHIVE_PROPOSAL':
      return {
        ...state,
        archivedProposals: state.archivedProposals.filter(proposal => proposal._id !== action.payload._id),
      };
    default:
      return state;
  }
};

// Add filterProposals function
const filterProposals = (proposals, filter) => {
  switch (filter) {
    case 'Active':
      return proposals.filter(p => !p.isArchived && !p.isExpired);
    case 'Expired':
      return proposals.filter(p => p.isExpired);
    case 'Archived':
      return proposals.filter(p => p.isArchived);
    case 'All':
    default:
      return proposals;
  }
};

export const ProposalsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(proposalsReducer, initialState);

  // Include filterProposals in the context
  const contextValue = {
    ...state,
    dispatch,
    filterProposals,
  };

  return (
    <ProposalsContext.Provider value={contextValue}>
      {children}
    </ProposalsContext.Provider>
  );
};

// Custom hook to use the context
export const useProposalsContext = () => useContext(ProposalsContext);
