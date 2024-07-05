import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips } from '../constants/Icons_Tooltips';
import { fetchExampleProposal } from '../api/proposals';
import {
  handleExistingVoteUpdate,
  handleExistingCommentUpdate,
  handleExistingSubmissionDelete,
  handleNewSubmission,
  handleNewTableEntry
} from '../api/proposals';

const ExampleProposal = () => {
  const [exampleProposal, setExampleProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newVote, setNewVote] = useState({ name: '', vote: '', comment: '' });
  const [expandedRows, setExpandedRows] = useState({}); // State to track expanded rows
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // Initial check

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const proposalData = await fetchExampleProposal();
        setExampleProposal(proposalData);
      } catch (error) {
        console.error('Error fetching example proposal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
  }, []);

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

  const updateVote = (index, newVoteValue) => {
    handleExistingVoteUpdate(index, newVoteValue, exampleProposal, setExampleProposal);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              {exampleProposal.votes.map((vote, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="mobile-name-opinion-row">
                      <div className="name-container">
                        <span>{vote.name}</span>
                      </div>
                      <div className="opinion-container">
                        <span className="show-mobile">
                          {vote.vote && (
                            <span className="opinion-label">
                              <FontAwesomeIcon icon={icons[vote.vote]} /> {vote.vote}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="toggle-button show-mobile">
                        <button onClick={() => toggleDetails(index)} aria-label="Toggle Details">
                          {expandedRows[index] ? 'Hide Details' : 'Details'}
                        </button>
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <div className="opinion-buttons">
                        {['Agree', 'Neutral', 'Disagree', 'Block'].map((voteOption) => (
                          <div
                            key={voteOption}
                            data-tooltip-id={`${voteOption.toLowerCase()}-tooltip`}
                            data-tooltip-html={tooltips[voteOption]}
                          >
                            <button
                              type="button"
                              className={vote.vote === voteOption ? 'selected' : ''}
                              onClick={() => updateVote(index, voteOption)}
                              data-tip={tooltips[voteOption]} // Add data-tip attribute
                            >
                              <FontAwesomeIcon icon={icons[voteOption]} /> {voteOption}
                            </button>
                            <Tooltip id={`${voteOption.toLowerCase()}-tooltip`} />
                          </div>
                        ))}
                      </div>
                    </td>
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
                            {['Agree', 'Neutral', 'Disagree', 'Block'].map((voteOption) => (
                              <div
                                key={voteOption}
                                data-tooltip-id={`${voteOption.toLowerCase()}-tooltip`}
                                data-tooltip-html={tooltips[voteOption]}
                              >
                                <button
                                  type="button"
                                  className={vote.vote === voteOption ? 'selected' : ''}
                                  onClick={() => updateVote(index, voteOption)}
                                  data-tip={tooltips[voteOption]} // Add data-tip attribute
                                >
                                  <FontAwesomeIcon icon={icons[voteOption]} /> {voteOption}
                                </button>
                                <Tooltip id={`${voteOption.toLowerCase()}-tooltip`} />
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
              <tr className="submit-section">
                <td>
                  <input
                    type="text"
                    name="name"
                    value={newVote.name}
                    onChange={newTableEntry}
                    placeholder="Name"
                  />
                </td>
                <td>
                  <div className="opinion-buttons">
                    {['Agree', 'Neutral', 'Disagree', 'Block'].map((voteOption) => (
                      <div
                        key={voteOption}
                        data-tooltip-id={`${voteOption.toLowerCase()}-tooltip`}
                        data-tooltip-html={tooltips[voteOption]}
                      >
                        <button
                          type="button"
                          className={newVote.vote === voteOption ? 'selected' : ''}
                          onClick={() => setNewVote({ ...newVote, vote: voteOption })}
                          data-tip={tooltips[voteOption]} // Add data-tip attribute
                        >
                          <FontAwesomeIcon icon={icons[voteOption]} /> {voteOption}
                        </button>
                        <Tooltip id={`${voteOption.toLowerCase()}-tooltip`} />
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <textarea
                    type="text"
                    name="comment"
                    value={newVote.comment}
                    onChange={newTableEntry}
                    placeholder='Explain your vote...'
                  />
                </td>
                <td>
                  <button onClick={newSubmission}>Save</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ExampleProposal;