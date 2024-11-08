import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips, formatDate } from '../constants/Constants';
import { faTrashCan, faCommentDots, faArrowUp, faArrowDown, faPencil } from '@fortawesome/free-solid-svg-icons';
import { updateComment, updateOpinion, updateName } from '../utils/proposalUtils';
import { showDeleteToast, showErrorToast, showSuccessToast } from 'src/utils/toastNotifications';
import { deleteTableEntry } from 'src/api/proposals';
import '../styles/components/proposalvotecard.css';

const VoteCard = ({ submittedVotes, setSubmittedVotes, proposal }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [timeoutIds, setTimeoutIds] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [localName, setLocalName] = useState({});
  const nameInputRefs = useRef({});
  const nameUpdateRef = useRef({}); 

  useEffect(() => {
    // Cleanup function to clear all timeouts when component unmounts
    return () => {
      Object.values(timeoutIds).forEach(clearTimeout);
    };
  }, [timeoutIds]);

  useEffect(() => {
    // Save pending comments before user leaves the page
    const handleBeforeUnload = () => {
      Object.keys(commentDrafts).forEach((key) => {
        if (commentDrafts[key]) {
          const index = submittedVotes.findIndex(vote => vote._id === key);
          updateComment(proposal._id, submittedVotes, setSubmittedVotes, index, commentDrafts[key]);
        }
      });
    };
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [commentDrafts, proposal._id, submittedVotes, setSubmittedVotes]);

  const handleNameUpdate = async (index, newName) => {
    const voteId = submittedVotes[index]._id;

    if (nameUpdateRef.current[voteId]) return;  // Prevent duplicate updates
      nameUpdateRef.current[voteId] = true;  

    try {
      await updateName(proposal._id, submittedVotes, setSubmittedVotes, index, newName);
      showSuccessToast('voteNameSuccess');
    } catch (error) {
      console.error('Error updating name:', error);
      showErrorToast('voteError');
    } finally {
      nameUpdateRef.current[voteId] = false;  // Reset after update
    }
  };

  const toggleEditName = (voteId, currentName = '') => {
    setIsEditing((prev) => ({
      ...prev,
      [voteId]: !prev[voteId],
    }));
    setLocalName((prev) => ({
      ...prev,
      [voteId]: currentName,
    }));
  };

  const handleKeyDown = (e, index, voteId) => {
    if (e.key === 'Enter' && e.target.name === 'name') {
      handleNameUpdate(index, localName[submittedVotes[index]._id]);
      nameInputRefs.current[voteId]?.blur();
    }
  };

  const handleOpinionUpdate = async (index, newOpinionValue) => {
    try {
      await updateOpinion(proposal._id, submittedVotes, setSubmittedVotes, index, newOpinionValue);
      showSuccessToast('voteOpinionSuccess');
    } catch (error) {
      console.error('Error updating opinion:', error);
      showErrorToast('voteError');
    }
  };

  const handleCommentChange = (index, newComment) => {
    const voteId = submittedVotes[index]._id;
    setCommentDrafts((prev) => ({
      ...prev,
      [voteId]: newComment,
    }));
  
    // Clear any existing timeout to avoid race conditions
    if (timeoutIds[voteId]) {
      clearTimeout(timeoutIds[voteId]);
    }
  
    // Set up a timeout to save the comment after 30 seconds
    const newTimeoutId = setTimeout(async () => {
      if (newComment !== '') {  // Only update if comment isn't empty
        await updateComment(proposal._id, submittedVotes, setSubmittedVotes, index, newComment);
      }
    }, 30000);
  
    // Update the timeout ID in state
    setTimeoutIds((prevTimeouts) => ({
      ...prevTimeouts,
      [voteId]: newTimeoutId,
    }));
  };
  
  const handleBlurComment = async (index, voteId) => {
    const newComment = commentDrafts[voteId] || '';
      // Save comment immediately and show success toast
      await updateComment(proposal._id, submittedVotes, setSubmittedVotes, index, newComment);
      showSuccessToast('voteCommentSuccess');
  };

  const handleDeleteEntry = async (voteId) => {
    try {
      await deleteTableEntry(voteId, setSubmittedVotes, submittedVotes);
      showDeleteToast('voteDelete');
    } catch (error) {
      console.error('Error deleting vote:', error);
      showErrorToast('voteError');
    }
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
        submittedVotes.map((vote, index) => 
          
          (
          
          <div key={vote._id} className={`vote-items ${expandedRows[vote._id] ? 'details-visible' : ''}`}>
            <div className='mobile-toggle-row'>
            <div className="name-and-details">
              {isEditing[vote._id] ? (
                <input
                  ref={(el) => (nameInputRefs.current[vote._id] = el)} // Set input ref
                  id="name"
                  name="name"
                  className="name-input"
                  type="text"
                  value={localName[vote._id] || ''}
                  placeholder={vote.name || "Enter Name"}
                  onChange={(e) =>
                    setLocalName((prev) => ({
                      ...prev,
                      [vote._id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, vote._id)}
                  onBlur={() => {
                    if (localName[vote._id]) {
                      handleNameUpdate(index, localName[vote._id]);
                    }
                    toggleEditName(vote._id);
                  }}
                  autoFocus
                />
              ) : (
                <span className="name-span">
                  {vote.name || "No Name"}
                  <FontAwesomeIcon
                    icon={faPencil}
                    style={{ marginLeft: '5px', cursor: 'pointer' }}
                    onClick={() => toggleEditName(vote._id, vote.name)}
                  />
                </span>
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
                  <FontAwesomeIcon icon={expandedRows[vote._id] ? faArrowUp : faArrowDown} />
                </span>
              </div>
            </div>
            <div className='opinion-container'>
              <div className='opinion-buttons'>
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
                    <FontAwesomeIcon icon={icons[opinionType]} /> <span>{opinionType}</span>
                  </button>
                  <Tooltip key={`${opinionType}-tooltip`} id={`${opinionType.toLowerCase()}-tooltip`} />
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
                onBlur={() => handleBlurComment(index, vote._id)} // Immediate save on blur
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
        ))}
    </div>
  );
};

export default VoteCard;
