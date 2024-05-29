import React, { useState, useEffect, useCallback } from 'react';
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
  updateVote,
  updateName
} from '../api/proposals';

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
        const { proposal: proposalData } = await fetchProposalData(uniqueUrl);
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

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleNewTableEntry();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newVote]);

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

  const handleNameUpdate = useCallback(async (index, newName) => {
    try {
      await updateName(proposal._id, submittedVotes, setSubmittedVotes, index, newName);
    } catch (error) {
      setError('Error updating name: ' + error.message);
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
        <div className="proposal-description">
          <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
        </div>
      </div>
      <div className="copy-link-container">
        <button className="copy-link" onClick={copyUrlToClipboard}>
          {copied ? "URL Copied!" : "Copy Proposal Link"}
        </button>
      </div>

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
              <tr key={vote._id}>
              <td>
                <input
                  type="text"
                  value={vote.name}
                  onChange={(e) => handleNameUpdate(index, e.target.value)}
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
                          className={submittedVotes[index].vote === voteType ? 'selected' : ''}
                          onClick={() => handleVoteUpdate(index, voteType)}
                          aria-label={`Vote ${voteType}`}
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
                    value={vote.comment}
                    onChange={(e) => handleCommentUpdate(index, e.target.value)}
                    aria-label="Comment"
                  />
                </td>
                <td>
                  <button onClick={() => handleDeleteEntry(vote._id)} aria-label="Delete Entry">Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <input
                  type="text"
                  name="name"
                  value={newVote.name}
                  onChange={(e) => setNewVote({ ...newVote, name: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Name"
                  aria-label="Name"
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
                        aria-label={`Vote ${voteType}`}
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
                  name="comment"
                  value={newVote.comment}
                  onChange={handleNewVoteChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Explain your vote..."
                  aria-label="Comment"
                />
              </td>
              <td>
                <button onClick={handleNewTableEntry} aria-label="Submit Entry">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalVote;

