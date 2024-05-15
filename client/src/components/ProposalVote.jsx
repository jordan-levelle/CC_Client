/* Comments */
/* 

*/
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips } from '../constants/Icons_Tooltips';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proposalData = await fetchProposalData(uniqueUrl);
        setProposal(proposalData);

        const votesData = await fetchSubmittedVotes(proposalData._id);
        setSubmittedVotes(votesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [uniqueUrl]);

  const handleNewTableEntry = async () => {
    try {
      await submitNewTableEntry(proposal._id, newVote, setSubmittedVotes, setNewVote, setError);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteEntry = async (voteId) => {
    try {
      await deleteTableEntry(voteId, setSubmittedVotes, submittedVotes, setError);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleVoteUpdate = async (index, newVoteValue) => {
    try {
      await updateVote(proposal._id, submittedVotes, setSubmittedVotes, index, newVoteValue);
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleCommentUpdate = async (index, newComment) => {
    try {
      await updateComment(proposal._id, submittedVotes, setSubmittedVotes, index, newComment);
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleNewVoteChange = (e) => { 
    const { name, value } = e.target;
    setNewVote(prevVote => ({
      ...prevVote,
      [name]: value
    }));
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !proposal) {
    return <div>Error: {error || 'No proposal found'}</div>;
  }

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const sanitizedProposal = DOMPurify.sanitize(proposal.description);

  return (
    <div className="proposal-vote-container">
      <div className="proposal-info">
        <h2>{proposal.title}</h2>
        {proposal.name && <p>Proposed by: {proposal.name}</p>}
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
                      <div key={voteType}>
                        <button
                          type="button"
                          className={submittedVotes[index].vote === voteType ? 'selected' : ''}
                          onClick={() => handleVoteUpdate(index, voteType)}
                        >
                          <FontAwesomeIcon icon={icons[voteType]} /> {' '}{voteType}
                          
                        </button>
                        <Tooltip id={`${voteType.toLowerCase()}-tooltip`} />
                        </div>
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
                <button onClick={handleNewTableEntry}>Save</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalVote;





