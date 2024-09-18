import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { deleteProposalAPI, fetchProposalListAPI } from 'src/api/proposals'; 
import { toggleArchiveProposalAPI } from 'src/api/users';
import { formatDate } from '../constants/Constants';
import '../styles/components/userdashboard.css';
import Modal from './PopupOverlay';

const ProposalList = ({ proposal }) => {
  const { dispatch } = useProposalsContext();
  const { user, isSubscribed } = useAuthContext();
  const [daysLeft, setDaysLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to manage modal visibility

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
      setIsExpired(days <= 0 || proposal.isExpired);
    }
  }, [proposal.createdAt, proposal.isExpired]);

  const handleDeleteClick = async () => {
    if (!user) return;

    try {
      await deleteProposalAPI(proposal._id, user.token);
      dispatch({ type: 'DELETE_PROPOSAL', payload: proposal });
      setIsModalOpen(false);  // Close modal after deletion
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
      const response = await toggleArchiveProposalAPI(proposal._id, user.token);
      dispatch({ 
        type: response.isArchived ? 'ARCHIVE_PROPOSAL' : 'UNARCHIVE_PROPOSAL', 
        payload: proposal 
      });
      const proposalsData = await fetchProposalListAPI(user.token);
      dispatch({ type: 'SET_PROPOSALS', payload: proposalsData });
    } catch (error) {
      console.error('Error toggling archive state:', error);
    }
  };

  return (
    <section>
      <div className="cardlist-item">
        <h4>{proposal.title}</h4>
        <p>
          Proposed on: {proposal.createdAt ? formatDate(proposal.createdAt) : 'Invalid Date'}
        </p>
        {!isSubscribed && (
          <p>
            Expires in: {isExpired ? 'Expired' : `${daysLeft} days`}
          </p>
        )}
        <div className="proposal-button-group">
          <Link to={`/${proposal.uniqueUrl}`}>
            <button 
              className="small-button" 
              onClick={handleProposalClick}
              disabled={isExpired}
              style={{ opacity: isExpired ? 0.1 : 1 }}
            >
              View
            </button>
          </Link>
          <Link to={`/edit/${proposal.uniqueUrl}`}>
            <button 
              className="small-button" 
              onClick={handleEditClick}
              disabled={isExpired}
              style={{ opacity: isExpired ? 0.1 : 1 }}
            >
              Edit
            </button>
          </Link>
          {isSubscribed && (
            <button 
              className="small-button" 
              onClick={handleArchiveClick}
              disabled={isExpired}
            >
              {proposal.isArchived ? 'Unarchive' : 'Archive'}
            </button>
          )}
          <button 
            className="small-delete-button" 
            onClick={() => setIsModalOpen(true)}  // Open modal on delete click
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal for delete confirmation */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div style={{ textAlign: 'center' }}>
          <p>Are you sure you want to delete this proposal? It will delete all responses.</p>
          <button
            className='small-button' 
            style={{ marginRight: '10px' }} 
            onClick={handleDeleteClick}>Yes
          </button>
          <button
            className='small-button' 
            onClick={() => setIsModalOpen(false)}>No</button>
        </div>
      </Modal>
    </section>
  );
};

export default ProposalList;
