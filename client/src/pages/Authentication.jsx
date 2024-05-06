import React, { useState } from 'react';
import Signup from '../components/Signup';
import Login from '../components/Login';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(prevState => !prevState);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      {isLogin ? <Login /> : <Signup />}
      <p>
        {isLogin
          ? "Don't have an account? "
          : "Already have an account? "}
        <button onClick={handleToggle}>
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;