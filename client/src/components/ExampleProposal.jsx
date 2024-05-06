/* 4/30 Refactored
   Beta Ready
*/

import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faBan, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';

const ExampleProposal = () => {
  const [exampleProposal, setExampleProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newVote, setNewVote] = useState({ name: '', vote: '', comment: '' });

  useEffect(() => {
    const fetchExampleProposal = async () => {
      try {
        const response = await fetch('/api/proposals/example');
        if (!response.ok) {
          throw new Error('Failed to fetch example proposal');
        }
        const exampleProposalData = await response.json();
        setExampleProposal(exampleProposalData);
      } catch (error) {
        console.error('Error fetching example proposal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExampleProposal();
  }, []);

  const handleNewVoteChange = (e) => {
    const { name, value } = e.target;
    setNewVote(prevVote => ({
      ...prevVote,
      [name]: value
    }));
  };

  const submitNewVote = () => {
    // Implement the logic to submit a new vote (does not save to database)
    const updatedVotes = [...exampleProposal.votes, newVote];
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes
    }));
    setNewVote({ name: '', vote: '', comment: '' });
  };

  const handleVoteUpdate = (index, newVoteValue) => {
    // Implement the logic to update a vote (does not save to database)
    const updatedVotes = [...exampleProposal.votes];
    updatedVotes[index].vote = newVoteValue;
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes
    }));
  };

  const handleCommentUpdate = (index, newComment) => {
    // Implement the logic to update a comment (does not save to database)
    const updatedVotes = [...exampleProposal.votes];
    updatedVotes[index].comment = newComment;
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes
    }));
  };

  const handleDeleteVote = (index) => {
    // Implement the logic to delete a vote (does not save to database)
    const updatedVotes = exampleProposal.votes.filter((_, i) => i !== index);
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes
    }));
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
                <th>Vote</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {exampleProposal.votes.map((vote, index) => (
                <tr key={index}>
                  <td>{vote.name}</td>
                  <td>
                    <div className="vote-buttons">
                      {['Agree', 'Disagree', 'Neutral', 'Block'].map((voteOption) => (
                        <button
                          key={voteOption}
                          type="button"
                          className={vote.vote === voteOption ? 'selected' : ''}
                          onClick={() => handleVoteUpdate(index, voteOption)}
                        >
                          <FontAwesomeIcon icon={icons[voteOption]} /> {' '}{voteOption}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td>
                    <textarea
                      type="text"
                      value={vote.comment}
                      onChange={(e) => handleCommentUpdate(index, e.target.value)}
                      placeholder='Explain your vote...'
                    />
                  </td>
                  <td>
                    <button onClick={() => handleDeleteVote(index)}>Delete</button>
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
                    {['Agree', 'Disagree', 'Neutral', 'Block'].map((voteOption) => (
                      <div
                        key={voteOption}
                        data-tooltip-id={`${voteOption.toLowerCase()}-tooltip`}
                        data-tooltip-html={tooltips[voteOption]}
                      >
                        <button
                          type="button"
                          className={newVote.vote === voteOption ? 'selected' : ''}
                          onClick={() => setNewVote({ ...newVote, vote: voteOption })}
                        >
                          <FontAwesomeIcon icon={icons[voteOption]} /> {' '}{voteOption}
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
                    onChange={handleNewVoteChange}
                    placeholder='Explain your vote...'
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
    </section>
  );
};

// Object containing icons and tooltips for different vote options
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

export default ExampleProposal;



