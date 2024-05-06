import React from 'react';
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Link } from 'react-router-dom';

const ProposalList = ({ proposal }) => {
  const { dispatch } = useProposalsContext();
  const { user } = useAuthContext();

  const handleDeleteClick = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch('/api/proposals/' + proposal._id, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      if (response.ok) {
        const json = await response.json();
        dispatch({ type: 'DELETE_PROPOSAL', payload: json });
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete proposal: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };

  const handleEditClick = (proposalId) => {
    dispatch({ type: 'EDIT_PROPOSAL', payload: { _id: proposalId } });
  };

  const handleProposalClick = (proposalId) => {
    dispatch({ type: 'SELECT_PROPOSAL', payload: proposalId });
  };

  return (
    <div className="proposal-list-container">
      <div className="proposal-details">
        <h4>{proposal.title}</h4>
        <p>
          Created: {proposal.createdAt ? formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true }) : 'Invalid Date'}
        </p>
        <div className='proposal-button-group'>
          {/* View */}
          <Link to={`/vote/${proposal.uniqueUrl}`}>
            <button className="details-button" onClick={() => handleProposalClick(proposal._id)}>View Proposal</button>
          </Link>

          {/* Edit */}
          <Link to={`/edit/${proposal.uniqueUrl}`}>
            <button className='edit-button' onClick={() => handleEditClick(proposal._id)}>Edit</button>
          </Link>

          {/* Delete */}
          <button className='delete-proposal-button' onClick={handleDeleteClick}>Delete</button>

        </div>
      </div>
    </div>
  );
};

export default ProposalList;


