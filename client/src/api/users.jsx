// utils.js
const USER_URL = process.env.REACT_APP_USERS;

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

