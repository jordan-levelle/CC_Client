import React from 'react'
import UserTeams from '../components/UserTeams';
import UserCreateTeams from '../components/UserCreateTeams';

const Teams = () => {
  return (
    <div className='Teams-Dashboard-Container'>
        <div className='Create-Teams-Container'>
            <h4>Create Your Team</h4>
            < UserCreateTeams />
        </div>
        <div className='User-Teams-Container'>
            <h4>Your Teams</h4>
            < UserTeams />
        </div>
        
   
    </div>
  )
}

export default Teams