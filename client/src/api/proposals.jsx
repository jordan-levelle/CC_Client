// api/proposals.js

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchExampleProposal = async () => {
  try {
    const response = await fetch(`${BASE_URL}/example`);
    if (!response.ok) {
      throw new Error('Failed to fetch example proposal');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching example proposal:', error);
    throw error;
  }
};

export const createProposal = async (proposalData, token) => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify(proposalData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to create proposal');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  };

  export const fetchProposalAndVotes = async (uniqueUrl) => {
    try {
      const proposalResponse = await fetch(`${BASE_URL}/${uniqueUrl}`);
      if (!proposalResponse.ok) {
        throw new Error('Failed to fetch proposal');
      }
      const proposalData = await proposalResponse.json();
  
      const votesResponse = await fetch(`${BASE_URL}/${proposalData._id}/votes`);
      if (!votesResponse.ok) {
        throw new Error('Failed to fetch submitted votes');
      }
      const votesData = await votesResponse.json();
  
      return { proposal: proposalData, submittedVotes: votesData.votes };
    } catch (error) {
      return { error: error.message }; // Return error message
    }
  };
  
  export const submitVote = async (proposalId, newVote) => {
    try {
      const response = await fetch(`${BASE_URL}/${proposalId}/vote`, {
        method: 'POST',
        body: JSON.stringify(newVote),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error submitting vote');
      }
  
      return response.json();
    } catch (error) {
      throw error;
    }
  };
  
  export const updateVote = async (proposalId, voteId, updatedVote) => {
    try {
      const response = await fetch(`${BASE_URL}/${proposalId}/votes/${voteId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedVote),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error updating vote');
      }
  
      return response.json();
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteVote = async (voteId) => {
    try {
      const response = await fetch(`${BASE_URL}/votes/${voteId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error deleting vote: ${errorMessage}`);
      }
    } catch (error) {
      throw error;
    }
  };
