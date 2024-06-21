import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { sendForgotPasswordLinkAPI } from 'src/api/users';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [apiError, setApiError] = useState(null); // State for API errors
  const { login, error, isLoading } = useLogin();


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      setIsLinkSent(true);
      setEmail('');

      try {
        await sendForgotPasswordLinkAPI(email);
        setApiError(null); // Reset any previous errors
      } catch (error) {
        setApiError('Failed to send reset link. Please try again.');
      }
      

      
    } else {
      await login(email, password);
      setPassword('');
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsLinkSent(false); // Reset the link sent state when switching to forgot password
  };

  return (
    <div className="auth-container">
      <h2>{isForgotPassword ? 'Forgot Password' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        {!isForgotPassword && (
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
        )}
        <div>
          <button type="submit" disabled={isLoading}>
            {isForgotPassword ? 'Send Reset Link' : 'Log in'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {apiError && <div className="error">{apiError}</div>}
      </form>
      {!isForgotPassword && (
        <div className="forgot-password" onClick={handleForgotPassword}>
          Forgot password
        </div>
      )}
      {isForgotPassword && isLinkSent && (
        <div className="confirmation-message">
          Check your email for the reset link.
        </div>
      )}
    </div>
  );
};

export default Login;
