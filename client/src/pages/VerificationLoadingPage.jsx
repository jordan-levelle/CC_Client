import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkVerificationStatusAPI } from '../api/users'; 

const VerifyLoadingPage = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const { verified } = await checkVerificationStatusAPI(token);
        if (verified) {
          setVerificationStatus('success');
        }else {
          setVerificationStatus('error');
          console.error('Verification failed for token:', token);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        setVerificationStatus('error');
      }
    };

    if (!token) {
      console.error('Token is missing');
      setVerificationStatus('error');
    } else {
      verifyAccount();
    }

    return () => {
      // Cleanup function
    };
  }, [token]);

  useEffect(() => {
    if (verificationStatus === 'success') {
      navigate('/profile');
    }
  }, [verificationStatus, navigate]);

  return (
    <div>
      <h2>Verifying your account...</h2>
      <p>Please check your email for verification link.</p>
    </div>
  );
};

export default VerifyLoadingPage;