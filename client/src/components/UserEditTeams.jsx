import React from 'react';
import UserCreateTeams from './UserCreateTeams'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const UserEditTeams = ({ selectedTeam, onClose }) => {
  return (
    <div style={overlayStyles}>
      <div style={popupStyles}>
        <button
          style={closeButtonStyles}
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2>Edit Team</h2>
        <UserCreateTeams 
          existingTeam={selectedTeam} 
          onClose={onClose} 
        /> 
      </div>
    </div>
  );
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, .2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupStyles = {
  position: 'relative',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  width: '550px',
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.5rem',
};

export default UserEditTeams;



