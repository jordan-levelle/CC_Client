import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useAuthContext } from './useAuthContext';

export const useTokenExpiryCheck = () => {
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch({ type: 'LOGOUT' });
        window.location.href = '/auth';
      }
    }
  }, [dispatch]);
};