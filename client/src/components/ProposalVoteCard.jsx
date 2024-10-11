import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips, formatDate } from '../constants/Constants';
import { faTrashCan, faCommentDots, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { updateComment, updateOpinion, updateName } from '../utils/proposalUtils';
import '../styles/components/proposalvotecard.css';
import { deleteTableEntry } from 'src/api/proposals';

const VoteCard = ({ submittedVotes, setSubmittedVotes, proposal }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [timeoutId, setTimeoutId] = useState(null); // state to manage timeout

  useEffect(() => {
    // Cleanup function to cancel any pending timeout when component unmounts
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleOpinionUpdate = async (index, newOpinionValue) => {
    await updateOpinion(proposal._id, submittedVotes, setSubmittedVotes, index, newOpinionValue);
  };

  const handleCommentChange = (index, newComment) => {
    setCommentDrafts((prev) => ({
      ...prev,
      [submittedVotes[index]._id]: newComment,
    }));

    // Clear previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to delay the update
    const newTimeoutId = setTimeout(async () => {
      await updateComment(proposal._id, submittedVotes, setSubmittedVotes, index, newComment);
    }, 30000);

    setTimeoutId(newTimeoutId);
  };

  const handleNameUpdate = async (index, newName) => {
    await updateName(proposal._id, submittedVotes, setSubmittedVotes, index, newName);
  };

  const handleDeleteEntry = async (voteId) => {
    await deleteTableEntry(voteId, setSubmittedVotes, submittedVotes);
  };

  const toggleDetails = (voteId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [voteId]: !prev[voteId],
    }));
  };

  return (
    <div className='vote-card'>
      {submittedVotes.length > 0 &&
        submittedVotes.map((vote, index) => {
          return (
            <div key={vote._id} className={`vote-items ${expandedRows[vote._id] ? 'details-visible' : ''}`}>
              <div className="name-and-details">
                {vote.name ? (
                  <span className='name-span'>{vote.name}</span>
                ) : (
                  <input
                    className='name-input'
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
                    onClick={() => toggleDetails(vote._id)}
                    aria-label="Toggle Details"
                    className="toggle-details-icon"
                  >
                    <FontAwesomeIcon
                      icon={expandedRows[vote._id] ? faArrowUp : faArrowDown}
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
                        onClick={() => handleOpinionUpdate(index, opinionType)}
                        aria-label={`Vote ${opinionType}`}
                      >
                        <FontAwesomeIcon icon={icons[opinionType]} /> <span>{opinionType}</span>
                      </button>
                      <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                    </div>
                  ))}
                </div>
                <small className='vote-date'>
                  {formatDate(vote.updatedAt !== vote.createdAt ? vote.updatedAt : vote.createdAt)}
                </small>
              </div>

              <div className='comment-container'>
                <textarea
                  className="comment-input"
                  value={commentDrafts[vote._id] || vote.comment || ''} 
                  onChange={(e) => handleCommentChange(index, e.target.value)} 
                />
              </div>

              <div className='action-container'>
                <span
                  aria-label="Delete Entry"
                  className='delete-icon'
                  onClick={() => handleDeleteEntry(vote._id)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default VoteCard;
