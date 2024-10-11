import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips, formatDate } from '../constants/Constants';
import { faCommentDots, faTrashCan, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'; 
import exampleProposalData from '../constants/ExampleProposal.json';
import {
  handleExistingOpinionUpdate,
  handleExistingCommentUpdate,
  handleExistingSubmissionDelete,
  handleNewSubmission,
  handleNewTableEntry,
} from '../utils/proposalUtils';
import '../styles/components/proposalvotedescriptioncard.css';
import '../styles/components/proposalvotesubmitcard.css';
import '../styles/pages/proposalvote.css';

const ExampleProposal = () => {
  const [exampleProposal, setExampleProposal] = useState(exampleProposalData);
  const [newVote, setNewVote] = useState({ name: '', opinion: '', comment: '' });
  const [expandedRows, setExpandedRows] = useState({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

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

  const updateOpinion = (index, newVoteValue) => {
    handleExistingOpinionUpdate(index, newVoteValue, exampleProposal, setExampleProposal);
  };

  const updateComment = (index, newComment) => {
    handleExistingCommentUpdate(index, newComment, exampleProposal, setExampleProposal);
  };

  const deleteSubmission = (index) => {
    handleExistingSubmissionDelete(index, exampleProposal, setExampleProposal);
  };

  const newTableEntry = (e) => {
    handleNewTableEntry(e, newVote, setNewVote);
  };

  const newSubmission = () => {
    handleNewSubmission(exampleProposal, newVote, setExampleProposal, setNewVote);
  };

  const toggleDetails = (voteId) => {
    setExpandedRows((prev) => ({ ...prev, [voteId]: !prev[voteId] }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.name === 'name') {
      newSubmission();
    }
  };

  const sanitizedProposal = DOMPurify.sanitize(exampleProposal.description);
  const formattedDate = formatDate(new Date(exampleProposal.createdAt), 'MMMM d, yyyy');

  return (
    <div>
      <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
        <strong>This is an example proposal. Nothing you do here will be saved.</strong>
      </div>
      <div className='proposal-vote-page-container'>
        {/* Ex. Proposal Description */}
        <div className="description-card">
          <div className="proposal-header">
            <h3>{exampleProposal.title}</h3>
          </div>
          {exampleProposal.name && <p>Proposed by: {exampleProposal.name}</p>}
          <p>Proposed On: {formattedDate}</p>
          <div className="proposal-description">
            <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
          </div>
        </div>

        {/* Ex. Proposal Submit Card */}
        <div className='vote-submit-card'>
          <div className='vote-submit-items'>
            <div className='name-and-details'>
              <label htmlFor='name' className='input-label'>Name:</label>
              <input
                id='name'
                type="text"
                name="name"
                placeholder="Name"
                value={newVote.name}
                onChange={newTableEntry}
                onKeyDown={handleKeyDown}
                aria-label="Name"
                className='name-input'
              />
            </div>

            <div className='opinion-submit-container'>
              <label htmlFor='opinion' className='input-label'>Opinion:</label>
              <div className="opinion-submit-buttons">
                {Object.keys(icons).map((opinionType) => (
                  <div
                    key={opinionType}
                    data-tooltip-id={`${opinionType.toLowerCase()}-tooltip`}
                    data-tooltip-html={tooltips[opinionType]}
                  >
                    <button
                      type="button"
                      aria-label={`Vote ${opinionType}`}
                      className={newVote.opinion === opinionType ? 'selected' : ''}
                      onClick={() => setNewVote((prev) => ({ ...prev, opinion: opinionType }))}
                    >
                      <FontAwesomeIcon icon={icons[opinionType]} /> <span>{opinionType}</span>
                    </button>
                    <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                  </div>
                ))}
              </div>
            </div>

            <div className='comment-submit-container'>
              <label htmlFor='comment' className='input-label'>Comment:</label>
              <textarea
                name="comment"
                value={newVote.comment}
                onChange={newTableEntry}
                className="comment-input"
                placeholder="Explain your vote (optional)..."
                aria-label="Comment"
              />
            </div>

            <div className='action-submit-container'>
              <button
                aria-label="Submit New Entry"
                className="small-button"
                onClick={newSubmission}
                disabled={!newVote.name || !newVote.opinion}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Ex. Proposal Vote Card */}
        <div className='vote-card'>
          {exampleProposal.votes.length > 0 &&
            exampleProposal.votes.map((vote, index) => (
              <div key={index} className={`vote-items ${expandedRows[vote.name] ? 'details-visible' : ''}`}>
                <div className="name-and-details">
                  <span className='name-span'>{vote.name}</span>
                </div>
                <div className='mobile-details-container'>
                  {vote.opinion && (
                    <span className="opinion-label">
                      <FontAwesomeIcon icon={icons[vote.opinion]} /> {vote.opinion}
                    </span>
                  )}
                  {vote.comment ? (
                    <FontAwesomeIcon
                      icon={faCommentDots}
                      data-tip={vote.comment}
                      data-for={`comment-tooltip-${vote.comment}`}
                    />
                  ) : (
                    <div className="comment-icon-placeholder"></div>
                  )}
                  <span
                    onClick={() => toggleDetails(vote.name)}
                    aria-label="Toggle Details"
                    className="toggle-details-icon"
                  >
                    <FontAwesomeIcon
                      icon={expandedRows[vote.name] ? faArrowUp : faArrowDown}
                    />
                  </span>
                </div>

                <div className='opinion-container'>
                  <div className='opinion-buttons'>
                    {Object.keys(icons).map((opinionType) => (
                      <div key={opinionType} data-tooltip-id={`${opinionType.toLowerCase()}-tooltip`} data-tooltip-html={tooltips[opinionType]}>
                        <button
                          type="button"
                          className={vote.opinion === opinionType ? 'selected' : ''}
                          onClick={() => updateOpinion(index, opinionType)}
                          aria-label={`Vote ${opinionType}`}
                        >
                          <FontAwesomeIcon icon={icons[opinionType]} /> <span>{opinionType}</span>
                        </button>
                        <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                      </div>
                    ))}
                  </div>
                  <small className='vote-date'>
                    {formatDate(new Date(vote.updatedAt !== vote.createdAt ? vote.updatedAt : vote.createdAt))}
                  </small>
                </div>

                <div className='comment-container'>
                  <textarea
                    className="comment-input"
                    value={vote.comment} 
                    onChange={(e) => updateComment(index, e.target.value)} 
                  />
                </div>

                <div className='action-container'>
                  <span
                    aria-label="Delete Entry"
                    className='delete-icon'
                    onClick={() => deleteSubmission(index)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ExampleProposal;



