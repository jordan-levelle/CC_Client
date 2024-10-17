const USER_URL = process.env.REACT_APP_USERS_URL;

export const signupAPI = async (email, password) => {
  try {
    const response = await fetch(`${USER_URL}/signup`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 
        'Content-Type': 'application/json' },
    });
  
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.error);
    }
  
    return response.json();
  } catch (error) {
    console.error('Error sign up:', error);
    throw error;
  }
};

export const loginAPI = async (email, password) => {
  try {
    const response = await fetch(`${USER_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    const json = await response.json();
  
    if (!response.ok) {
      throw new Error(json.error);
    }
  
    // Store token in local storage upon successful login
    localStorage.setItem('token', json.token);
   
    return json;
  } catch (error) {
    console.error('Error log in:', error);
    throw error;
  }
};

export const deleteAccountAPI = async (token, deleteProposals) => {
  const response = await fetch(`${USER_URL}/deleteUser`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deleteProposals }), 
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.error);
  }

  return 'Account deleted successfully';
};

export const resetPasswordAPI = async (token, oldPassword, newPassword) => {
  try {
    const response = await fetch(`${USER_URL}/resetPassword`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return data.message;
  } catch (error) {
    throw new Error(error.message || 'An error occurred');
  }
};

export const sendForgotPasswordLinkAPI = async (email) => {
  try {
    const response = await fetch(`${USER_URL}/forgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send reset link');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const resetForgotPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${USER_URL}/resetForgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An error occurred while resetting your password.');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateEmailAPI = async (token, newEmail) => {
  const response = await fetch(`${USER_URL}/updateEmail`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: newEmail }),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.error);
  }

  return 'Email updated successfully';
};

export const checkVerificationStatusAPI = async (verificationToken) => {
  try {
    const response = await fetch(`${USER_URL}/verify/status/${verificationToken}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      return { verified: data.verified, user: data.user }; // Return verification status and user info
    } else {
      const error = await response.json();
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error checking verification status:', error);
    throw error;
  }
};


export const cancelUserSubscription = async (token) => {
  try {
    const response = await fetch(`${USER_URL}/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to cancel subscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'An error occurred while canceling subscription');
  }
};

export const setParticipatedProposal = async (proposalId, voteId, token) => {
  try {
    const response = await fetch(`${USER_URL}/setParticipatedProposal`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  // Ensure token is valid
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ proposalId, voteId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update participated proposal');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating participated proposal:', error);
    throw error;
  }
};

export const fetchParticipatedProposalsAPI = async (token) => {
  try {
    const response = await fetch(`${USER_URL}/getParticipatedProposals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Could not fetch participated proposals');
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching participated proposals:', error.message);
    throw new Error(error.message);
  }
};



export const removeParticipatedProposalAPI = async (proposalId, token) => {
  try {
    const response = await fetch(`${USER_URL}/removeParticipatedProposal/${proposalId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove participated proposal');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing participated proposals:', error.message);
    throw new Error(error.message);
  }
};

export const archiveProposalAPI = async (proposalId, token) => {

  try {
    const response = await fetch(`${USER_URL}/archiveProposal/${proposalId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to toggle archive state');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error toggling archive state:', error.message);
    throw new Error(error.message);
  }
};

export const archiveParticipatedProposalAPI = async (proposalId, token) => {

  try {
    const response = await fetch(`${USER_URL}/archiveParticipatedProposal/${proposalId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed response:", errorData); // Log error response
      throw new Error(errorData.error || 'Failed to toggle archive state of participated proposal');
    }

    const result = await response.json();
    return result; // Return the result directly
  } catch (error) {
    console.error(`Error toggling archive state of participated proposal ${proposalId}:`, error.message);
    throw new Error(error.message);
  }
};






