import React, { useEffect, useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { useAuthContext } from '../hooks/useAuthContext'; // Import the useAuthContext hook

const VerificationCheck = () => {
  const { isLoading, signup } = useSignup();
  const { updateUser } = useAuthContext();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const token = localStorage.getItem('verificationToken');
        if (!token) return;

        const response = await fetch(`/api/user/verify/${token}`, { method: 'POST' });
        const json = await response.json();

        if (response.ok && json.message === 'Account verified successfully') {
          setIsVerified(true);
        } else {
          setError(json.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        setError('An error occurred while verifying your account');
      }
    };

    const interval = setInterval(() => {
      checkVerificationStatus();
    }, 10000); // Check every 10 seconds

    checkVerificationStatus();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isVerified) {
      const performSignup = async () => {
        try {
          const userData = await signup(); // Trigger signup
          if (userData) {
            // If signup is successful, update user context
            updateUser(userData);
          }
        } catch (error) {
          setError(error.message || 'An error occurred during signup');
        }
      };
      performSignup();
    }
  }, [isVerified, signup, updateUser]);

  return (
    <div className="verification-message">
      {isLoading ? (
        <p>Please wait while we verify your account...</p>
      ) : isVerified ? (
        <p>Your account has been successfully verified. You can now log in.</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Please check your email for account verification. If you haven't received it, you can request another verification email.</p>
      )}
    </div>
  );
};

export default VerificationCheck;

