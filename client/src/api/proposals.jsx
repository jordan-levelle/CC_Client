const PROP_URL = process.env.REACT_APP_PROPOSALS;

// Helper function to get the headers with the optional authorization token
const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// GET Selected Proposal to Edit API Call
export const fetchEditProposalAPI = async (uniqueUrl) => {
  const response = await fetch(`${PROP_URL}/${uniqueUrl}`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposal');
  }
  return response.json();
};

// PUT Selected Proposal to Update API Call
export const updateProposalAPI = async (uniqueUrl, updatedProposal, token = null) => {
  const response = await fetch(`${PROP_URL}/${uniqueUrl}`, {
    method: 'PUT',
    body: JSON.stringify(updatedProposal),
    headers: getHeaders(token),
  });
  if (!response.ok) {
    const errorMessage = response.status === 401
      ? 'Unauthorized: Please log in to update the proposal.'
      : 'Error updating proposal';
    throw new Error(errorMessage);
  }
  return response.json();
};


// DELETE User Proposal API Call
export const deleteProposalAPI = async (proposalId, token) => {
  const response = await fetch(`${PROP_URL}/${proposalId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete proposal: ${errorMessage}`);
  }

  return response.json();
};

// GET User Proposal List API Call
export const fetchProposalsListAPI = async (token) => {
  const response = await fetch(`${PROP_URL}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }

  return response.json();
};

// GET Example* Proposal API Call
export const fetchExampleProposal = async () => {
  try {
    const response = await fetch(`${PROP_URL}/example`);
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
      const response = await fetch(`${PROP_URL}`, {
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
      const response = await fetch(`${PROP_URL}/${uniqueUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch proposal');
      }
      const data = await response.json();

      return { proposal: data };
    } catch (error) {
      throw new Error(error.message);
    }
  };

// GET Check First Render API Call
export const checkFirstRender = async (proposalId) => {
  try {
    const response = await fetch(`${PROP_URL}/${proposalId}/firstRender`);
    if (!response.ok) {
      throw new Error('Failed to fetch first render');
    }
    const data = await response.json();
    return data.firstRender; // Ensure we return the correct field
  } catch (error) {
    throw new Error(error.message);
  }
}

// GET Proposal Submission Data API Call
export const fetchSubmittedVotes = async (proposalId) => {
  try {
    const votesResponse = await fetch(`${PROP_URL}/${proposalId}/votes`);
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
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
    };

    // Check if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Include token in Authorization header
    }

    const response = await fetch(`${PROP_URL}/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify(newVote),
      headers: headers, // Include headers in the request
    });

    if (!response.ok) {
      throw new Error('Error submitting vote');
    }

    // Assuming fetchSubmittedVotes is a function that correctly retrieves the updated list of votes
    const data = await fetchSubmittedVotes(proposalId);
    setSubmittedVotes(data);
    setNewVote({ name: '', opinion: '', comment: '' });
  } catch (error) {
    setError(error.message);
  }
};

// DELETE Table Entry API Call
export const deleteTableEntry = async (voteId, setSubmittedVotes, submittedVotes, setError) => {
  try {
    const response = await fetch(`${PROP_URL}/votes/${voteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting vote: ${response.statusText}`);
    }

    setSubmittedVotes(submittedVotes.filter(vote => vote._id !== voteId));
  } catch (error) {
    setError(error.message);
  }
};

// UPDATE Existing Table Entry API Call
export const handleSubmittedVoteUpdate = async (proposalId, voteId, voteData) => {
  try {
    const response = await fetch(`${PROP_URL}/${proposalId}/votes/${voteId}`, {
      method: 'PUT',
      body: JSON.stringify(voteData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error updating vote');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('API call error:', error.message);
    throw new Error(error.message);
  }
};

export const updateOpinion = async (proposalId, submittedVotes, setSubmittedVotes, index, newOpinionValue) => {
  try {
    const updatedVotes = [...submittedVotes];
    updatedVotes[index] = {
      ...updatedVotes[index],
      opinion: newOpinionValue,
      updatedAt: new Date(),
    };
    setSubmittedVotes(updatedVotes);
    await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]._id, updatedVotes[index]);
  } catch (error) {
    console.error('Error updating opinion:', error.message);
  }
};

export const updateComment = async (proposalId, submittedVotes, setSubmittedVotes, index, newComment) => {
  try {
    const updatedVotes = [...submittedVotes];
    updatedVotes[index] = {
      ...updatedVotes[index],
      comment: newComment,
      updatedAt: new Date(),
    };
    setSubmittedVotes(updatedVotes);
    await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]._id, updatedVotes[index]);
  } catch (error) {
    console.error('Error updating comment:', error.message);
  }
};

export const updateName = async (proposalId, submittedVotes, setSubmittedVotes, index, newName) => {
  try {
    const updatedVotes = [...submittedVotes];
    updatedVotes[index] = {
      ...updatedVotes[index],
      name: newName,
      updatedAt: new Date(),
    };
    setSubmittedVotes(updatedVotes);
    await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]._id, updatedVotes[index]);
  } catch (error) {
    console.error('Error updating name:', error.message);
  }
};



