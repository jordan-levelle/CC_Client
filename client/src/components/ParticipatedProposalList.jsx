import React from 'react';
import { useProposalsContext } from '../hooks/useProposalContext';
import { Link } from 'react-router-dom';

const ParticipatedProposalList = ({ proposal }) => {
  const { dispatch } = useProposalsContext();

  const handleProposalClick = (proposalId) => {
    dispatch({ type: 'SELECT_PROPOSAL', payload: proposalId });
  };

  return (
    <div className="proposal-item">
      <h4>{proposal.proposalTitle}</h4>
      {proposal.vote ? (
        <div>
          <p>Your Vote: {proposal.vote.opinion}</p>
          <p>Voted on: {new Date(proposal.vote.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No vote found for this proposal.</p>
      )}
      <div className="proposal-button-group">
        <Link to={`/${proposal.uniqueUrl}`}>
          <button className="view-proposal-button" onClick={() => handleProposalClick(proposal.proposalId)}>View</button>
        </Link>
      </div>
    </div>
  );
};

export default ParticipatedProposalList;