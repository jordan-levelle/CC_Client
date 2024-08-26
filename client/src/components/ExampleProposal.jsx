import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips } from '../constants/Icons_Tooltips';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import exampleProposalData from '../constants/ExampleProposal.json'
import {
  handleExistingOpinionUpdate,
  handleExistingCommentUpdate,
  handleExistingSubmissionDelete,
  handleNewSubmission,
  handleNewTableEntry,
  formatDate
} from '../api/proposals';

const ExampleProposal = () => {
  const [exampleProposal, setExampleProposal] = useState(exampleProposalData);
  const [newVote, setNewVote] = useState({ name: '', opinion: '', comment: '' });
  const [expandedRows, setExpandedRows] = useState({}); // State to track expanded rows
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // Initial check


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

  if (!exampleProposal) {
    return <div>No example proposal found.</div>;
  }

  const sanitizedProposal = DOMPurify.sanitize(exampleProposal.description);

  return (
    <section>
      <div className='example-alert alert-block'>
        <p>
          <strong>Note:</strong> This is an example proposal. Nothing you change will be saved.
        </p>
      </div>
      <div className="proposal-vote-container">
        <div className="proposal-info">
          <h2>{exampleProposal.title}</h2>
          <p>Proposed by: {exampleProposal.name}</p>
          <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
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
            <tr className="new-entry-title-row show-mobile">
                <td colSpan="1" className="new-entry-title">
                  Submit New Entry 
                </td>
              </tr>
              <tr className="submit-section">
                <td>
                  <input
                    id='name'
                    type="text"
                    name="name"
                    value={newVote.name}
                    onChange={newTableEntry}
                    onKeyDown={handleKeyDown}
                    placeholder="Name"
                    aria-label='Name'
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
                          id='opinion'
                          type="button"
                          className={newVote.opinion === opinionType ? 'selected' : ''}
                          onClick={() => setNewVote({ ...newVote, opinion: opinionType })}
                          data-tip={tooltips[opinionType]} // Add data-tip attribute
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
                    id='comment'
                    type="text"
                    name="comment"
                    value={newVote.comment}
                    onChange={newTableEntry}
                    onKeyDown={handleKeyDown}
                    placeholder="Comment"
                    aria-label='Comment'
                  />
                </td>
                <td>
                  <button onClick={newSubmission} aria-label='Submit'>Submit</button>
                </td>
              </tr>
              {exampleProposal.votes.map((vote, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="mobile-name-opinion-row">
                      <div className="name-container">
                        {vote.name ? (
                          <span>{vote.name}</span>
                        ): (
                          <input 
                            type='text'
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
                        <div className='comment-tooltip show-mobile'>
                          <FontAwesomeIcon
                            icon={faCommentDots}
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
                      <div className="toggle-button show-mobile">
                        <button onClick={() => toggleDetails(index)} aria-label="Toggle Details">
                          {expandedRows[index] ? 'Hide Details' : 'Details'}
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
                              onClick={() => updateOpinion(index, opinionType)}
                              data-tip={tooltips[opinionType]} // Add data-tip attribute
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
                      <textarea
                        type="text"
                        value={vote.comment}
                        onChange={(e) => updateComment(index, e.target.value)}
                        placeholder='Explain your vote...'
                      />
                    </td>
                    <td className="hide-mobile">
                      <button onClick={() => deleteSubmission(index)}>Delete</button>
                    </td>
                  </tr>
                  {expandedRows[index] && (
                    <tr className="details-row show-mobile">
                      <td colSpan="4">
                        <div className="expanded-details">
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
                                  onClick={() => updateOpinion(index, opinionType)}
                                  data-tip={tooltips[opinionType]} // Add data-tip attribute
                                >
                                  <FontAwesomeIcon icon={icons[opinionType]} /> {opinionType}
                                </button>
                                <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                              </div>
                            ))}
                          </div>
                          <textarea
                            type="text"
                            value={vote.comment}
                            onChange={(e) => updateComment(index, e.target.value)}
                            placeholder='Explain your vote...'
                          />
                          <button onClick={() => deleteSubmission(index)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ExampleProposal;

