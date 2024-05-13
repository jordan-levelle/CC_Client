// utils.js
const USER_URL = process.env.REACT_APP_USERS;


export const deleteAccountAPI = async (token, deleteProposals) => {
  const response = await fetch(`${USER_URL}/delete`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deleteProposals }), // Pass deleteProposals to the server
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
  
    return json;
  } catch (error) {
    console.error('Error log in:', error);
      throw error;
  }
 
};

