import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Verification = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_USERS}/verify/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Error verifying account:', error);
        setVerificationStatus('error');
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div>
      {verificationStatus === 'success' && <p>Thank you. Your account has been verified. Please return to your browser to login.</p>}
      {verificationStatus === 'error' && <p>There was an error verifying your account. Please try again later.</p>}
    </div>
  );
};


export default Verification;