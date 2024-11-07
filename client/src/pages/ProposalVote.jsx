import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VoteCard, VoteSubmitCard, DescriptionCard } from '../components';
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTeamsContext } from '../context/TeamsContext';
import { showSuccessToast, showErrorToast } from 'src/utils/toastNotifications';
import { fetchProposalData, fetchSubmittedVotes, submitNewTableEntry, checkFirstRender } from '../api/proposals';
import { setParticipatedProposal } from 'src/api/users';
// import { connectToProposalRoom, disconnectFromProposalRoom } from 'src/utils/socket';
import '../styles/pages/proposalvote.css';

const ProposalVote = () => {
  const { dispatch } = useProposalsContext();
  const { user } = useAuthContext();
  const { uniqueUrl } = useParams();
  const { selectedTeam, clearSelectedTeam } = useTeamsContext();

  const [proposal, setProposal] = useState(null);
  const [submittedVotes, setSubmittedVotes] = useState([]);
  const [teamVotesSubmitted, setTeamVotesSubmitted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showFirstRenderMessage, setShowFirstRenderMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const handleProposalUpdate = (updatedProposal) => {
    setProposal(updatedProposal); 
  };

  useEffect(() => {
    const getProposalData = async () => {
      setLoading(true);
      try {
        const token = user?.token || null; // Safely access the token
        const { proposal, isOwner } = await fetchProposalData(uniqueUrl, token); // Pass the token
        if (!proposal || !proposal._id) {
          throw new Error('Invalid response structure');
        }
        setProposal(proposal);
        setIsOwner(isOwner);
  
        const votes = await fetchSubmittedVotes(proposal._id);
        setSubmittedVotes(votes);
  
        const firstRender = await checkFirstRender(proposal._id);
        setShowFirstRenderMessage(firstRender);
      } catch (error) {
        console.error('Error fetching proposal data:', error);
      } finally {
        setLoading(false);
      }
    };
    getProposalData();
    // Cleanup socket connection on unmount
    // return () => {
    //   disconnectFromProposalRoom();
    // };
  }, [uniqueUrl, user]);

  // useEffect(() => {
  //   if (uniqueUrl) {
  //     connectToProposalRoom(uniqueUrl, (newVote) => {
  //       setSubmittedVotes((prevVotes) => [...prevVotes, newVote]);
  //     });
  //   }
  // }, [uniqueUrl]);

  useEffect(() => {
    const submitTeamVotes = async () => {
      if (selectedTeam && proposal && !teamVotesSubmitted) {
        try {
          const votePromises = selectedTeam.members.map((member) => {
            const memberVote = { name: member.memberName, opinion: '', comment: '' };
            return submitNewTableEntry(proposal._id, memberVote, setSubmittedVotes);
          });

          // Await all promises
          await Promise.all(votePromises);

          // Fetch updated votes after submission
          const updatedVotes = await fetchSubmittedVotes(proposal._id);
          setSubmittedVotes(updatedVotes);
          setTeamVotesSubmitted(true); // Mark as submitted
          showSuccessToast('teamVoteSuccess'); // Call the toast function with a message key
        } catch (error) {
          console.error('Error submitting team votes:', error);
          showErrorToast('teamVoteError'); 
        } finally {
          setLoading(false);
        }
      }
    };

    submitTeamVotes();
  }, [proposal, selectedTeam, teamVotesSubmitted]);

  useEffect(() => {
    if (teamVotesSubmitted) {
      clearSelectedTeam(); // Clear selected team
    }
  }, [teamVotesSubmitted, clearSelectedTeam]);

  const handleNewTableEntry = async (newVote, isOwner) => {
    try {
      const response = await submitNewTableEntry(proposal._id, newVote, setSubmittedVotes, uniqueUrl);
  
      if (response && response.limitReached) {
        showErrorToast('voteLimitError'); // Show limit error toast
      } else {
        showSuccessToast('voteSuccess'); // Show success toast
        
        if (user && !isOwner) {
          try {
            const participationResponse = await setParticipatedProposal(proposal._id, response.addedVote._id, user.token);
            if (participationResponse && participationResponse.success) {
            } else {
              console.error('Failed to update participated proposal:', participationResponse.message);
            }
          } catch (error) {
            console.error('Error calling setParticipatedProposal API:', error);
            showErrorToast('participationError'); // Show participation error toast
          }
        }
        const votes = await fetchSubmittedVotes(proposal._id);
        setSubmittedVotes(votes); 
      }
    } catch (error) {
      console.error('Error submitting new entry:', error);
      showErrorToast('voteError'); // Show error toast for vote submission
    }
  };

  return (
    <div className="proposal-vote-page-container">
      {loading ? (
        <div>Loading...</div>
      ) : proposal ? (
        <>
          <DescriptionCard
            proposal={proposal}
            user={user}
            dispatch={dispatch}
            uniqueUrl={uniqueUrl}
            submittedVotes={submittedVotes}
            setSubmittedVotes={setSubmittedVotes}
            showFirstRenderMessage={showFirstRenderMessage}
            onUpdateProposal={handleProposalUpdate}
            isOwner={isOwner} 
          />
          <VoteSubmitCard 
            proposal={proposal} 
            setSubmittedVotes={setSubmittedVotes} 
            handleNewTableEntry={handleNewTableEntry}
          />
          <VoteCard 
            proposal={proposal} 
            submittedVotes={submittedVotes} 
            setSubmittedVotes={setSubmittedVotes} 
          />
        </>
      ) : (
        <div>No proposal selected</div>
      )}
    </div>
  );
};

export default ProposalVote;
