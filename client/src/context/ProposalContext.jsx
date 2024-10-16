import React, { createContext, useReducer } from 'react';

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

    // Updated to filter out archived proposals
    case 'SET_PARTICIPATED_PROPOSALS':
      return {
        ...state,
        participatedProposals: action.payload.filter(p => !p.archived),
      };

    case 'ARCHIVE_PROPOSAL': {
      const updatedProposals = state.proposals.map(p =>
        p._id === action.payload._id ? { ...p, isArchived: true } : p
      );
      return { 
        ...state, 
        proposals: updatedProposals,
      };
    }

    case 'UNARCHIVE_PROPOSAL': {
      const updatedProposals = state.proposals.map(p =>
        p._id === action.payload._id ? { ...p, isArchived: false } : p
      );
      return { 
        ...state, 
        proposals: updatedProposals,
      };
    }

    case 'ARCHIVE_PARTICIPATED_PROPOSAL': {
      const updatedParticipatedProposals = state.participatedProposals.map(p =>
        p._id === action.payload._id ? { ...p, isArchived: true } : p
      );
      return { 
        ...state, 
        participatedProposals: updatedParticipatedProposals 
      };
    }

    case 'UNARCHIVE_PARTICIPATED_PROPOSAL': {
      const updatedParticipatedProposals = state.participatedProposals.map(p =>
        p._id === action.payload._id ? { ...p, isArchived: false } : p
      );
      return { 
        ...state, 
        participatedProposals: updatedParticipatedProposals 
      };
    }

    default:
      return state;
  }
};

// Filtering functions
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

const filterParticipatedProposals = (participatedProposals, filter) => {
  switch (filter) {
    case 'Archived':
      return participatedProposals.filter(p => p.isArchived);
    case 'All':
    default:
      return participatedProposals;
  }
};


export const ProposalsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(proposalsReducer, initialState);

  const contextValue = {
    ...state,
    dispatch,
    filterProposals,
    filterParticipatedProposals
  };

  return (
    <ProposalsContext.Provider value={contextValue}>
      {children}
    </ProposalsContext.Provider>
  );
};
