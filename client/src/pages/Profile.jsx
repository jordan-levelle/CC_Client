import React, { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProposalsContext } from '../hooks/useProposalContext';
import { fetchProposalsListAPI } from '../api/proposals';
import ProposalList from '../components/ProposalList';

const Profile = () => {
  const { proposals, dispatch } = useProposalsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const proposals = await fetchProposalsListAPI(user.token);
          dispatch({ type: 'SET_PROPOSALS', payload: proposals });
        }
      } catch (error) {
        console.error('Error fetching proposals:', error.message);
      }
    };

    fetchData();
  }, [dispatch, user]);

  return (
    <div className="dashboard">
      <div className="proposals-container">
        <div className="proposal-list-container">
          <h4>Your Proposals</h4>
          {proposals && proposals.map((proposal) => (
            <ProposalList key={proposal._id} proposal={proposal} />
          ))}
        </div>
        <div className="proposal-participated-container">
          <h4>Proposals Participated In</h4>
        </div>
      </div>
      
      <div className="user-details">
        <span className="email">{user.email}</span>
      </div>
    </div>
  );
};

export default Profile;



