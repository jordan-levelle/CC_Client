// api/proposals.js

const BASE_URL = 'https://consensus-check-4f851f681e3a.herokuapp.com/api/proposals';

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

export const updateVote = async (proposalId, voteIndex, newVoteValue) => {
  try {
    const response = await fetch(`${BASE_URL}/vote/${proposalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ index: voteIndex, vote: newVoteValue })
    });
    if (!response.ok) {
      throw new Error('Failed to update vote');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating vote:', error);
    throw error;
  }
};
