import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons'; // Import comment icon
import { Tooltip } from 'react-tooltip';
import { icons, tooltips } from '../constants/Icons_Tooltips';
import { formatDate } from '../constants/HomeTextConstants';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid library
import {
  fetchProposalData,
  fetchSubmittedVotes,
  submitNewTableEntry,
  deleteTableEntry,
  updateComment,
  updateOpinion,
  updateName,
  checkFirstRender
} from '../api/proposals';
import { useAuthContext } from "../hooks/useAuthContext";

const ProposalVote = () => {
  const { uniqueUrl } = useParams();
  const { user } = useAuthContext();

  const [proposal, setProposal] = useState(null);
  const [submittedVotes, setSubmittedVotes] = useState([]);
  const [newVote, setNewVote] = useState({ name: '', opinion: '', comment: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedProposalLink, setCopiedProposalLink] = useState(false);
  const [copiedEditLink, setCopiedEditLink] = useState(false);
  const [showFirstRenderMessage, setShowFirstRenderMessage] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // Initial check

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { proposal: proposalData } = await fetchProposalData(uniqueUrl);
        setProposal(proposalData);
        const votesData = await fetchSubmittedVotes(proposalData._id);
        setSubmittedVotes(votesData);
        const firstRender = await checkFirstRender(proposalData._id);
        setShowFirstRenderMessage(firstRender);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [uniqueUrl]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setExpandedRows({});
    }
  }, [isDesktop]);

  const copyUrlToClipboard = (urlType, url) => {
    navigator.clipboard.writeText(url);
    if (urlType === 'proposal') {
      setCopiedProposalLink(true);
    } else if (urlType === 'edit') {
      setCopiedEditLink(true);
    }
  };

   // Define the links
   const proposalLink = `${window.location.origin}/${uniqueUrl}`;
   const editLink = user
     ? `${window.location.origin}/edit/${uniqueUrl}`
     : `${window.location.origin}/edit/${uuidv4()}/${uniqueUrl}`; // Generate a new UUIDv4 token for non-authenticated users
 

  const toggleDetails = (voteId) => {
    setExpandedRows((prev) => ({ ...prev, [voteId]: !prev[voteId] }));
  };

  const handleNewVoteChange = (e) => {
    const { name, value } = e.target;
    setNewVote((prevVote) => ({ ...prevVote, [name]: value }));
  };

  const handleOpinionButtonClick = (opinionType) => {
    setNewVote((prevVote) => ({ ...prevVote, opinion: opinionType }));
  };

  const handleDeleteEntry = async (voteId) => {
    try {
      await deleteTableEntry(voteId, setSubmittedVotes, submittedVotes, setError);
    } catch (error) {
      setError('Error deleting entry: ' + error.message);
    }
  };

  const handleOpinionUpdate = async (index, newOpinionValue) => {
    try {
      await updateOpinion(proposal._id, submittedVotes, setSubmittedVotes, index, newOpinionValue);
    } catch (error) {
      setError('Error updating opinion: ' + error.message);
    }
  };

  const handleCommentUpdate = async (index, newComment) => {
    try {
      await updateComment(proposal._id, submittedVotes, setSubmittedVotes, index, newComment);
    } catch (error) {
      setError('Error updating comment: ' + error.message);
    }
  };

  const handleNameUpdate = async (index, newName) => {
    try {
      await updateName(proposal._id, submittedVotes, setSubmittedVotes, index, newName);
    } catch (error) {
      setError('Error updating name: ' + error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.name === 'name') {
      handleNewTableEntry();
    }
  };

  const handleNewTableEntry = async () => {
    try {
      await submitNewTableEntry(proposal._id, newVote, setSubmittedVotes, setNewVote, setError);
      setNewVote({ name: '', opinion: '', comment: '' });
    } catch (error) {
      setError('Error submitting new entry: ' + error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !proposal) {
    return <div>Error: {error || 'No proposal found'}</div>;
  }

  const sanitizedProposal = DOMPurify.sanitize(proposal.description);

  return (
    <section>
     {showFirstRenderMessage && (
     <div className="first-render-message" style={{ marginTop: '20px', fontSize: '14px' }}>
          <p>Welcome! Your Proposal has been created</p>
          <div className="copy-link-container">
            <p>
              Copy this link to send to Respondents:{' '}
              <button className="copy-proposal-button" onClick={() => copyUrlToClipboard('proposal', proposalLink)} style={{ marginLeft: '10px' }}>
                {copiedProposalLink ? 'URL Copied!' : 'Copy Proposal Link'}
              </button>{' '}
              <span className="proposal-link" style={{ fontSize: '12px', marginLeft: '10px' }}>
                <a href={proposalLink} target="_blank" rel="noopener noreferrer">{proposalLink}</a>
              </span>{' '}
              {/* Display the proposal link */}
            </p>
          </div>
          <p style={{ marginTop: '10px' }}>
            Use this link to edit your proposal:{' '}
            <button className="edit-proposal-button" onClick={() => copyUrlToClipboard('edit', editLink)} style={{ marginLeft: '10px' }}>
              {copiedEditLink ? 'URL Copied!' : 'Copy Edit Link'}
            </button>{' '}
            <span className="edit-link" style={{ fontSize: '12px', marginLeft: '10px' }}>
              <a href={editLink} target="_blank" rel="noopener noreferrer">{editLink}</a>
            </span>{' '}
            {/* Display the edit link */}
          </p>
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
            IMPORTANT: Save the edit link for your records! You won't see it again!
          </p>
        </div>

     )}

      <div className="proposal-vote-container">
        <div className="proposal-info">
          <h2>{proposal.title}</h2>
          {proposal.name && <p>Proposed by: {proposal.name}</p>}
          <p>Proposed On: {formatDate(proposal.createdAt)}</p>
          <div className="proposal-description">
            <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
          </div>
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
              <React.Fragment key={vote._id}>
                <tr>
                  {/* Name */}
                  <td className="mobile-name-opinion-row">
                    <div className="name-container">
                      {vote.name ? (
                        <span>{vote.name}</span>
                      ) : (
                        <input
                          type="text"
                          value={vote.localName || ''}
                          onChange={(e) => {
                            const { value } = e.target;
                            setSubmittedVotes((prevVotes) => {
                              const updatedVotes = [...prevVotes];
                              updatedVotes[index].localName = value;
                              return updatedVotes;
                            });
                          }}
                          onBlur={() => {
                            if (vote.localName) {
                              handleNameUpdate(index, vote.localName);
                            }
                          }}
                          placeholder="Name"
                        />
                      )}
                    </div>

                    {/* Opinion Text Label */}
                    <div className="opinion-container">
                      <span className="show-mobile">
                        {vote.opinion && (
                          <span className="opinion-label">
                            <FontAwesomeIcon icon={icons[vote.opinion]} /> {vote.opinion}
                          </span>
                        )}
                      </span>
                    </div>
                    {/* Conditional rendering of the comment icon */}
                    {vote.comment && (
                      <div className="comment-tooltip show-mobile">
                        <FontAwesomeIcon
                          icon={faComment}
                          className="comment-icon"
                          data-tip={vote.comment}
                          data-for={`tooltip-comment-${vote._id}`}
                        />
                        <Tooltip
                          id={`tooltip-comment-${vote._id}`}
                          place="top"
                          effect="solid"
                          className="custom-tooltip"
                        >
                          <span>{vote.comment}</span>
                        </Tooltip>
                      </div>
                    )}
                    <div className="toggle-button-container show-mobile">
                    
                    <button onClick={() => toggleDetails(vote._id)} aria-label="Toggle Details">
                      {expandedRows[vote._id] ? 'Hide Details' : 'Details'}
                    </button>
                  </div>

                  </td>
                  {/* Opinion Buttons */}
                  <td className="hide-mobile">
                    <div className="opinion-buttons">
                      {Object.keys(icons).map((opinionType) => (
                        <div
                          key={opinionType}
                          data-tooltip-id={`${opinionType.toLowerCase()}-tooltip`}
                          data-tooltip-html={tooltips[opinionType]}
                        >
                          <button
                            type="button"
                            className={vote.opinion === opinionType ? 'selected' : ''}
                            onClick={() => handleOpinionUpdate(index, opinionType)}
                            aria-label={`Vote ${opinionType}`}
                          >
                            <FontAwesomeIcon icon={icons[opinionType]} /> {opinionType}
                          </button>
                          <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                        </div>
                      ))}
                    </div>
                    <div className="submitted-votes-date">
                      <small>{formatDate(vote.updatedAt !== vote.createdAt ? vote.updatedAt : vote.createdAt)}</small>
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="hide-mobile">
                    <div className="comment-container">
                      <textarea
                        value={vote.comment}
                        onChange={(e) => handleCommentUpdate(index, e.target.value)}
                        aria-label="Comment"
                      />
                    </div>
                  </td>
                  <td className="hide-mobile">
                    <button onClick={() => handleDeleteEntry(vote._id)} aria-label="Delete Entry">
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Expanded Mobile Details */}
                {expandedRows[vote._id] && (
                  <tr className="details-row show-mobile">
                    <td colSpan="5">
                      <div className="expanded-details">
                        <div className="submitted-votes-date show-mobile">
                          <small>{formatDate(vote.updatedAt !== vote.createdAt ? vote.updatedAt : vote.createdAt)}</small>
                        </div>
                        <div className="opinion-buttons">
                          {Object.keys(icons).map((opinionType) => (
                            <div
                              key={opinionType}
                              data-tooltip-id={`${opinionType.toLowerCase()}-tooltip`}
                              data-tooltip-html={tooltips[opinionType]}
                            >
                              <button
                                type="button"
                                className={vote.opinion === opinionType ? 'selected' : ''}
                                onClick={() => handleOpinionUpdate(index, opinionType)}
                                aria-label={`Vote ${opinionType}`}
                              >
                                <FontAwesomeIcon icon={icons[opinionType]} /> {opinionType}
                              </button>
                              <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                            </div>
                          ))}
                        </div>
                        <div className="comment-container">
                          <textarea
                            value={vote.comment}
                            onChange={(e) => handleCommentUpdate(index, e.target.value)}
                            aria-label="Comment"
                          />
                          <button onClick={() => handleDeleteEntry(vote._id)} aria-label="Delete Entry">
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            <tr className="new-entry-title-row show-mobile">
                <td colSpan="1" className="new-entry-title">
                  Submit New Entry 
                </td>
              </tr>

            <tr className="submit-section">
              <td>
                <input
                  type="text"
                  name="name"
                  value={newVote.name}
                  onChange={handleNewVoteChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Name"
                  aria-label="Name"
                />
              </td>
              <td>
                <div className="opinion-buttons">
                  {Object.keys(icons).map((opinionType) => (
                    <div
                      key={opinionType}
                      data-tooltip-id={`${opinionType.toLowerCase()}-tooltip`}
                      data-tooltip-html={tooltips[opinionType]}
                    >
                      <button
                        type="button"
                        className={newVote.opinion === opinionType ? 'selected' : ''}
                        onClick={() => handleOpinionButtonClick(opinionType)}
                        aria-label={`Vote ${opinionType}`}
                      >
                        <FontAwesomeIcon icon={icons[opinionType]} /> {opinionType}
                      </button>
                      <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
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
                  placeholder="Comment"
                  aria-label="Comment"
                />
              </td>
              <td>
                <button onClick={handleNewTableEntry} aria-label="Submit New Entry">
                  Submit
                </button>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProposalVote;