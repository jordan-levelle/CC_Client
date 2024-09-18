import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips } from '../constants/Constants';
import { faCommentDots, faTrashCan, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'; 
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
      <div className="main-container">
        <div className="proposal-info">
          <h3>{exampleProposal.title}</h3>
          <p>Proposed by: {exampleProposal.name}</p>
          <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <h9>Name</h9>
                </th>
                <th>
                  <h9>Opinion</h9>
                </th>
                <th>
                  <h9>Comment</h9>
                </th>
              </tr>
            </thead>
            <tbody>
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
                    className='name-input'
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
                          data-tip={tooltips[opinionType]} 
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
                    className="comment-input"
                  />
                </td>
                <td>
                  <button 
                    onClick={newSubmission} 
                    aria-label='Submit'
                    className="small-button">Submit</button>
                </td>
              </tr>
              {exampleProposal.votes.map((vote, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="info-container">
                      <div className="name-container">
                        {vote.name ? (
                          <span>{vote.name}</span>
                        ): (
                          <input
                            className='name-input' 
                            type='text'
                          />
                        )}
                      </div>
                      {/* Opinion Text Label */}
                      <div className="details-container">
                        <span className="opinion-label-container show-mobile">
                          {vote.opinion && (
                            <span className="opinion-label">
                              <FontAwesomeIcon icon={icons[vote.opinion]} /> {vote.opinion}
                            </span>
                          )}
                        </span>
                      
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
                            id={`comment-tooltip-${vote._id}`}
                            place="top"
                            effect="solid"
                            className="tooltip"
                          >
                          <span>{vote.comment}</span>
                        </Tooltip>
                        </div>
                      )}
                      <div className="show-mobile">
                      <span 
                        onClick={() => toggleDetails(index)} 
                        aria-label="Toggle Details"
                        className="toggle-details-icon"
                      >
                        <FontAwesomeIcon 
                          icon={expandedRows[vote._id] ? faArrowUp : faArrowDown} 
                        />
                      </span>
                    </div>
                      </div>
                    </td>

                    {/* Opinion Buttons */}
                    <td>
                      <div className="hide-mobile opinion-buttons">
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
                      <div className='hide-mobile'>
                        <small>{formatDate(vote.updatedAt !== vote.createdAt ? vote.updatedAt : vote.createdAt)}</small>
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="hide-mobile">
                      <div className="comment-container hide-mobile">
                        <textarea
                          type="text"
                          value={vote.comment}
                          onChange={(e) => updateComment(index, e.target.value)}
                          placeholder='Explain your vote...'
                        />
                      </div>
                    </td>
                    <td>
                      <span 
                        onClick={() => deleteSubmission(index)}
                        aria-label="Delete Entry"
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <FontAwesomeIcon className="hide-mobile" icon={faTrashCan} />
                      </span>
                     
                    </td>
                  </tr>
                  {expandedRows[index] && (
                    <tr className="show-mobile">
                      <td>
                        <div className="expanded-details">
                          <div className="opinion-buttons-mobile">
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
                          <div className='comment-container'>
                            <textarea
                              className="comment-input-mobile"
                              type="text"
                              value={vote.comment}
                              onChange={(e) => updateComment(index, e.target.value)}
                              placeholder='Explain your vote...'
                            /> 
                            <td className="hide-mobile">
                              <span 
                                onClick={() => deleteSubmission(index)}
                                 aria-label="Delete Entry"
                                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </span>
                            </td>
                          </div>           
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

