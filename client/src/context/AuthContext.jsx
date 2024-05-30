import { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { user: null }; // Reset the user to null after logout
    case 'DELETE':
      localStorage.removeItem('user'); // Clear user from localStorage
      return { user: null }; // Reset the user to null after deletion
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (token) {
      // Dispatch a login action with the token payload
      dispatch({ type: 'LOGIN', payload: { token } });
    }
  
    if (user) {
      // Dispatch a login action with the user payload
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
