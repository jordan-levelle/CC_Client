import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import ProposalList from '../components/ProposalList';
import ParticipatedProposalList from '../components/ParticipatedProposalList';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProposalsContext } from '../hooks/useProposalContext';
import {
  fetchParticipatedProposalsAPI,
} from '../api/users';
import {
  fetchProposalListAPI,
} from '../api/proposals';

const Profile = () => {
  const { proposals, participatedProposals, dispatch, filterProposals } = useProposalsContext();
  const { user, isSubscribed } = useAuthContext();

  const [includeOwnProposals, setIncludeOwnProposals] = useState(() => {
    return JSON.parse(localStorage.getItem('includeOwnProposals')) || false;
  });
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showHidden, setShowHidden] = useState(() => {
    return JSON.parse(localStorage.getItem('showHidden')) || false;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const proposalsData = await fetchProposalListAPI(user.token);
          dispatch({ type: 'SET_PROPOSALS', payload: proposalsData });

          const participatedData = await fetchParticipatedProposalsAPI(user.token, includeOwnProposals);
          dispatch({ type: 'SET_PARTICIPATED_PROPOSALS', payload: participatedData });
        } catch (error) {
          console.error('Error fetching proposals:', error.message);
        }
      }
    };

    fetchData();
  }, [selectedFilter, includeOwnProposals, user, dispatch]);

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

  // Use the filteredProposals directly or from the state where it's updated
  const filteredProposals = filterProposals(proposals, selectedFilter);

  return (
    <div className="dashboard">
      <div className="page-container">
        <div className="component-container-1">
          <h4>Proposals</h4>
          <div className="user-proposal-filter-options">
            <Form>
              <div key="inline-radio" className="mb-3">
                {isSubscribed ? (
                  <>
                    <Form.Check
                      inline
                      label="All"
                      name="group1"
                      type="radio"
                      id="inline-radio-2"
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
                  </>
                )}
              </div>
            </Form>
          </div>
          {filteredProposals && filteredProposals.length > 0 ? (
            filteredProposals.map((proposal) => (
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
                label="Your Proposals"
                checked={includeOwnProposals}
                onChange={handleParticipatedPropsFilter}
              />
            </Form>
            <Form>
              <Form.Check
                type="switch"
                id="show-hidden-switch"
                label="Hidden"
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
