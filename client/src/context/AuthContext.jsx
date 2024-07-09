import React, { createContext, useEffect, useReducer, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { ...state, user: null };
    case 'UPDATE_EMAIL':
      return { ...state, user: { ...state.user, email: action.payload } };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
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
        dispatch({ type: 'LOGIN', payload: user });
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