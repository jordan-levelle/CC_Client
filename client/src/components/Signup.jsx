import React, { useState, useEffect } from 'react';
import { passwordCriteria } from '../constants/TextConstants'
import { useSignup } from '../hooks/useSignup';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { Navigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const { signup, 
          validatePassword, 
          validateEmail, 
          verificationPending, 
          error, 
          isLoading, 
          passwordErrors, 
          emailError} = useSignup();

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    validateEmail(email);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    // Trigger password validation
    validatePassword(password);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

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
            <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} required />
            {emailError && <div className="error">{emailError}</div>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} required />
          <ul className="password-criteria">
          Minumum of:
          <li className="password-criteria-list">
            
              {passwordCriteria.map((criterion, index) => (
                <React.Fragment key={criterion.key}>
                  <span
                    className={passwordErrors[criterion.key] ? 'valid' : 'invalid'}
                  >
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
          <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPassword} required />
        </div>
        <div>
          <label htmlFor="captchaInput">Enter CAPTCHA:</label>
          <LoadCanvasTemplate />
          <input
            type="text"
            id="captchaInput"
            name="captchaInput"
            placeholder="Enter CAPTCHA"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            tabIndex="6"
            aria-label="CAPTCHA"
          />
        </div>
        <button type="submit" disabled={isLoading}>Sign up</button>
        {error && <div className="error">{error}</div>}
      </form>
      <style jsx>{`
        .password-criteria {
          list-style-type: none;
          padding: 0;
        }
        .password-criteria li {
          font-size: 0.9rem;
          margin: 4px 0;
        }
        .password-criteria .valid {
          color: green;
        }
        .password-criteria .invalid {
          color: red;
        }
      `}</style>
    </div>
  );
};

export default Signup;