// useLogin.js
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { loginAPI } from '../api/users';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const json = await loginAPI(email, password);

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

  return { login, isLoading, error };
};
