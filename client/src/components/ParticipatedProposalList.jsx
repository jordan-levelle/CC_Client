import React from 'react';
import { useProposalsContext } from '../hooks/useProposalContext';
import { removeParticipatedProposalAPI } from '../api/users';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const ParticipatedProposalList = ({ proposal }) => {
  const { user } = useAuthContext(); // Ensure useAuthContext is invoked correctly
  const { dispatch } = useProposalsContext();

  const handleProposalClick = (proposalId) => {
    dispatch({ type: 'SELECT_PROPOSAL', payload: proposalId });
  };

  const handleRemoveClick = async () => {
    if (!user) return;
    console.log(`Initiating removal for proposal ID: ${proposal.proposalId || proposal._id}`);
    console.log('Proposal object:', proposal); // Log the proposal object to debug

    try {
      await removeParticipatedProposalAPI(proposal.proposalId || proposal._id, user.token);
      console.log(`Successfully removed proposal ID: ${proposal.proposalId || proposal._id}`);
      dispatch({ type: 'REMOVE_PROPOSAL', payload: proposal });
    } catch (error) {
      console.error('Error removing participated proposal:', error);
    }
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
          <button className="view-proposal-button" onClick={() => handleProposalClick(proposal.proposalId || proposal._id)} disabled={proposal.isExpired}>View</button>
        </Link>
        <button className="delete-proposal-button" onClick={handleRemoveClick} style={{ opacity: proposal.isExpired ? 0.5 : 1 }}>Remove</button>
      </div>
    </div>
  );
};

export default ParticipatedProposalList;