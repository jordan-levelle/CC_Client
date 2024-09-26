import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';
import DropdownMenu from './DropdownMenu';
import Modal from './PopupOverlay';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faTrashCan, faArrowDown, faArrowUp, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import { icons, tooltips, formatDate } from '../constants/Constants';
import { useTeamsContext } from '../context/TeamsContext';
import { useProposalsContext } from '../hooks/useProposalContext';
import { useAuthContext } from "../hooks/useAuthContext";
import {
 fetchProposalData,
 fetchSubmittedVotes,
 submitNewTableEntry,
 deleteTableEntry,
 updateComment,
 updateOpinion,
 updateName,
 checkFirstRender,
 deleteProposalAPI
} from '../api/proposals';
import '../styles/components/proposalvote.css';

 const ProposalVote = () => {
 const { dispatch } = useProposalsContext();
 const { uniqueUrl } = useParams();
 const { user } = useAuthContext();
 const { selectedTeam, clearSelectedTeam } = useTeamsContext();


 const [proposal, setProposal] = useState(null);
 const [submittedVotes, setSubmittedVotes] = useState([]);
 const [votesSubmitted, setVotesSubmitted] = useState(false);
 const [newVote, setNewVote] = useState({ name: '', opinion: '', comment: '' });
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(true);
 const [copiedProposalLink, setCopiedProposalLink] = useState(false);
 const [copiedEditLink, setCopiedEditLink] = useState(false);
 const [showFirstRenderMessage, setShowFirstRenderMessage] = useState(false);
 const [expandedRows, setExpandedRows] = useState({});
 const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isDeleted, setIsDeleted] = useState(false);

 useEffect(() => {
   const fetchDataAndHandleVotes = async () => {
     try {
       // Fetch proposal data
       const proposalData = await fetchProposalData(uniqueUrl);
       if (!proposalData || !proposalData._id) {
         throw new Error('Invalid response structure');
       }
        setProposal(proposalData);
        const votesData = await fetchSubmittedVotes(proposalData._id);
       setSubmittedVotes(votesData);
        const firstRender = await checkFirstRender(proposalData._id);
       setShowFirstRenderMessage(firstRender);
        // Handle initial vote submission if it's the first render
       if (selectedTeam && proposalData._id && !votesSubmitted && firstRender) {
         const votePromises = selectedTeam.members.map((member) => {
           const memberVote = { name: member.memberName, opinion: '', comment: '' };
           return submitNewTableEntry(proposalData._id, memberVote, setSubmittedVotes, setNewVote, setError);
         });
          // Submit all votes concurrently and update the state with the new votes
         await Promise.all(votePromises);
          const updatedVotes = await fetchSubmittedVotes(proposalData._id);
         setSubmittedVotes(updatedVotes);
          setVotesSubmitted(true); // Prevent multiple submissions
       }
     } catch (error) {
       console.error('Error fetching data or submitting initial votes:', error);
       setError('Error fetching data or submitting initial votes: ' + error.message);
     } finally {
       setIsLoading(false);
       clearSelectedTeam();
     } 
   };
    fetchDataAndHandleVotes();
 }, [uniqueUrl, selectedTeam, votesSubmitted, clearSelectedTeam]);
 
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


 const handleDeleteProposalClick = async () => {
   if (!user) return;
    try {
      await deleteProposalAPI(proposal._id, user.token);
      dispatch({ type: 'DELETE_PROPOSAL', payload: proposal });
      setIsDeleted(true); // Set deletion status
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };




 const proposalLink = `${window.location.origin}/${uniqueUrl}`;
 const editLink = user
 ? `${window.location.origin}/edit/${uniqueUrl}`
 : `${window.location.origin}/edit/${uuidv4()}/${uniqueUrl}`;


 const handleNewVoteChange = (e) => {
   const { name, value } = e.target;
   setNewVote((prevVote) => ({ ...prevVote, [name]: value }));
 };


 const handleOpinionButtonClick = async (opinionType) => {
   setNewVote((prevVote) => ({ ...prevVote, opinion: opinionType }));
   try {
     await submitNewTableEntry(proposal._id, { ...newVote, opinion: opinionType }, setSubmittedVotes, setNewVote, setError);
     setNewVote({ name: '', opinion: '', comment: '' });
   } catch (error) {
     setError('Error submitting new entry: ' + error.message);
   }
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


 const handleNewTableEntry = async () => {
   try {
     await submitNewTableEntry(proposal._id, newVote, setSubmittedVotes, setNewVote, setError);
     setNewVote({ name: '', opinion: '', comment: '' });
   } catch (error) {
     setError('Error submitting new entry: ' + error.message);
   }
 };


 const handleKeyDown = (e) => {
   if (e.key === 'Enter' && e.target.name === 'name') {
     handleNewTableEntry();
   }
 };


 const opinionCounts = submittedVotes.reduce((acc, vote) => {
   acc[vote.opinion] = (acc[vote.opinion] || 0) + 1;
   return acc;
 }, {});


 const toggleDetails = (voteId) => {
   setExpandedRows((prev) => ({ ...prev, [voteId]: !prev[voteId] }));
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
    <div className="first-render-message">
       <h4>Welcome! Your Proposal has been created</h4>
       <div className="copy-link-container">
         <p>
           Copy this link to send to Respondents:
           <span>
             <a href={proposalLink} target="_blank" rel="noopener noreferrer">{proposalLink}</a>
           </span>
           <button
             className="small-button"
             onClick={() => copyUrlToClipboard('proposal', proposalLink)}>
             {copiedProposalLink ? 'URL Copied!' : 'Copy Proposal Link'}
           </button>
         </p>
       </div>
       <p>
         Use this link to edit your proposal:
         <span>
           <a href={editLink} target="_blank" rel="noopener noreferrer">{editLink}</a>
         </span>
         <button
           className="small-button"
           onClick={() => copyUrlToClipboard('edit', editLink)}>
           {copiedEditLink ? 'URL Copied!' : 'Copy Edit Link'}
         </button>
       </p>
       {!user && (
         <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
           IMPORTANT: Save the edit link for your records! You won't see it again!
         </p>
       )}
     </div>
    )} 
     <div className="main-container">
       <div className="proposal-info">
         <h3>{proposal.title}</h3>
         {proposal.name && <p>Proposed by: {proposal.name}</p>}
         <p>Proposed On: {formatDate(proposal.createdAt)}</p>
         <div className="proposal-description">
           <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
         </div>
       </div>
          <div className="settings-dropdown">
            <DropdownMenu icon={faEllipsis}>
              <button className="dropdown-item">Create Team from Current Respondents</button>
              <button className="dropdown-item">Edit Proposal</button>
              <button
                className="dropdown-item"
                onClick={() => setIsModalOpen(true)}>
                Delete Proposal
              </button>
            </DropdownMenu>
          </div>
 

       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
       <div style={{ textAlign: 'center' }}>
         {isDeleted ? (
           <div>
             <p>Proposal deleted successfully!</p>
             <Link to="/profile" className="profile-link" onClick={() => setIsDeleted(false)}>Go to Profile</Link>
           </div>
         ) : (
           <>
             <p>Are you sure you want to delete this proposal? It will delete all responses.</p>
             <button
               className='small-button'
               style={{ marginRight: '10px' }}
               onClick={handleDeleteProposalClick}>
               Yes
             </button>
             <button
               className='small-button'
               onClick={() => setIsModalOpen(false)}>
               No
             </button>
           </>
         )}
       </div>
     </Modal>
   
       <div className="table-container">
         <table className="table"> 
         <thead>
         {/* Table Heading/Vote Tally */}
         <tr>
           <th>
             <h6>Name</h6>
           </th>
           <th className="opinion-column">
             <div className="opinion-tally-wrapper">
               <div className="opinion-tally-container">
                 {Object.keys(icons).map((opinionType) => (
                   <div key={opinionType} className="opinion-content">
                     <div className="opinion-tally-item">
                       <FontAwesomeIcon icon={icons[opinionType]} />
                       <span className="opinion-count">{opinionCounts[opinionType] || 0}</span>
                     </div>
                   </div>
                 ))}
               </div>
               <h6>Opinion</h6>
             </div>
           </th>
           <th>
             <h6>Comment</h6>
           </th>
         </tr>
       </thead>
         <tbody>
           {/* Submit New Table Entry */}
           <tr className="submit-section">
             <td>
               <input
                 id='name'
                 type="text"
                 name="name"
                 value={newVote.name}
                 onChange={handleNewVoteChange}
                 onKeyDown={handleKeyDown}
                 placeholder="Name"
                 aria-label="Name"
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
                       type="button"
                       className={newVote.opinion === opinionType ? 'selected' : ''}
                       onClick={() => handleOpinionButtonClick(opinionType)}
                       aria-label={`Vote ${opinionType}`}
                     >
                       <FontAwesomeIcon icon={icons[opinionType]} /> <span>{opinionType}</span>
                     </button>
                     <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                   </div>
                 ))}
               </div>
             </td>
             <td>
               <textarea
                 name="comment"
                 className="comment-input"
                 value={newVote.comment}
                 onChange={handleNewVoteChange}
                 onKeyDown={handleKeyDown}
                 placeholder="Explain your vote..."
                 aria-label="Comment"
               />
             </td>
             <td>
               <button
                 onClick={handleNewTableEntry}
                 aria-label="Submit New Entry"
                 className="small-button">Submit
               </button>
             </td>
           </tr>
           {/* Submitted Votes Table */}
           {submittedVotes.map((vote, index) => (
             <React.Fragment key={vote._id}>
               <tr className='submitted-table-row'>
                 {/* Name */}
                 <td className="info-container">
                 <div className="name-container">
                   {vote.name ? (
                     <span>{vote.name}</span>
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
                 <div className="details-container">
                   {/* Opinion Text Label */}
                   <div className="opinion-label-container show-mobile">
                     {vote.opinion && (
                       <span className="opinion-label">
                         <FontAwesomeIcon icon={icons[vote.opinion]} /> {vote.opinion}
                       </span>
                     )}
                   </div>


                   {/* Conditional rendering of the comment icon */}
                   {vote.comment ? (
                     <div className="comment-icon-container show-mobile">
                       <FontAwesomeIcon
                         icon={faCommentDots}
                         data-tip={vote.comment}
                         data-for={`comment-tooltip-${vote.comment}`}
                       />
                       <Tooltip
                         id={`comment-tooltip-${vote.comment}`}
                         place="top"
                         effect="solid"
                         className="tooltip"
                       >
                         <span>{vote.comment}</span>
                       </Tooltip>
                     </div>
                   ) : (
                     <div className="comment-icon-placeholder"></div> /* Placeholder for spacing */
                   )}


                   <div className="show-mobile">
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
                 </div>
               </td>


               {/* Opinion Buttons (Desktop only) */}
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
                         onClick={() => handleOpinionUpdate(index, opinionType)}
                         aria-label={`Vote ${opinionType}`}
                       >
                         <FontAwesomeIcon icon={icons[opinionType]} /> <span>{opinionType}</span>
                       </button>
                       <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                     </div>
                   ))}
                 </div>
                 <div className='hide-mobile'>
                   <small>{formatDate(vote.updatedAt !== vote.createdAt ? vote.updatedAt : vote.createdAt)}</small>
                 </div>
               </td>


               {/* Comment (Desktop only) */}
               <td className='hide-mobile'>
                 <div className="comment-container hide-mobile">
                   <textarea
                     className="comment-input"
                     value={vote.comment}
                     onChange={(e) => handleCommentUpdate(index, e.target.value)}
                     aria-label="Comment"
                   />
                 </div>
               </td>
               <td>
                 <span
                   onClick={() => handleDeleteEntry(vote._id)}
                   aria-label="Delete Entry"
                   style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                 >
                   <FontAwesomeIcon className="hide-mobile" icon={faTrashCan} />
                 </span>
               </td>
             </tr>


             {/* Expanded Mobile Details */}
             {expandedRows[vote._id] && (
               <tr className="submitted-table-row show-mobile">
                 <td>
                   <div className="expanded-details">
                     {/* Opinion Buttons (Shown only when expanded on mobile) */}
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
                             onClick={() => handleOpinionUpdate(index, opinionType)}
                             aria-label={`Vote ${opinionType}`}
                           >
                             <FontAwesomeIcon icon={icons[opinionType]} /> {opinionType}
                           </button>
                           <Tooltip id={`${opinionType.toLowerCase()}-tooltip`} />
                         </div>
                       ))}
                     </div>
                     <div className="show-mobile">
                       <small>{formatDate(vote.updatedAt !== vote.createdAt ? vote.updatedAt : vote.createdAt)}</small>
                     </div>
                     <div className="comment-container">
                       <textarea
                         className="comment-input-mobile"
                         value={vote.comment}
                         onChange={(e) => handleCommentUpdate(index, e.target.value)}
                         aria-label="Comment"
                       />
                       <div className="show-mobile">
                         <span
                           onClick={() => handleDeleteEntry(vote._id)}
                           aria-label="Delete Entry"
                           style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                         >
                           <FontAwesomeIcon icon={faTrashCan} />
                         </span>
                       </div>
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


export default ProposalVote;