import { Link } from 'react-router-dom';
import { useProposalsContext } from '../hooks/useProposalContext';
import { archiveParticipatedProposalAPI, fetchParticipatedProposalsAPI } from 'src/api/users';
import { useAuthContext } from '../hooks/useAuthContext';

const ParticipatedProposalList = ({ proposal }) => {
  const { user } = useAuthContext();
  const { dispatch } = useProposalsContext();

  const handleProposalClick = (proposalId) => {
    dispatch({ type: 'SELECT_PROPOSAL', payload: proposalId });
  };

  const handleArchiveParticipatedProposal = async () => {
    if (!user) return;
  
    try {
      const response = await archiveParticipatedProposalAPI(proposal._id, user.token);
      
      // Toggle the state in the frontend using the response from the backend
      const isArchived = response.isArchived;
      
      // Dispatch the correct action based on the updated archive state
      dispatch({
        type: isArchived ? 'ARCHIVE_PARTICIPATED_PROPOSAL' : 'UNARCHIVE_PARTICIPATED_PROPOSAL',
        payload: { ...proposal, isArchived } // Pass the updated proposal
      });
  
      // Fetch updated participated proposals list (if you want to refresh the list)
      const proposalData = await fetchParticipatedProposalsAPI(user.token);
      dispatch({ type: 'SET_PARTICIPATED_PROPOSALS', payload: proposalData });
    } catch (error) {
      console.error('Error archiving/unarchiving participated proposal:', error);
    }
  };
  

  return (
    <div className="cardlist-item">
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
            className="small-button"
            onClick={() => handleProposalClick(proposal._id)}
            disabled={proposal.isExpired}
          >
            View
          </button>
        </Link>
        <button
          className="small-button"
          onClick={handleArchiveParticipatedProposal}
        >
          {proposal.isArchived ? 'Unarchive' : 'Archive'}
        </button>
      </div>
    </div>
  );
};

export default ParticipatedProposalList;
