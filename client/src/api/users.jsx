const USER_URL = process.env.REACT_APP_USERS;

export const deleteAccountAPI = async (token, deleteProposals) => {
  const response = await fetch(`${USER_URL}/delete`, {
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
  const response = await fetch(`${USER_URL}/participatedProposals`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Could not fetch participated proposals');
  }
  return data;
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