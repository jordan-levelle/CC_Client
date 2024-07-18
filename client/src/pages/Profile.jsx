import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProposalsContext } from '../hooks/useProposalContext';
import { fetchProposalsListAPI } from '../api/proposals';
import { fetchParticipatedProposalsAPI } from '../api/users';
import ProposalList from '../components/ProposalList';
import ParticipatedProposalList from '../components/ParticipatedProposalList';

const Profile = () => {
  const { proposals, participatedProposals, dispatch } = useProposalsContext();
  const { user } = useAuthContext();
  const [includeOwnProposals, setIncludeOwnProposals] = useState(() => {
    return JSON.parse(localStorage.getItem('includeOwnProposals')) || false;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const userProposals = await fetchProposalsListAPI(user.token);
          dispatch({ type: 'SET_PROPOSALS', payload: userProposals });

          const participated = await fetchParticipatedProposalsAPI(user.token, includeOwnProposals);
          if (Array.isArray(participated)) {
            dispatch({ type: 'SET_PARTICIPATED_PROPOSALS', payload: participated });
          }
        }
      } catch (error) {
        console.error('Error fetching proposals:', error.message);
        if (error.message.includes('JWT malformed')) {
          localStorage.removeItem('token');
        }
      }
    };

    fetchData();
  }, [dispatch, user, includeOwnProposals]);

  const handleParticipatedPropsFilter = () => {
    const persistToggleState = !includeOwnProposals;
    setIncludeOwnProposals(persistToggleState);
    localStorage.setItem('includeOwnProposals', JSON.stringify(persistToggleState));
  };

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
          <h4>Participated Proposals</h4>
          <div className='filter-options'>
            <Form>
              <Form.Check 
                type="switch"
                id="custom-switch"
                label="Include Your Proposals"
                checked={includeOwnProposals}
                onChange={handleParticipatedPropsFilter}
              />
            </Form>
          </div>
          <ParticipatedProposalList proposals={participatedProposals} />
        </div>
      </div>
      <div className="user-details">
        <span className="email">{user.email}</span>
      </div>
    </div>
  );
};

export default Profile;