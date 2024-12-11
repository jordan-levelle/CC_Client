
const PROP_URL = process.env.REACT_APP_PROPOSALS_URL;

// GET All User Proposal List API Call
export const fetchProposalListAPI = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${PROP_URL}/all`, {
    headers: headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }

  return response.json();
};

// POST Create New Proposal API Call
export const createProposal = async (proposalData, token) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  try {
    const response = await fetch(`${PROP_URL}`, {
      method: 'POST',
      body: JSON.stringify(proposalData),
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Failed to create proposal');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }
};

// GET Selected Proposal to Edit API Call
export const fetchEditProposalAPI = async (uniqueUrl) => {
  const response = await fetch(`${PROP_URL}/${uniqueUrl}`);
  
  const data = await response.json();
    // Validate the response structure
    if (!data.proposal || !Array.isArray(data.documents)) {
      throw new Error('Invalid response structure');
    }

    return {
      proposal: data.proposal,
      isOwner: data.isOwner,
      documents: data.documents, // Include documents metadata
    };
};

// PUT Selected Proposal to Update API Call
export const updateProposalAPI = async (uniqueUrl, updatedProposal, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${PROP_URL}/${uniqueUrl}`, {
    method: 'PUT',
    body: JSON.stringify(updatedProposal),
    headers: headers,
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
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${PROP_URL}/${proposalId}`, {
    method: 'DELETE',
    headers: headers,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete proposal: ${errorMessage}`);
  }

  return response.json();
};

// GET Proposal Data API Call
export const fetchProposalData = async (uniqueUrl, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${PROP_URL}/${uniqueUrl}`, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch proposal');
    }

    const data = await response.json();
    // Validate the response structure
    if (!data.proposal || !Array.isArray(data.documents)) {
      throw new Error('Invalid response structure');
    }

    return {
      proposal: data.proposal,
      isOwner: data.isOwner,
      documents: data.documents, // Include documents metadata
    };
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
};

// GET Proposal Submission Data API Call
export const fetchSubmittedVotes = async (proposalId) => {
  try {
    const response = await fetch(`${PROP_URL}/${proposalId}/votes`);
    if (!response.ok) {
      throw new Error('Failed to fetch submitted votes');
    }
    const votesData = await response.json();
    return votesData.votes;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const submitNewTableEntry = async (proposalId, newVote, setSubmittedVotes, uniqueUrl) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Include uniqueUrl in the newVote object
  const voteDataToSend = {
    ...newVote,    // Spread existing vote properties
    uniqueUrl,    // Add uniqueUrl to the request body
  };

  try {
    const response = await fetch(`${PROP_URL}/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify(voteDataToSend),
      headers: headers,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error response from API:', errorResponse); // Log the error response
      return;
    }

    const voteData = await response.json();

    return voteData;
  } catch (error) {
    console.error('Error in submitNewTableEntry:', error.message);
    return;
  }
};





// UPDATE Existing Table Entry API Call
export const handleSubmittedVoteUpdate = async (proposalId, voteId, voteData) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${PROP_URL}/${proposalId}/votes/${voteId}`, {
      method: 'PUT',
      body: JSON.stringify(voteData),
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error updating vote');
    }

    return response.json();
  } catch (error) {
    console.error('API call error:', error.message);
    throw new Error(error.message);
  }
};



export const deleteTableEntry = async (voteId, setSubmittedVotes, submittedVotes) => {
  try {
    const response = await fetch(`${PROP_URL}/votes/${voteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting vote: ${response.statusText}`);
    }

    setSubmittedVotes(submittedVotes.filter(vote => vote._id !== voteId));
  } catch (error) {
    console.error('Error in deleteTableEntry:', error);
    throw error; // Re-throw to handle in the calling function
  }
};







