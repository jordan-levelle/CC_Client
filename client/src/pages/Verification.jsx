import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Verification = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_USERS_URL}/verify/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        let data;

        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus(data?.error || 'error');
        }
      } catch (error) {
        setVerificationStatus('error');
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();

    const timeoutId = setTimeout(() => {
      if (verificationStatus === 'success') {
        navigate('/auth'); // Change this to your actual login route
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [token, verificationStatus, navigate]);

  return (
    <div>
      {loading && <p>Verifying your account, please wait...</p>}
      {verificationStatus === 'success' && <p>Thank you. Your account has been verified. You will be redirected to the login page shortly.</p>}
      {verificationStatus === 'error' && <p>There was an error verifying your account. Please try again later.</p>}
    </div>
  );
};

export default Verification;

