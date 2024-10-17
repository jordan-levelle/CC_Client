import { Link } from 'react-router-dom';
import { useProposalsContext } from '../hooks/useProposalContext';
import { archiveParticipatedProposalAPI } from 'src/api/users'; // Removed fetchParticipatedProposalsAPI as unnecessary
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
      dispatch({
        type: response.isArchived ? 'ARCHIVE_PARTICIPATED_PROPOSAL' : 'UNARCHIVE_PARTICIPATED_PROPOSAL',
        payload: { ...proposal, isArchived: response.isArchived }, // Ensure the proposal gets updated correctly
      });
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
          {proposal.isArchived ? "Unarchive" : "Archive"}
        </button>
      </div>
    </div>
  );
};

export default ParticipatedProposalList;