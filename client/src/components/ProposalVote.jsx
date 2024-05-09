/* 4/30 Refactored
   Beta Ready
*/

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faBan, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';

const ProposalVote = () => {
  const { uniqueUrl } = useParams();
  const [proposal, setProposal] = useState(null);
  const [submittedVotes, setSubmittedVotes] = useState([]);
  const [newVote, setNewVote] = useState({ name: '', vote: '', comment: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proposalResponse = await fetch(`/api/proposals/${uniqueUrl}`);
        if (!proposalResponse.ok) {
          throw new Error('Failed to fetch proposal');
        }
        const proposalData = await proposalResponse.json();
        setProposal(proposalData);

        const votesResponse = await fetch(`/api/proposals/${proposalData._id}/votes`);
        if (!votesResponse.ok) {
          throw new Error('Failed to fetch submitted votes');
        }
        const votesData = await votesResponse.json();
        setSubmittedVotes(votesData.votes);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [uniqueUrl]);

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const handleNewVoteChange = (e) => {
    const { name, value } = e.target;
    setNewVote(prevVote => ({
      ...prevVote,
      [name]: value
    }));
  };

  const submitNewVote = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposal._id}/vote`, {
        method: 'POST',
        body: JSON.stringify(newVote),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error submitting vote');
      }

      const votesResponse = await fetch(`/api/proposals/${proposal._id}/votes`);
      if (!votesResponse.ok) {
        throw new Error('Failed to fetch submitted votes');
      }
      const votesData = await votesResponse.json();
      setSubmittedVotes(votesData.votes);

      setNewVote({ name: '', vote: '', comment: '' });
    } catch (error) {
      setError(error.message);
      console.error('Error submitting vote:', error);
    }
  };

  const handleVoteUpdate = async (index, newVoteValue) => {
    const updatedVotes = [...submittedVotes];
    updatedVotes[index].vote = newVoteValue;
    setSubmittedVotes(updatedVotes);
    saveVote(updatedVotes[index]);
  };

  const handleCommentUpdate = async (index, newComment) => {
    const updatedVotes = [...submittedVotes];
    updatedVotes[index].comment = newComment;
    setSubmittedVotes(updatedVotes);
    saveVote(updatedVotes[index]);
  };

  const saveVote = async (vote) => {
    try {
      const response = await fetch(`/api/proposals/${proposal._id}/vote`, {
        method: 'PUT',
        body: JSON.stringify(vote),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error updating vote');
      }

      const responseData = await response.json();
      console.log('Vote updated successfully:', responseData);
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  const handleDeleteVote = async (voteId) => {
    try {
      const response = await fetch(`/api/proposals/votes/${voteId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error deleting vote: ${errorMessage}`);
      }
  
      const updatedVotes = submittedVotes.filter(vote => vote._id !== voteId);
      setSubmittedVotes(updatedVotes);
    } catch (error) {
      setError(error.message);
      console.error('Error deleting vote:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !proposal) {
    return <div>Error: {error || 'No proposal found'}</div>;
  }

  const sanitizedProposal = DOMPurify.sanitize(proposal.description);

  const icons = {
    Agree: faThumbsUp,
    Disagree: faThumbsDown,
    Neutral: faHandPointRight,
    Block: faBan
  };

  const tooltips = {
    Agree: '<div><h3>Agree</h3><p>Basic alignment with the proposal</p></div>',
    Disagree: '<div><h3>Stand Aside</h3><p>A choice to let the proposal proceed,<br/>while personally not feeling aligned with direction.</p></div>',
    Neutral: '<div><h3>Neutral</h3><p>Not having an opinion either way and agreeing<br/>to go along with the group\'s decision.</p></div>',
    Block: '<div><h3>Block</h3><p>Proposal is disastrous for the group or<br/>doesn\'t align with the group\'s core principles.</p></div>'
  };

  return (
    <div className="proposal-vote-container">
      <div className="proposal-info">
        <h2>{proposal.title}</h2>
        <p>Proposed by: {proposal.name}</p>
        <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
      </div>

      {proposal && (
          <button onClick={copyUrlToClipboard}>
            {copied ? "URL Copied!" : "Copy Proposal Link"}
          </button>
        )}

      <div className="submitted-votes-container">
        <table className="votes-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Vote</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {submittedVotes.map((vote, index) => (
              <tr key={index}>
                <td>{vote.name}</td>
                <td>
                  <div className="vote-buttons">
                    {Object.keys(icons).map((voteType) => (
                      <div key={voteType}>
                        <button
                          type="button"
                          className={submittedVotes[index].vote === voteType ? 'selected' : ''}
                          onClick={() => handleVoteUpdate(index, voteType)}
                        >
                          <FontAwesomeIcon icon={icons[voteType]} /> {' '}{voteType}
                        </button>
               
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <textarea
                    type="text"
                    value={vote.comment}
                    onChange={(e) => handleCommentUpdate(index, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleDeleteVote(vote._id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <input
                  type="text"
                  name="name"
                  value={newVote.name}
                  onChange={handleNewVoteChange}
                />
              </td>
              <td>
                <div className="vote-buttons">
                  {Object.keys(icons).map((voteType) => (
                    <div key={voteType} data-tooltip-id={`${voteType.toLowerCase()}-tooltip`}
                      data-tooltip-html={tooltips[voteType]}>
                      <button
                        type="button"
                        className={newVote.vote === voteType ? 'selected' : ''}
                        onClick={() => setNewVote({ ...newVote, vote: voteType })}
                      >
                        <FontAwesomeIcon icon={icons[voteType]} /> {' '}{voteType}
                      </button>
                      <Tooltip id={`${voteType.toLowerCase()}-tooltip`} />
                    </div>
                  ))}
                </div>
              </td>
              <td>
                <textarea
                  type="text"
                  name="comment"
                  value={newVote.comment}
                  onChange={handleNewVoteChange}
                />
              </td>
              <td>
                <button onClick={submitNewVote}>Save</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalVote;




