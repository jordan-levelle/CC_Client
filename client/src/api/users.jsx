const USER_URL = process.env.REACT_APP_USERS;

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

    return data.message; // Assuming the response contains a message field
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
}

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


export const fetchParticipatedProposalsAPI = async (token) => {
  try {
    const response = await fetch(`${USER_URL}/getParticipatedProposals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
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


export const checkVerificationStatusAPI = async (verificationToken) => {
  try {
    let verified = false;

    while (!verified) {
      const response = await fetch(`${process.env.REACT_APP_USERS}/verify/status/${verificationToken}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        verified = data.verified;
        if (verified) {
          return { verified: true, user: data.user };
        }
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }

      // Poll every 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.error('Error checking verification status:', error);
    throw error;
  }
};