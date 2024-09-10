import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import ProposalList from '../components/ProposalList';
import ParticipatedProposalList from '../components/ParticipatedProposalList';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProposalsContext } from '../hooks/useProposalContext';
import { fetchParticipatedProposalsAPI } from '../api/users';
import {
  fetchProposalListAPI,
  fetchActiveProposalListAPI,
  fetchExpiredProposalListAPI,
  fetchArchivedProposalListAPI
} from '../api/proposals';

const Profile = () => {
  const { proposals, participatedProposals, dispatch } = useProposalsContext();
  const { user, isSubscribed } = useAuthContext();

  const [includeOwnProposals, setIncludeOwnProposals] = useState(() => {
    return JSON.parse(localStorage.getItem('includeOwnProposals')) || false;
  });
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showHidden, setShowHidden] = useState(() => {
    return JSON.parse(localStorage.getItem('showHidden')) || false;
  });

  useEffect(() => {
    const filterApiCalls = {
      All: () => fetchProposalListAPI(user.token),
      Active: () => fetchActiveProposalListAPI(user.token),
      Expired: () => fetchExpiredProposalListAPI(user.token),
      Archived: () => fetchArchivedProposalListAPI(user.token),
    };
  
    const fetchData = async () => {
      try {
        if (user) {
          const apiCall = isSubscribed
            ? ['Active', 'Archived'].includes(selectedFilter)
              ? filterApiCalls[selectedFilter]
              : filterApiCalls['Active']
            : filterApiCalls[selectedFilter];
  
          const fetchedProposals = await apiCall();
          dispatch({ type: 'SET_PROPOSALS', payload: fetchedProposals });
  
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
  }, [dispatch, user, includeOwnProposals, selectedFilter, isSubscribed]);
  
  
  

  const handleParticipatedPropsFilter = () => {
    const persistToggleState = !includeOwnProposals;
    setIncludeOwnProposals(persistToggleState);
    localStorage.setItem('includeOwnProposals', JSON.stringify(persistToggleState));
  };

  const handlePropFilter = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleShowHiddenToggle = () => {
    const newShowHidden = !showHidden;
    setShowHidden(newShowHidden);
    localStorage.setItem('showHidden', JSON.stringify(newShowHidden));
  };

  return (
    <div className="dashboard">
      <div className="page-container">
        <div className="component-container-1">
          <h4>Your Proposals</h4>
          <div className="user-proposal-filter-options">
            <Form>
              <div key="inline-radio" className="mb-3">
                {isSubscribed ? (
                  <>
                    <Form.Check
                      inline
                      label="Active"
                      name="group1"
                      type="radio"
                      id="inline-radio-2"
                      value="Active"
                      checked={selectedFilter === 'Active'}
                      onChange={handlePropFilter}
                    />
                    <Form.Check
                      inline
                      label="Archived"
                      name="group1"
                      type="radio"
                      id="inline-radio-4"
                      value="Archived"
                      checked={selectedFilter === 'Archived'}
                      onChange={handlePropFilter}
                    />
                  </>
                ) : (
                  <>
                    <Form.Check
                      inline
                      label="All"
                      name="group1"
                      type="radio"
                      id="inline-radio-1"
                      value="All"
                      checked={selectedFilter === 'All'}
                      onChange={handlePropFilter}
                    />
                    <Form.Check
                      inline
                      label="Active"
                      name="group1"
                      type="radio"
                      id="inline-radio-2"
                      value="Active"
                      checked={selectedFilter === 'Active'}
                      onChange={handlePropFilter}
                    />
                    <Form.Check
                      inline
                      label="Expired"
                      name="group1"
                      type="radio"
                      id="inline-radio-3"
                      value="Expired"
                      checked={selectedFilter === 'Expired'}
                      onChange={handlePropFilter}
                    />
                    <Form.Check
                      inline
                      label="Archived"
                      name="group1"
                      type="radio"
                      id="inline-radio-4"
                      value="Archived"
                      checked={selectedFilter === 'Archived'}
                      onChange={handlePropFilter}
                    />
                  </>
                )}
              </div>
            </Form>
          </div>
          {proposals && proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalList key={proposal._id} proposal={proposal} />
            ))
          ) : (
            <p>No Proposals</p>
          )}
        </div>
        <div className="component-container-2">
          <h4>Participated Proposals</h4>
          <div className="participated-proposal-filter-options">
            <Form>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Include Your Proposals"
                checked={includeOwnProposals}
                onChange={handleParticipatedPropsFilter}
              />
            </Form>
            <Form>
              <Form.Check
                type="switch"
                id="show-hidden-switch"
                label="Show Hidden"
                checked={showHidden}
                onChange={handleShowHiddenToggle}
              />
            </Form>
          </div>

          {participatedProposals && participatedProposals.length > 0 ? (
            participatedProposals.map((proposal) => (
              <ParticipatedProposalList
                key={proposal.proposalId}
                proposal={proposal}
                showHidden={showHidden}
              />
            ))
          ) : (
            <p>No participated proposals.</p>
          )}
        </div>
      </div>
      <div className="user-details">
        <span className="email">{user.email}</span>
        {isSubscribed ? (
          <div
            style={{
              padding: '10px',
              backgroundColor: 'green',
              opacity: 0.5,
              color: 'white',
              borderRadius: '5px'
            }}
          >
            Subscribed
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
