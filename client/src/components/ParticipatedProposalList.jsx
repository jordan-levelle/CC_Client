import React from 'react';
import { useProposalsContext } from '../hooks/useProposalContext';
import { Link } from 'react-router-dom';
import { formatDate } from '../constants/HomeTextConstants';

const ParticipatedProposalList = ({ proposal }) => {
  const { dispatch } = useProposalsContext();

  const handleProposalClick = (proposalId) => {
    dispatch({ type: 'SELECT_PROPOSAL', payload: proposalId });
  };

  return (
    <div className="proposal-list-container">
      <div className="proposal-item">
        <h4>{proposal.title}</h4>
        <p>
          Proposed on: {proposal.createdAt ? formatDate(proposal.createdAt) : 'Invalid Date'}
        </p>
        <div className="proposal-button-group">
          <Link to={`/${proposal.uniqueUrl}`}>
            <button className="view-proposal-button" onClick={() => handleProposalClick(proposal._id)}>View</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParticipatedProposalList;