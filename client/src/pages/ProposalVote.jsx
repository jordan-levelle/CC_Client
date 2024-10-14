import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VoteCard, VoteSubmitCard, DescriptionCard, Notification } from '../components';
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTeamsContext } from '../context/TeamsContext';
import { fetchProposalData, fetchSubmittedVotes, submitNewTableEntry, checkFirstRender } from '../api/proposals';
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
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');

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
            const memberVote = { name: member.memberName, opinion: '', comment: '' };
            return submitNewTableEntry(proposal._id, memberVote, setSubmittedVotes);
          });

          // Await all promises
          await Promise.all(votePromises);

          // Fetch updated votes after submission
          const updatedVotes = await fetchSubmittedVotes(proposal._id);
          setSubmittedVotes(updatedVotes);
          setTeamVotesSubmitted(true); // Mark as submitted
          setNotificationMessage('Team votes submitted successfully!'); // Set success notification message
          setNotificationType('success'); // Set notification type to success
        } catch (error) {
          console.error('Error submitting team votes:', error);
          setNotificationMessage('Failed to submit team votes.'); // Set error message
          setNotificationType('error'); // Set notification type to error
        } finally {
          setLoading(false);
        }
      }
    };

    submitTeamVotes();
  }, [proposal, selectedTeam, teamVotesSubmitted]);

  // Call clearSelectedTeam after team votes are submitted
  useEffect(() => {
    if (teamVotesSubmitted) {
      clearSelectedTeam(); // Clear selected team
    }
  }, [teamVotesSubmitted, clearSelectedTeam]);

  const handleNewTableEntry = async (newVote) => {
    try {
      const response = await submitNewTableEntry(proposal._id, newVote, setSubmittedVotes);
    
      // Check if the response indicates limit reached
      if (response && response.limitReached) {
        setNotificationMessage('Limit of 15 votes reached. Upgrade subscription for unlimited votes.'); // Set error message
        setNotificationType('error'); // Set notification type to error
      } else {
        setNotificationMessage('Vote submitted successfully!'); // Set success notification message
        setNotificationType('success'); // Set notification type to success
      }
    } catch (error) {
      console.error('Error submitting new entry:', error);
      setNotificationMessage('An error occurred while submitting your vote. Please try again.'); // Set error message
      setNotificationType('error'); // Set notification type to error
    }
  };

  return (
    <div className="proposal-vote-page-container">
      <Notification message={notificationMessage} type={notificationType} /> {/* Pass the notification message and type */}
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
