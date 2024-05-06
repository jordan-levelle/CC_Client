import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

const VerificationPage = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  // const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(`/api/user/verify/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (response.ok) {
          setMessage('Your account has been successfully verified.');
        } else {
          setMessage('Failed to verify your account. Please try again later.');
        }
      } catch (error) {
        console.error('Error verifying account:', error);
        setMessage('An error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>{message}</p>
          {/* <button onClick={() => navigate('/login')}>
            Go to Login Page
          </button> */}
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
