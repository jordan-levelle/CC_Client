// useSignup.js
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { signupAPI } from '../api/users';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const json = await signupAPI(email, password);
      
      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));
      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
