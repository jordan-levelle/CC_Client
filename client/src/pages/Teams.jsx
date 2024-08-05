import React, { useRef } from 'react';
import UserTeams from '../components/UserTeams';
import UserCreateTeams from '../components/UserCreateTeams';

const Teams = () => {
  const userTeamsRef = useRef();

  const handleTeamCreated = () => {
    if (userTeamsRef.current) {
      userTeamsRef.current.fetchTeams();
    }
  };

  return (
    <div className='Teams-Dashboard-Container'>
      <div className='Create-Teams-Container'>
        <h4>Create Your Team</h4>
        <UserCreateTeams onTeamCreated={handleTeamCreated} />
      </div>
      <div className='User-Teams-Container'>
        <h4>Your Teams</h4>
        <UserTeams ref={userTeamsRef} />
      </div>
    </div>
  );
};

export default Teams;
