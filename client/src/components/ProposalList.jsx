import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from '../hooks/useAuthContext';
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

  const handleEditClick = () => {
    dispatch({ type: 'EDIT_PROPOSAL', payload: { _id: proposal._id } });
  };

  const handleProposalClick = () => {
    dispatch({ type: 'SELECT_PROPOSAL', payload: proposal._id });
  };

  return (
    <div className="proposal-item">
      <h4>{proposal.title}</h4>
      <p>
        Proposed on: {proposal.createdAt ? formatDate(proposal.createdAt) : 'Invalid Date'}
      </p>
      <div className="proposal-button-group">
        <Link to={`/${proposal.uniqueUrl}`}>
          <button className="view-proposal-button" onClick={handleProposalClick}>View</button>
        </Link>
        <Link to={`/edit/${proposal.uniqueUrl}`}>
          <button className="edit-button" onClick={handleEditClick}>Edit</button>
        </Link>
        <button className="delete-proposal-button" onClick={() => setShowConfirmBox(true)}>Delete</button>
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