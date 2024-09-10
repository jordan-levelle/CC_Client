import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { deleteProposalAPI } from '../api/proposals';
import { archiveProposalAPI } from '../api/users';
import { formatDate } from '../constants/HomeTextConstants';
import '../styles/components/userdashboard.css';

const ProposalList = ({ proposal }) => {
  const { dispatch } = useProposalsContext();
  const { user, isSubscribed } = useAuthContext();
  const [daysLeft, setDaysLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (proposal.createdAt) {
      const calcDaysLeft = (createdAt) => {
        const ttlMilliSec = 30 * 24 * 60 * 60 * 1000;
        const createdDate = new Date(createdAt);
        const expiresDate = new Date(createdDate.getTime() + ttlMilliSec);
        const x = new Date();
        const timeDiff = expiresDate - x;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysLeft;
      };
      const days = calcDaysLeft(proposal.createdAt);
      setDaysLeft(days);
      setIsExpired(days <= 0 || proposal.expired);
    }
  }, [proposal.createdAt, proposal.expired]);

  const handleDeleteClick = async () => {
    if (!user) return;

    try {
      await deleteProposalAPI(proposal._id, user.token);
      dispatch({ type: 'DELETE_PROPOSAL', payload: proposal });
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };

  const handleEditClick = () => {
    if (!isExpired) {
      dispatch({ type: 'EDIT_PROPOSAL', payload: { _id: proposal._id } });
    }
  };

  const handleProposalClick = () => {
    if (!isExpired) {
      dispatch({ type: 'SELECT_PROPOSAL', payload: proposal._id });
    }
  };

  const handleArchiveClick = async () => {
    if (!user) return;

    try {
      await archiveProposalAPI(proposal._id, user.token);
      dispatch({ type: 'ARCHIVE_PROPOSAL', payload: proposal });
    } catch (error) {
      console.error('Error archiving proposal:', error);
    }
  };

  return (
    <section>
      <div className="cardlist-item">
        <h4>{proposal.title}</h4>
        <p>
          Proposed on: {proposal.createdAt ? formatDate(proposal.createdAt) : 'Invalid Date'}
        </p>
        <p>
          Expires in: {isExpired ? 'Expired' : `${daysLeft} days`}
        </p>
        <div className="proposal-button-group">
          <Link to={`/${proposal.uniqueUrl}`}>
            <button 
              className="view-proposal-button" 
              onClick={handleProposalClick}
              disabled={isExpired}
              style={{ opacity: isExpired ? 0.1 : 1 }}
            >
              View
            </button>
          </Link>
          <Link to={`/edit/${proposal.uniqueUrl}`}>
            <button 
              className="edit-button" 
              onClick={handleEditClick}
              disabled={isExpired}
              style={{ opacity: isExpired ? 0.1 : 1 }}
            >
              Edit
            </button>
          </Link>
          {isSubscribed && (
            <button 
              className="archive-proposal-button" 
              onClick={handleArchiveClick}
              disabled={isExpired}
            >
              Archive
            </button>
          )}
          <button 
            className="delete-proposal-button" 
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProposalList;
