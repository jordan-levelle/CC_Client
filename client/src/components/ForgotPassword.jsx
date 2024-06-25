import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetForgotPassword } from 'src/api/users';

const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
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
        <label htmlFor="new-password">New Password:</label>
        <input
          type="password"
          id="new-password"
          name="newPassword"
          value={newPassword}
          onChange={handlePasswordChange}
          required
        />
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;