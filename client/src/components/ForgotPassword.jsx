import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetForgotPassword } from 'src/api/users';
import { passwordCriteria } from '../constants/Constants';
import DOMPurify from 'dompurify';
import { useSignup } from '../hooks/useSignup'; // Import the hook that contains validatePassword logic

const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Access the password validation logic from useSignup
  const { validatePassword, passwordErrors } = useSignup();

  const handlePasswordChange = (e) => {
    const sanitizedPassword = DOMPurify.sanitize(e.target.value);
    setNewPassword(sanitizedPassword);
    validatePassword(sanitizedPassword); // Validate password
    setPasswordMatch(sanitizedPassword === confirmPassword); // Match passwords
  };

  const handleConfirmPasswordChange = (e) => {
    const sanitizedConfirmPassword = DOMPurify.sanitize(e.target.value);
    setConfirmPassword(sanitizedConfirmPassword);
    setPasswordMatch(newPassword === sanitizedConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!passwordMatch) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await resetForgotPassword(token, newPassword);
      setMessage(response.message);
      setTimeout(() => navigate('/auth'), 3000); // Redirect to login page after 3 seconds
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token.');
    }
  }, [token]);

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            required
          />
          <ul className="password-criteria">
            <li className="password-criteria-list">
              {passwordCriteria.map((criterion, index) => (
                <React.Fragment key={criterion.key}>
                  <span className={passwordErrors[criterion.key] ? 'valid' : 'invalid'}>
                    {criterion.label}
                  </span>
                  {index !== passwordCriteria.length - 1 && <span> </span>}
                </React.Fragment>
              ))}
            </li>
          </ul>
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          {!passwordMatch && <div className="error small-text">Passwords do not match</div>}
        </div>
        <button
          className='medium-button' 
          type="submit" 
          disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
