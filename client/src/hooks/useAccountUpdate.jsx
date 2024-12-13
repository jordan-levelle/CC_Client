import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { useLocation } from 'react-router-dom';
import { deleteAccountAPI, updateEmailAPI, resetPasswordAPI } from '../api/users'; // Import the API functions
import { fetchUserSubscription } from 'src/api/stripe';

/* Reset User Password Hook */
const useResetPassword = () => {
  const { user } = useAuthContext();
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');

  const resetPassword = async (oldPassword, newPassword) => {
    try {
      const message = await resetPasswordAPI(user.token, oldPassword, newPassword);
      setResetPasswordMessage(message);
    } catch (error) {
      setResetPasswordError(error.message);
    }
  };

  return { resetPassword, resetPasswordMessage, resetPasswordError };
};

/* Delete User Account Hook */
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

/* Update User Password Hook */
const useUpdateEmail = () => {
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

/* Update User Subscription Hook */
const useSubscriptionUpdate = (dispatch) => {
  const { user } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentSuccess = queryParams.get("payment_success");

    if (paymentSuccess && user) {
      const updateSubscriptionStatus = async () => {
        try {
          const updatedUser = await fetchUserSubscription(user.token);
          dispatch({ type: "UPDATE_SUBSCRIPTION", payload: updatedUser });
          console.log("Subscription updated:", updatedUser);
        } catch (error) {
          console.error("Error updating subscription status:", error);
        }
      };

      updateSubscriptionStatus();
    }
  }, [location.search, user, dispatch]);
};

export { useDeleteAccount, useUpdateEmail, useResetPassword, useSubscriptionUpdate };