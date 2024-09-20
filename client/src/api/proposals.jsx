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
export const fetchProposalData = async (uniqueUrl) => {
  try {
    const response = await fetch(`${PROP_URL}/${uniqueUrl}`);
    if (!response.ok) {
      throw new Error('Failed to fetch proposal');
    }
    const data = await response.json();
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

// POST New Proposal Table Entry API Call
export const submitNewTableEntry = async (proposalId, newVote, setSubmittedVotes, setNewVote, setError) => {
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

    const fetchedVotes = await fetchSubmittedVotes(proposalId);
    const sortedVotes = fetchedVotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setSubmittedVotes(sortedVotes);
    setNewVote({ name: '', opinion: '', comment: '' });

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
  } catch (error) {
    console.error('Error in submitNewTableEntry:', error.message);
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


