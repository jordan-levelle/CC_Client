// api/proposals.js

const BASE_URL = process.env.REACT_APP_BASE_URL;

// GET Example* Proposal API Call
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

// POST Create New Proposal API Call
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

// GET Proposal Data API Call
export const fetchProposalData = async (uniqueUrl) => {
  try {
    const proposalResponse = await fetch(`${BASE_URL}/${uniqueUrl}`);
    if (!proposalResponse.ok) {
      throw new Error('Failed to fetch proposal');
    }
    const proposalData = await proposalResponse.json();
    return proposalData;
  } catch (error) {
    throw new Error(error.message);
  }
};

// GET Proposal Submission Data API Call
export const fetchSubmittedVotes = async (proposalId) => {
  try {
    const votesResponse = await fetch(`${BASE_URL}/${proposalId}/votes`);
    if (!votesResponse.ok) {
      throw new Error('Failed to fetch submitted votes');
    }
    const votesData = await votesResponse.json();
    return votesData.votes;
  } catch (error) {
    throw new Error(error.message);
  }
};

// POST New Proposal Table Entry API Call
export const submitNewTableEntry = async (proposalId, newVote, setSubmittedVotes, setNewVote, setError) => {
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

    const votesResponse = await fetch(`${BASE_URL}/${proposalId}/votes`);
    if (!votesResponse.ok) {
      throw new Error('Failed to fetch submitted votes');
    }
    const votesData = await votesResponse.json();
    setSubmittedVotes(votesData.votes);

    setNewVote({ name: '', vote: '', comment: '' });
  } catch (error) {
    setError(error.message);
    console.error('Error submitting vote:', error);
  }
};

// DELETE Table Entry API Call
export const deleteTableEntry = async (voteId, setSubmittedVotes, submittedVotes, setError) => {
  try {
    const response = await fetch(`${BASE_URL}/votes/${voteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error deleting vote: ${errorMessage}`);
    }

    const updatedVotes = submittedVotes.filter(vote => vote._id !== voteId);
    setSubmittedVotes(updatedVotes);
  } catch (error) {
    setError(error.message);
    console.error('Error deleting vote:', error);
  }
};

// UPDATE Existing Table Entry API Call
export const handleSubmittedVoteUpdate = async (proposalId, vote) => {
  try {
    const response = await fetch(`${BASE_URL}/${proposalId}/vote`, {
      method: 'PUT',
      body: JSON.stringify(vote),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error updating vote');
    }

    const responseData = await response.json();
    console.log('Vote updated successfully:', responseData);
  } catch (error) {
    console.error('Error updating vote:', error);
    throw new Error(error.message);
  }
};

export const updateVote = async (proposalId, submittedVotes, setSubmittedVotes, index, newVoteValue) => {
  try {
    const updatedVotes = [...submittedVotes];
    updatedVotes[index].vote = newVoteValue;
    setSubmittedVotes(updatedVotes);
    await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]);
  } catch (error) {
    console.error('Error updating vote:', error);
    throw new Error(error.message);
  }
};

export const updateComment = async (proposalId, submittedVotes, setSubmittedVotes, index, newComment) => {
  try {
    const updatedVotes = [...submittedVotes];
    updatedVotes[index].comment = newComment;
    setSubmittedVotes(updatedVotes);
    await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]);
  } catch (error) {
    console.error('Error updating vote:', error);
    throw new Error(error.message);
  }
};

  




