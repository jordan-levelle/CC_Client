import React, { useState, useEffect } from 'react';
import { passwordCriteria } from '../constants/Constants';
import { useSignup } from '../hooks/useSignup';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { Navigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import '../styles/components/authentication.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const { signup, 
          validatePassword, 
          validateEmail, 
          verificationPending, 
          error, 
          isLoading, 
          passwordErrors, 
          emailError } = useSignup();

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleEmailChange = (e) => {
    const sanitizedEmail = DOMPurify.sanitize(e.target.value);
    setEmail(sanitizedEmail);
    validateEmail(sanitizedEmail);
  };

  const handlePasswordChange = (e) => {
    const sanitizedPassword = DOMPurify.sanitize(e.target.value);
    setPassword(sanitizedPassword);
    validatePassword(sanitizedPassword);
    setPasswordMatch(sanitizedPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const sanitizedConfirmPassword = DOMPurify.sanitize(e.target.value);
    setConfirmPassword(sanitizedConfirmPassword);
    setPasswordMatch(password === sanitizedConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCaptcha(captchaInput)) {
      alert('Invalid CAPTCHA');
      return;
    }

    await signup(email, password);
  };

  if (verificationPending) {
    const verificationToken = localStorage.getItem('verificationToken');
    return <Navigate to={`/verify-loading/${verificationToken}`} />;
  }

  return (
    <div className='auth-container'>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            className='input-field' 
            value={email} 
            onChange={handleEmailChange} 
            required />
          {emailError && <div className="error small-text">{emailError}</div>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password"
            className='input-field'  
            value={password} 
            onChange={handlePasswordChange} 
            required />
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
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword"
            className='input-field'  
            value={confirmPassword} 
            onChange={handleConfirmPasswordChange} 
            required />
          {!passwordMatch && <div className="error small-text">Passwords do not match</div>}
        </div>
        <div>
          <label htmlFor="captchaInput">Enter CAPTCHA:</label>
          <LoadCanvasTemplate />
          <input
            type="text"
            id="captchaInput"
            name="captchaInput"
            className='input-field' 
            placeholder="Enter CAPTCHA"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(DOMPurify.sanitize(e.target.value))}
            tabIndex="6"
            aria-label="CAPTCHA"
          />
        </div>
        <button
        className='medium-button' 
          type="submit" 
          disabled={isLoading}>Sign up
        </button>
        {error && <div className="error small-text">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;