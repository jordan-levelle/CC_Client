import React from 'react';
import UserCreateTeams from './UserCreateTeams';
import Modal from './PopupOverlay';

const UserEditTeams = ({ selectedTeam, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <UserCreateTeams 
        existingTeam={selectedTeam} 
        onClose={onClose} 
      />
    </Modal>
  );
};

export default UserEditTeams;



