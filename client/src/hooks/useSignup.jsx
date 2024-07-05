import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { signupAPI, checkVerificationStatusAPI } from '../api/users';
import validator from 'validator';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const [verificationPending, setVerificationPending] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validatePassword = (password) => {
    const errors = {
      minLength: validator.isLength(password, { min: 8 }),
      uppercase: validator.matches(password, /[A-Z]/),
      lowercase: validator.matches(password, /[a-z]/),
      number: validator.matches(password, /[0-9]/),
      specialChar: validator.matches(password, /[!@#$%^&*]/),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must meet all criteria.');
      setIsLoading(false);
      return;
    }

    try {
      const { verificationToken } = await signupAPI(email, password);
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

  return { signup, checkVerificationStatus, validatePassword, validateEmail, isLoading, error, verificationPending, passwordErrors, emailError };
};