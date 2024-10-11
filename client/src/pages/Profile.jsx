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
  const { proposals, participatedProposals, dispatch, filterProposals, filterParticipatedProposals } = useProposalsContext();
  const { user, isSubscribed } = useAuthContext();


  const [selectedFilter, setSelectedFilter] = useState('All');
  const [participatedFilter, setParticipatedFilter] = useState('All');


  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const proposalsData = await fetchProposalListAPI(user.token);
          dispatch({ type: 'SET_PROPOSALS', payload: proposalsData });

          const participatedData = await fetchParticipatedProposalsAPI(user.token);
          dispatch({ type: 'SET_PARTICIPATED_PROPOSALS', payload: participatedData });
          
        } catch (error) {
          console.error('Error fetching proposals:', error.message);
        }
      }
    };

    fetchData();
  }, [user, dispatch]);



  const handlePropFilter = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleParticipatedPropFilter = (event) => {
    setParticipatedFilter(event.target.value);
  }

  // Use the filteredProposals directly or from the state where it's updated
  const filteredProposals = filterProposals(proposals, selectedFilter);
  const filteredParticipatedProposals = filterParticipatedProposals(participatedProposals, participatedFilter)

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
            <p key='no-proposals'>No Proposals</p>
          )}
        </div>
        <div className="component-container-2">
          <h4>Participated Proposals</h4>
          <div className="participated-proposal-filter-options">
            <Form>
              <div key="inline-radio" className="mb-3">
                <Form.Check
                  inline
                  label="All"
                  name="group2"
                  type="radio"
                  id="inline-radio-7"
                  value="All"
                  checked={participatedFilter === 'All'}
                  onChange={handleParticipatedPropFilter}
                />
                <Form.Check
                  inline
                  label="Archived"
                  name="group2"
                  type="radio"
                  id="inline-radio-8"
                  value="Archived"
                  checked={participatedFilter === 'Archived'}
                  onChange={handleParticipatedPropFilter}
                />
              </div>
            </Form>
          </div>

          {filteredParticipatedProposals && filteredParticipatedProposals.length > 0 ? (
          filteredParticipatedProposals.map((proposal) => {
            return <ParticipatedProposalList key={proposal._id} proposal={proposal} />
          })
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
