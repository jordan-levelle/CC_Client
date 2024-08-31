import React, { useState } from 'react';
import { useProposalsContext } from '../hooks/useProposalContext';
import { Link } from 'react-router-dom';
// import { useAuthContext } from '../hooks/useAuthContext';

const ParticipatedProposalList = ({ proposal, showHidden }) => {
  // const { user } = useAuthContext();
  const { dispatch } = useProposalsContext();
  const [isHidden, setIsHidden] = useState(false);

  const handleProposalClick = (proposalId) => {
    dispatch({ type: 'SELECT_PROPOSAL', payload: proposalId });
  };

  const handleHideClick = () => {
    setIsHidden(!isHidden);
  };

  if (isHidden && !showHidden) return null;

  return (
    <div className="cardlist-item ">
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
          <button
            className="view-proposal-button"
            onClick={() => handleProposalClick(proposal.proposalId || proposal._id)}
            disabled={proposal.isExpired}
          >
            View
          </button>
        </Link>
        <button
          className="delete-proposal-button"
          onClick={handleHideClick}
          style={{ opacity: proposal.isExpired ? 0.5 : 1 }}
        >
          {isHidden ? 'Unhide' : 'Hide'}
        </button>
      </div>
    </div>
  );
};

export default ParticipatedProposalList;

