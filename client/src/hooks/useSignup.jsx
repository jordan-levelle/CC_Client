import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { signupAPI, checkVerificationStatusAPI } from '../api/users';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const [verificationPending, setVerificationPending] = useState(false);

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const { verificationToken } = await signupAPI(email, password);
      // Save the verification token for the verification process
      localStorage.setItem('verificationToken', verificationToken);
      setVerificationPending(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationStatus = async (token) => {
    try {
      const { verified, user } = await checkVerificationStatusAPI(token);
      if (verified) {
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN', payload: user });
        setVerificationPending(false);
      }
      return verified;
    } catch (error) {
      setError(error.message);
      setVerificationPending(false);
    }
  };

  return { signup, checkVerificationStatus, isLoading, error, verificationPending };
};
