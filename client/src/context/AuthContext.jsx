import { createContext, useEffect, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
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
      const decodedToken = jwtDecode(token);

      // Check if the token has expired
      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch({ type: 'LOGOUT' });
        window.location.href = '/auth'; // Redirect to login page
      } else {
        dispatch({ type: 'LOGIN', payload: { token } });
      }
    }

    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }

    // Check token expiry every minute
    const interval = setInterval(() => {
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          dispatch({ type: 'LOGOUT' });
          window.location.href = '/auth'; // Redirect to login page
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};