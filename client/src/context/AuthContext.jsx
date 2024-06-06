import { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { user: null };
    case 'DELETE':
      localStorage.removeItem('user');
      return { user: null };
    case 'UPDATE_EMAIL':
      return { ...state, user: { ...state.user, email: action.payload } };
    case 'RESET_PASSWORD':
      // No state change needed for password reset
      return state;
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (token) {
      dispatch({ type: 'LOGIN', payload: { token } });
    }
  
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};