import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { formatDate, icons } from '../constants/Constants';
import DOMPurify from 'dompurify';
import Modal from './PopupOverlay';
import DropdownMenu from './DropdownMenu';
import UserCreateTeams from './UserCreateTeams';
import EditProposal from './EditProposal';
import '../styles/components/proposalvotedescriptioncard.css';
import '../styles/components/dropdown.css';
import { deleteProposalAPI } from '../api/proposals';

const DescriptionCard = ({
  proposal,
  user,
  uniqueUrl,
  showFirstRenderMessage,
  dispatch,
  submittedVotes,
  onUpdateProposal,
  isOwner,
}) => {
  const [isEditProposalModalOpen, setIsEditProposalModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isTeamCreated, setIsTeamCreated] = useState(false);
  const [copiedProposalLink, setCopiedProposalLink] = useState(false);
  const [copiedEditLink, setCopiedEditLink] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const sanitizedProposal = DOMPurify.sanitize(proposal.description);

  const respondentNames = submittedVotes.map(vote => ({
    name: vote?.name || '',
    email: vote?.email || '',
  }));

  const handleCreateTeamFromRespondents = () => {
    setIsCreateTeamModalOpen(true);
  };

  const handleEditProposal = () => {
    setIsEditProposalModalOpen(true);
  };

  const handleProposalUpdate = (updatedProposal) => {
    dispatch({ type: 'EDIT_PROPOSAL', payload: updatedProposal });
    setIsEditProposalModalOpen(false);
    onUpdateProposal(updatedProposal);
  };

  const handleDeleteProposal = async () => {
    if (!user) return;
    try {
      await deleteProposalAPI(proposal._id, user.token);
      dispatch({ type: 'DELETE_PROPOSAL', payload: proposal });
      setIsDeleted(true);
    } catch (error) {
      // Handle error appropriately
    }
  };

  const copyUrlToClipboard = (urlType, url) => {
    navigator.clipboard.writeText(url);
    if (urlType === 'proposal') {
      setCopiedProposalLink(true);
    } else if (urlType === 'edit') {
      setCopiedEditLink(true);
    }
  };

  const opinionCounts = Array.isArray(submittedVotes)
    ? submittedVotes.reduce((acc, vote) => {
        if (vote && vote.opinion) {
          acc[vote.opinion] = (acc[vote.opinion] || 0) + 1;
        }
        return acc;
      }, {})
    : {};

  const proposalLink = `${window.location.origin}/${uniqueUrl}`;
  const editLink = user
    ? `${window.location.origin}/edit/${uniqueUrl}`
    : `${window.location.origin}/edit/${uuidv4()}/${uniqueUrl}`;

  return (
    <div className="description-card">
      {showFirstRenderMessage && (
        <div className="first-render-message">
          <h4>Welcome! Your Proposal has been created.</h4>
          <div className="copy-link-container">
            <p>
              Copy this link to send to Respondents:
              <span>
                <a href={proposalLink} target="_blank" rel="noopener noreferrer">
                  {proposalLink}
                </a>
              </span>
              <button
                className="small-button"
                onClick={() => copyUrlToClipboard('proposal', proposalLink)}
              >
                {copiedProposalLink ? 'URL Copied!' : 'Copy Proposal Link'}
              </button>
            </p>
          </div>
          <p>
            Use this link to edit your proposal:
            <span>
              <a href={editLink} target="_blank" rel="noopener noreferrer">
                {editLink}
              </a>
            </span>
            <button
              className="small-button"
              onClick={() => copyUrlToClipboard('edit', editLink)}
            >
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

      <div className="proposal-header">
        <h3>{proposal.title}</h3>
        {isOwner && (
          <div className="settings-dropdown">
            <DropdownMenu icon={faEllipsis} positionClass="dropdown-right">
              <button className="dropdown-item" onClick={handleCreateTeamFromRespondents}>
                Create Team From Respondents
              </button>
              <button className="dropdown-item" onClick={handleEditProposal}>
                Edit Proposal
              </button>
              <button className="dropdown-item" onClick={() => setIsModalOpen(true)}>
                Delete Proposal
              </button>
            </DropdownMenu>
          </div>
        )}
      </div>

      {proposal.name && <p>Proposed by: {proposal.name}</p>}
      <p>Proposed On: {formatDate(proposal.createdAt)}</p>
      <div className="proposal-description">
        <p dangerouslySetInnerHTML={{ __html: sanitizedProposal }}></p>
      </div>

      {proposal.file && (
        <div className="uploaded-file">
          <h4>Uploaded File:</h4>
          {proposal.file.type.startsWith('image/') ? (
            <img src={proposal.file.url} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
          ) : proposal.file.type === 'application/pdf' ? (
            <a href={proposal.file.url} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          ) : (
            <p>File: <a href={proposal.file.url} target="_blank" rel="noopener noreferrer">{proposal.file.name}</a></p>
          )}
        </div>
      )}

      <div className="three-column-layout">
        <div className="left-column"></div>
        <div className="middle-column">
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
        </div>
        <div className="right-column"></div>
      </div>

      {isCreateTeamModalOpen && (
        <Modal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)}>
          <UserCreateTeams
            existingTeam={null}
            defaultMembers={respondentNames}
            onClose={() => setIsCreateTeamModalOpen(false)}
            onCreate={() => {
              setIsTeamCreated(true);
              setIsCreateTeamModalOpen(false);
            }}
          />
        </Modal>
      )}

      {isTeamCreated && (
        <Modal isOpen={isTeamCreated} onClose={() => setIsTeamCreated(false)}>
          <div style={{ textAlign: 'center' }}>
            <p>Team created successfully!</p>
            <Link to="/teams" className="team-link" onClick={() => setIsTeamCreated(false)}>
              Go to Teams
            </Link>
          </div>
        </Modal>
      )}

      {isEditProposalModalOpen && (
        <Modal isOpen={isEditProposalModalOpen} onClose={() => setIsEditProposalModalOpen(false)}>
          <EditProposal
            proposal={proposal}
            onClose={() => setIsEditProposalModalOpen(false)}
            onUpdate={handleProposalUpdate}
            isModal={true}
          />
        </Modal>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div style={{ textAlign: 'center' }}>
          {isDeleted ? (
            <div>
              <p>Proposal deleted successfully!</p>
              <Link to="/profile" className="profile-link" onClick={() => setIsDeleted(false)}>
                Go to Profile
              </Link>
            </div>
          ) : (
            <>
              <p>Are you sure you want to delete this proposal? It will delete all responses.</p>
              <button className="small-button" style={{ marginRight: '10px' }} onClick={handleDeleteProposal}>
                Yes
              </button>
              <button className="small-button" onClick={() => setIsModalOpen(false)}>
                No
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DescriptionCard;
