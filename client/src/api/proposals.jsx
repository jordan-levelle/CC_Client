const PROP_URL = process.env.REACT_APP_PROPOSALS;

export const fetchEditProposalAPI = async (uniqueUrl) => {
  const response = await fetch(`${PROP_URL}/${uniqueUrl}`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposal');
  }
  return response.json();
};

export const updateProposalAPI = async (uniqueUrl, updatedProposal, token) => {
  const response = await fetch(`${PROP_URL}/${uniqueUrl}`, {
    method: 'PUT',
    body: JSON.stringify(updatedProposal),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in to update the proposal.');
    } else {
      throw new Error('Error submitting proposal');
    }
  }
  return response.json();
};

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

export const fetchProposalsListAPI = async (token) => {
  const response = await fetch(`${PROP_URL}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }

  return response.json();
};

export const fetchExampleProposal = async () => {
  const response = await fetch(`${PROP_URL}/example`);
  if (!response.ok) {
    throw new Error('Failed to fetch example proposal');
  }
  return response.json();
};

export const createProposal = async (proposalData, token) => {
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
};

export const fetchProposalData = async (uniqueUrl) => {
  const response = await fetch(`${PROP_URL}/${uniqueUrl}`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposal');
  }
  const data = await response.json();

  return { proposal: data };
};

export const fetchSubmittedVotes = async (proposalId) => {
  const votesResponse = await fetch(`${PROP_URL}/${proposalId}/votes`);
  if (!votesResponse.ok) {
    throw new Error('Failed to fetch submitted votes');
  }
  const votesData = await votesResponse.json();
  return votesData.votes;
};

export const submitNewTableEntry = async (proposalId, newVote, setSubmittedVotes, setNewVote, setError) => {
  try {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${PROP_URL}/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify(newVote),
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Error submitting vote');
    }

    const data = await fetchSubmittedVotes(proposalId);
    setSubmittedVotes(data);
    setNewVote({ name: '', vote: '', comment: '' });
  } catch (error) {
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

export const handleSubmittedVoteUpdate = async (proposalId, vote) => {
  const response = await fetch(`${PROP_URL}/${proposalId}/vote`, {
    method: 'PUT',
    body: JSON.stringify(vote),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error updating vote');
  }

  return response.json();
};

export const updateVote = async (proposalId, submittedVotes, setSubmittedVotes, index, newVoteValue) => {
  try {
    const updatedVotes = [...submittedVotes];
    updatedVotes[index] = {
      ...updatedVotes[index],
      vote: newVoteValue,
      updatedAt: new Date(),
    };
    setSubmittedVotes(updatedVotes);
    await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]);
  } catch (error) {
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
    throw new Error(error.message);
  }
};

export const updateName = async (proposalId, submittedVotes, setSubmittedVotes, index, newName) => {
  try {
    const voteToUpdate = submittedVotes[index];
    const updatedVotes = [...submittedVotes];
    updatedVotes[index].name = newName;

    setSubmittedVotes(updatedVotes);

    await fetch(`${PROP_URL}/${proposalId}/vote`, {
      method: 'PUT',
      body: JSON.stringify({ ...voteToUpdate, newName, voteId: voteToUpdate._id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error('Error updating vote: ' + error.message);
  }
};