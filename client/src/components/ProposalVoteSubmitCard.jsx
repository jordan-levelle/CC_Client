import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips } from '../constants/Constants';
import '../styles/components/proposalvotecard.css';
import '../styles/components/proposalvotesubmitcard.css';

const VoteSubmitCard = ({ handleNewTableEntry }) => {
  const [newVote, setNewVote] = useState({ name: '', opinion: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle opinion selection and auto-submit
  const handleOpinionSelect = async (opinionType) => {
    const updatedVote = { ...newVote, opinion: opinionType };
    setNewVote(updatedVote);

    // Submit the vote immediately when an opinion is selected
    await handleSubmit(updatedVote);
  };

  // Submit the vote when all conditions are met
  const handleSubmit = async (voteData = newVote) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Call the function passed in props to submit the vote
      await handleNewTableEntry(voteData); // Pass setErrorMessage to update the state in case of an error
  
        setNewVote({ name: '', opinion: '', comment: '' });
      
    } catch (error) {
      console.error("Error while submitting vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes (name, comment)
  const handleNewVoteChange = (e) => {
    const { name, value } = e.target;
    setNewVote((prevVote) => ({ ...prevVote, [name]: value }));
  };

  // Handle 'Enter' key submission for the 'name' input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.name === 'name') {
      handleSubmit();
    }
  };

  return (
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
            onChange={handleNewVoteChange}
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
                  onClick={() => handleOpinionSelect(opinionType)}
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
            onChange={handleNewVoteChange}
            className="comment-input"
            placeholder="Explain your vote (optional)..."
            aria-label="Comment"
          />
        </div>

        <div className='action-submit-container'>
          <button
            aria-label="Submit New Entry"
            className="small-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteSubmitCard;
