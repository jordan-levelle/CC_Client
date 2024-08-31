import React from 'react';
import UserTeams from '../components/UserTeams';
import UserCreateTeams from '../components/UserCreateTeams';
import '../styles/components/userteams.css';

const Teams = () => {
  return (
    <div className='page-container'>
      <div className='component-container-1'>
        <h4>Create Your Team</h4>
        <UserCreateTeams />
      </div>
      <div className='component-container-2'>
        <h4>Your Teams</h4>
        <UserTeams />
      </div>

    </div>
  );
};

export default Teams;

