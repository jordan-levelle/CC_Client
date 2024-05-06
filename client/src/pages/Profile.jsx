import React from 'react';
import { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProposalsContext } from '../hooks/useProposalContext';

import ProposalList from '../components/ProposalList';

const Profile = () => {
  const { proposals, dispatch } = useProposalsContext();
  const { user } = useAuthContext();


  useEffect(() => {
    const fetchProposals = async () => {
      const response = await fetch('/api/proposals', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_PROPOSALS', payload: json });
      }
    };

    if (user) {
      fetchProposals();
    }
  }, [dispatch, user]);

  return (
    <div className="dashboard">
      <div className="proposal-list-container">
        <h4>Your Proposals</h4>
        {proposals && proposals.map((proposal) => (
          <ProposalList key={proposal._id} proposal={proposal} />
        ))}
      </div>
      <div className='proposal-participated-container'>
        <h4>Proposal Participated In</h4>
      </div>
      <div className="user-details">
        <span className="email">{user.email}</span>
      </div>
    </div>
  );
};

export default Profile;


