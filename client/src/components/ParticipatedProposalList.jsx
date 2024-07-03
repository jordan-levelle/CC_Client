import React from 'react';
import { useProposalsContext } from '../hooks/useProposalContext';
import { Link } from 'react-router-dom';

const ParticipatedProposalList = ({ proposals }) => {
  const { dispatch } = useProposalsContext();
  
  const handleProposalClick = (proposalId) => {
    dispatch({ type: 'SELECT_PROPOSAL', payload: proposalId });
  };

  return (
    <div className="proposal-list-container">
      {proposals && proposals.length > 0 ? (
        proposals.map(({ proposalId, proposalTitle, uniqueUrl, vote }) => (
          <div key={proposalId} className="proposal-item">
            <h4>{proposalTitle}</h4>
            {vote ? (
              <div>
                <p>Your Vote: {vote.opinion}</p>
                <p>Voted on: {new Date(vote.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <p>No vote found for this proposal.</p>
            )}
            <div className="proposal-button-group">
              <Link to={`/${uniqueUrl}`}> {/* Replace `proposalId` with `proposalId.uniqueUrl` */}
                <button className="view-proposal-button" onClick={() => handleProposalClick(proposalId)}>View</button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No participated proposals found.</p>
      )}
    </div>
  );
};

export default ParticipatedProposalList;