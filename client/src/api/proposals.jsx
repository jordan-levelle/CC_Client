const PROP_URL = process.env.REACT_APP_PROPOSALS_URL;
const USER_URL = process.env.REACT_APP_USERS_URL;

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
    headers: getHeaders(token),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete proposal: ${errorMessage}`);
  }

  return response.json();
};

// GET All User Proposal List API Call
export const fetchProposalListAPI = async (token) => {
  const response = await fetch(`${PROP_URL}/all`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }

  return response.json();
};

// Get Active User Proposal List API Call
export const fetchActiveProposalListAPI = async (token) => {
  const response = await fetch(`${PROP_URL}/active`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }

  return response.json();
}

// Get Expired User Proposal List API Call
export const fetchExpiredProposalListAPI = async (token) => {
  const response = await fetch(`${PROP_URL}/expired`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }

  return response.json();
}

export const fetchArchivedProposalListAPI = async (token) => {
  const response = await fetch(`${PROP_URL}/archived`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }

  return response.json();
}


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
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Submit the vote
    const response = await fetch(`${PROP_URL}/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify(newVote),
      headers,
    });

    if (!response.ok) {
      throw new Error('Error submitting vote');
    }

    const voteData = await response.json(); // Capture the vote data, including voteId

    // Fetch the updated list of votes for the proposal
    const fetchedVotes = await fetchSubmittedVotes(proposalId);

    // Sort the votes by createdAt date
    const sortedVotes = fetchedVotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setSubmittedVotes(sortedVotes);
    setNewVote({ name: '', opinion: '', comment: '' });

    if (token) {
      const userResponseUpdate = await fetch(`${USER_URL}/setParticipatedProposal`, {
        method: 'POST',
        body: JSON.stringify({
          proposalId,
          voteId: voteData.addedVote._id // Use the returned voteId
        }),
        headers,
      });

      if (!userResponseUpdate.ok) {
        console.error('Error response from /setParticipatedProposal:', userResponseUpdate);
        throw new Error('Error updating user participated proposals');
      }
    }
  } catch (error) {
    console.error('Error in submitNewTableEntry:', error.message);
    setError(error.message);
  }
};


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
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Include token in Authorization header
    }

    const response = await fetch(`${PROP_URL}/${proposalId}/votes/${voteId}`, {
      method: 'PUT',
      body: JSON.stringify(voteData),
      headers: headers,
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


/* Example Proposal Util Functions */
export const handleExistingOpinionUpdate = (index, newVoteValue, exampleProposal, setExampleProposal) => {
  const updatedVotes = [...exampleProposal.votes];
  const currentDate = new Date().toISOString();
  updatedVotes[index].opinion = newVoteValue;
  updatedVotes[index].updatedAt = currentDate;
  setExampleProposal(prevProposal => ({
    ...prevProposal,
    votes: updatedVotes,
  }));
};

export const handleExistingCommentUpdate = (index, newComment, exampleProposal, setExampleProposal) => {
  const updatedVotes = [...exampleProposal.votes];
  const currentDate = new Date().toISOString();
  updatedVotes[index].comment = newComment;
  updatedVotes[index].updatedAt = currentDate;
  setExampleProposal(prevProposal => ({
    ...prevProposal,
    votes: updatedVotes,
  }));
};

export const handleExistingSubmissionDelete = (index, exampleProposal, setExampleProposal) => {
  const updatedVotes = exampleProposal.votes.filter((_, i) => i !== index);
  setExampleProposal(prevProposal => ({
    ...prevProposal,
    votes: updatedVotes,
  }));
};

export const handleNewTableEntry = (e, newVote, setNewVote) => {
  const { name, value } = e.target;
  setNewVote(prevVote => ({
    ...prevVote,
    [name]: value,
  }));
};

export const handleNewSubmission = (exampleProposal, newVote, setExampleProposal, setNewVote) => {
  const currentDate = new Date().toISOString();
  const updatedNewVote = {
    ...newVote,
    updatedAt: currentDate
  };
  const updatedVotes = [...exampleProposal.votes, updatedNewVote];
  setExampleProposal(prevProposal => ({
    ...prevProposal,
    votes: updatedVotes,
  }));
  setNewVote({ name: '', opinion: '', comment: '' });
};

export const formatDate = (dateString) => {
  if (!dateString || !Date.parse(dateString)) {
    return '';
  }
  const options = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
};


