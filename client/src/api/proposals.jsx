const PROP_URL = process.env.REACT_APP_PROPOSALS_URL;
const USER_URL = process.env.REACT_APP_USERS_URL;

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

  // Log the proposal data being sent
  console.log('Creating proposal with data:', proposalData);

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
    // Log the response from the server
    console.log('Proposal created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }
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

    // Conditionally include the Authorization header if a token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${PROP_URL}/${uniqueUrl}`, { headers }); // Pass headers to the fetch call

    if (!response.ok) {
      throw new Error('Failed to fetch proposal');
    }

    const data = await response.json();
    console.log('Fetching Proposal Data:', data); // Logs the proposal and isOwner flag
    return data;
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

export const submitNewTableEntry = async (proposalId, newVote, setSubmittedVotes) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(`${PROP_URL}/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify(newVote),
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Error submitting vote');
    }

    const voteData = await response.json();

    if (voteData && voteData.addedVote) {
      setSubmittedVotes((prevVotes) => {
        const isVoteAlreadySubmitted = prevVotes.some(vote => vote._id === voteData.addedVote._id);
        if (!isVoteAlreadySubmitted) {
          return [voteData.addedVote, ...prevVotes]; // Add new vote to the current state
        }
        return prevVotes; // If vote is already there, do nothing
      });
    }

    if (token) {
      const userResponseUpdate = await fetch(`${USER_URL}/setParticipatedProposal`, {
        method: 'POST',
        body: JSON.stringify({
          proposalId,
          voteId: voteData.addedVote._id,
        }),
        headers: headers,
      });

      if (!userResponseUpdate.ok) {
        console.error('Error response from /setParticipatedProposal:', userResponseUpdate);
        throw new Error('Error updating user participated proposals');
      }
    }

    return voteData;
  } catch (error) {
    console.error('Error in submitNewTableEntry:', error.message);
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

// DELETE Table Entry API Call
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
  }
};







