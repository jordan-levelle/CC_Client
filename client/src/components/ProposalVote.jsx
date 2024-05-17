import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips } from '../constants/Icons_Tooltips';
import { formatDate } from '../constants/HomeTextConstants';
import {
  fetchProposalData,
  fetchSubmittedVotes,
  submitNewTableEntry,
  deleteTableEntry,
  updateComment,
  updateVote
} from '../api/proposals';

const ProposalVote = () => {
  const { uniqueUrl } = useParams();
  const [proposal, setProposal] = useState(null);
  const [submittedVotes, setSubmittedVotes] = useState([]);
  const [newVote, setNewVote] = useState({ name: '', vote: '', comment: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proposalData = await fetchProposalData(uniqueUrl);
        setProposal(proposalData);
        const votesData = await fetchSubmittedVotes(proposalData._id);
        setSubmittedVotes(votesData);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [uniqueUrl]);

  useLayoutEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [newVote.name]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNewTableEntry();
    }
  };

  const handleNewVoteChange = (e) => {
    const { name, value } = e.target;
    setNewVote(prevVote => ({
      ...prevVote,
      [name]: value
    }));
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const handleNewVoteButtonClick = (voteType) => {
    setNewVote(prevVote => ({
      ...prevVote,
      vote: voteType
    }));
  };

  useEffect(() => {
    if (newVote.vote) {
      handleNewTableEntry();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newVote.vote]);

  const handleNewTableEntry = async () => {
    try {
      await submitNewTableEntry(proposal._id, newVote, setSubmittedVotes, setNewVote, setError);
      setNewVote({ name: '', vote: '', comment: '' });
    } catch (error) {
      setError('Error submitting new entry: ' + error.message);
    }
  };

  const handleDeleteEntry = useCallback(async (voteId) => {
    try {
      await deleteTableEntry(voteId, setSubmittedVotes, submittedVotes, setError);
    } catch (error) {
      setError('Error deleting entry: ' + error.message);
    }
  }, [submittedVotes]);

  const handleVoteUpdate = useCallback(async (index, newVoteValue) => {
    try {
      await updateVote(proposal._id, submittedVotes, setSubmittedVotes, index, newVoteValue);
    } catch (error) {
      setError('Error updating vote: ' + error.message);
    }
  }, [proposal, submittedVotes]);

  const handleCommentUpdate = useCallback(async (index, newComment) => {
    try {
      await updateComment(proposal._id, submittedVotes, setSubmittedVotes, index, newComment);
    } catch (error) {
      setError('Error updating comment: ' + error.message);
    }
  }, [proposal, submittedVotes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !proposal) {
    return <div>Error: {error || 'No proposal found'}</div>;
  }

  const sanitizedProposal = DOMPurify.sanitize(proposal.description);

  return (
    <div className="proposal-vote-container">
      <div className="proposal-info">
        <h2>{proposal.title}</h2>
        {proposal.name && <p>Proposed by: {proposal.name}</p>}
        <p>Proposed On: {formatDate(proposal.createdAt)}</p>
        <div className='proposal-description'>
          <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
        </div>
      </div>

      {proposal && (
        <button className='copy-link' onClick={copyUrlToClipboard}>
          {copied ? "URL Copied!" : "Copy Proposal Link"}
        </button>
      )}

      <div className="submitted-votes-container">
        <table className="votes-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Opinion</th>
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
                      <div key={voteType} data-tooltip-id={`${voteType.toLowerCase()}-tooltip`}
                        data-tooltip-html={tooltips[voteType]}>
                        <button
                          type="button"
                          className={submittedVotes[index].vote === voteType ? 'selected' : ''}
                          onClick={() => handleVoteUpdate(index, voteType)}
                        >
                          <FontAwesomeIcon icon={icons[voteType]} /> {' '}{voteType}
                        </button>
                        <Tooltip id={`${voteType.toLowerCase()}-tooltip`} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <small>{formatDate(vote.createdAt)}</small>
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
                  <button onClick={() => handleDeleteEntry(vote._id)}>Delete</button>
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
                  onKeyDown={handleKeyDown}
                  ref={nameInputRef}
                  placeholder="Name"
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
                        onClick={() => handleNewVoteButtonClick(voteType)}
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
                  onKeyDown={handleKeyDown}
                  placeholder="Explain your vote..."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalVote;






