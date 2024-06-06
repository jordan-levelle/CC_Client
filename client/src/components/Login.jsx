import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
// import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router-dom

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();
  // const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleForgotPassword = () => {
    alert('This feature is in testing.')
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
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
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <button disabled={isLoading}>Log in</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="forgot-password" onClick={handleForgotPassword}>
        Forgot password
      </div>
    </div>
  );
};

export default Login;
