import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VoteCard, VoteSubmitCard, DescriptionCard } from '../components';
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTeamsContext } from '../context/TeamsContext';
import { showSuccessToast, showErrorToast } from 'src/utils/toastNotifications';
import { fetchProposalData, fetchSubmittedVotes, submitNewTableEntry, checkFirstRender } from '../api/proposals';
import '../styles/pages/proposalvote.css';

const ProposalVote = () => {
  const { dispatch } = useProposalsContext();
  const { user, isSubscribed } = useAuthContext();
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
  }, [uniqueUrl, user]);

  useEffect(() => {
    const submitTeamVotes = async () => {
      if (selectedTeam && proposal && !teamVotesSubmitted) {
        try {
          const votePromises = selectedTeam.members.map((member) => {
            const memberVote = { 
              name: member.memberName, 
              opinion: '', 
              comment: '', 
              teamId: selectedTeam._id // Add teamId here
            };
            return submitNewTableEntry(proposal._id, memberVote, setSubmittedVotes);
          });

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
  }, [proposal, selectedTeam, setSubmittedVotes, teamVotesSubmitted]);
  


  useEffect(() => {
    if (teamVotesSubmitted) {
      clearSelectedTeam(); // Clear selected team
    }
  }, [teamVotesSubmitted, clearSelectedTeam]);


  const handleNewTableEntry = async (voteData, isOwner) => {
    try {
      const response = await submitNewTableEntry(proposal._id, voteData, setSubmittedVotes, uniqueUrl);
  
      if (response && response.limitReached) {
        showErrorToast('voteLimitError');
        return; // Exit early on limit error
      }
  
      showSuccessToast('voteSuccess');
  
      // Fetch all votes after a successful vote submission
      const updatedVotes = await fetchSubmittedVotes(proposal._id);
      setSubmittedVotes(updatedVotes);  // Update the state with the latest votes from the server
    } catch (error) {
      console.error('Error submitting new entry:', error);
      showErrorToast('voteError');
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
            isSubscribed={isSubscribed}
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


