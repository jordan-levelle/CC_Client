import React, { createContext, useEffect, useReducer, useState } from 'react';
import { jwtDecode } from 'jwt-decode';  // Make sure you import this correctly

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isSubscribed: action.payload.subscriptionStatus };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { ...state, user: null, isSubscribed: false };
    case 'UPDATE_EMAIL':
      return { ...state, user: { ...state.user, email: action.payload } };
    case 'UPDATE_SUBSCRIPTION_STATUS':
      return { ...state, isSubscribed: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isSubscribed: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch({ type: 'LOGOUT' });
      } else {
        if (user) {
          dispatch({ type: 'LOGIN', payload: user });
        }
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};