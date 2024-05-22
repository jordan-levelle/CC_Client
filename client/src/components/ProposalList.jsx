import React, { useState } from 'react';
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import { deleteProposalAPI } from '../api/proposals';
import { formatDate } from '../constants/HomeTextConstants';

const ProposalList = ({ proposal }) => {
  const { dispatch } = useProposalsContext();
  const { user } = useAuthContext();
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const handleDeleteClick = async () => {
    if (!user) return;

    try {
      await deleteProposalAPI(proposal._id, user.token);
      dispatch({ type: 'DELETE_PROPOSAL', payload: proposal });
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }

    setShowConfirmBox(false);
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
          Proposed on: {proposal.createdAt ? formatDate(proposal.createdAt) : 'Invalid Date'}
        </p>
        <div className="proposal-button-group">
          <Link to={`/vote/${proposal.uniqueUrl}`}>
            <button className="details-button" onClick={() => handleProposalClick(proposal._id)}>View Proposal</button>
          </Link>
          <Link to={`/edit/${proposal.uniqueUrl}`}>
            <button className="edit-button" onClick={() => handleEditClick(proposal._id)}>Edit</button>
          </Link>
          <button className="delete-proposal-button" onClick={() => setShowConfirmBox(true)}>Delete</button>
        </div>
      </div>

      {showConfirmBox && (
        <div className="confirmation-popup">
          <div className="confirmation-content">
            <p>Are you sure you want to delete this proposal? This will delete all responses.</p>
            <button className="confirm-button" onClick={handleDeleteClick}>Yes</button>
            <button className="cancel-button" onClick={() => setShowConfirmBox(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalList;




