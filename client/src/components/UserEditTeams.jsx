import React from 'react';
import UserCreateTeams from './UserCreateTeams'; // Import the modified component

const UserEditTeams = ({ selectedTeam, onClose }) => {
  return (
    <div style={overlayStyles}>
      <div style={popupStyles}>
        <h2>Edit Team</h2>
        <UserCreateTeams 
            existingTeam={selectedTeam} 
            onClose={onClose} 
        /> 
      </div>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupStyles = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
};

export default UserEditTeams;


