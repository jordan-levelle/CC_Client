import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useResetPassword = () => {
  const { dispatch } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace this with your actual API call for resetting the password
      const response = await fetch('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not reset password');
      }

      // Dispatch RESET_PASSWORD action
      dispatch({ type: 'RESET_PASSWORD' });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return { resetPassword, error, isLoading };
};