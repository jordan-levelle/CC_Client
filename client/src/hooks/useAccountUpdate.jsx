import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

const useDeleteAccount = () => {
  const { user, dispatch } = useAuthContext();
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const deleteAccount = async (deleteProposals) => {
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteProposals }), // Pass deleteProposals to the server
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }

      // After successful deletion, clear user data
      localStorage.removeItem('user');
      // Dispatch DELETE action to reset user to null
      dispatch({ type: 'DELETE' });
      // Set delete message
      setDeleteMessage('Account deleted successfully');
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
      const response = await fetch('/api/user/updateEmail', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }

      // If update successful, update email in user object in context
      dispatch({ type: 'UPDATE_EMAIL', payload: newEmail });
      // Set update message
      setUpdateMessage('Email updated successfully');
    } catch (error) {
      setUpdateError(error.message);
    }
  };

  return { updateEmail, updateMessage, updateError };
};

export { useDeleteAccount, useUpdateAccount };



