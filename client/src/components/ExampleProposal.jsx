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
} from '../utils/proposalUtils';

const ExampleProposal = () => {
  const [exampleProposal, setExampleProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newVote, setNewVote] = useState({ name: '', vote: '', comment: '' });

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
                <tr key={index}>
                  <td>{vote.name}</td>
                  <td>
                    <div className="vote-buttons">
                      {['Agree', 'Neutral', 'Disagree', 'Block'].map((voteOption) => (
                        <div
                        key={voteOption}
                        data-tooltip-id={`${voteOption.toLowerCase()}-tooltip`}
                        data-tooltip-html={tooltips[voteOption]}
                      >
                        <button
                          key={voteOption}
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
                  <td>
                    <textarea
                      type="text"
                      value={vote.comment}
                      onChange={(e) => updateComment(index, e.target.value)}
                      placeholder='Explain your vote...'
                    />
                  </td>
                  <td>
                    <button onClick={() => deleteSubmission(index)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={newVote.name}
                    onChange={newTableEntry}
                  />
                </td>
                <td>
                  <div className="vote-buttons">
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




