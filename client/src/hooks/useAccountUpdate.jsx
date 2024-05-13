import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { deleteAccountAPI, updateEmailAPI } from '../api/users'; // Import the API functions

const useDeleteAccount = () => {
  const { user, dispatch } = useAuthContext();
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const deleteAccount = async (deleteProposals) => {
    try {
      const message = await deleteAccountAPI(user.token, deleteProposals);
      // After successful deletion, clear user data
      localStorage.removeItem('user');
      // Dispatch DELETE action to reset user to null
      dispatch({ type: 'DELETE' });
      // Set delete message
      setDeleteMessage(message);
      // Redirect to authentication page programmatically
      window.location.href = '/auth';
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  return { deleteAccount, deleteMessage, deleteError };
};

const useUpdateAccount = () => {
  const { user, dispatch } = useAuthContext();
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');

  const updateEmail = async (newEmail) => {
    try {
      const message = await updateEmailAPI(user.token, newEmail);
      // If update successful, update email in user object in context
      dispatch({ type: 'UPDATE_EMAIL', payload: newEmail });
      // Set update message
      setUpdateMessage(message);
    } catch (error) {
      setUpdateError(error.message);
    }
  };

  return { updateEmail, updateMessage, updateError };
};

export { useDeleteAccount, useUpdateAccount };



