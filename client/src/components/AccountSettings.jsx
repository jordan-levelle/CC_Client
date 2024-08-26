import React, { useState } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { useSignup } from '../hooks/useSignup';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDeleteAccount, useUpdateAccount, useResetPassword } from '../hooks/useAccountUpdate';
import { cancelUserSubscription } from '../api/users';

const AccountSettings = () => {
  const [key, setKey] = useState('profile');
  const { user, isSubscribed, dispatch } = useAuthContext();
  const { deleteAccount, deleteMessage, deleteError } = useDeleteAccount();
  const { updateEmail, updateMessage, updateError } = useUpdateAccount();
  const { resetPassword, resetPasswordMessage, resetPasswordError } = useResetPassword();
  const { validatePassword, passwordErrors } = useSignup();

  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteProposals, setDeleteProposals] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const confirmDeleteAccount = () => {
    setShowConfirmation(true);
  };

  const cancelDeleteAccount = () => {
    setShowConfirmation(false);
  };

  const proceedToDeleteAccount = () => {
    deleteAccount(deleteProposals);
    setShowConfirmation(false);
  };

  const handleCancelSubscription = async () => {
    try {
      const data = await cancelUserSubscription(user.token);

      if (data.subscriptionStatus === false) {
        dispatch({ type: 'UPDATE_SUBSCRIPTION_STATUS', payload: false });
        setShowCancelConfirmation(false);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const confirmCancelSubscription = () => {
    setShowCancelConfirmation(true);
  };

  const cancelCancelSubscription = () => {
    setShowCancelConfirmation(false);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      await updateEmail(email);
      setEmail('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const isValidPassword = validatePassword(newPassword);

    if (!isValidPassword) {
      setError('Password does not meet criteria.');
      return;
    }
    try {
      await resetPassword(oldPassword, newPassword);
      setShowResetPassword(false);
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewPasswordChange = (e) => {
    const sanitizedNewPassword = e.target.value;
    setNewPassword(sanitizedNewPassword);
    validatePassword(sanitizedNewPassword);
  };

  const cancelResetPassword = () => {
    setShowResetPassword(false);
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="row gutters-sm">
      <div className="col-md-4 d-none d-md-block">
        <div className="card">
          <div className="card-body">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link
                  eventKey="profile"
                  onClick={() => setKey('profile')}
                  className={key === 'profile' ? 'active' : ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user mr-2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile Information
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="account"
                  onClick={() => setKey('account')}
                  className={key === 'account' ? 'active' : ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings mr-2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Account Settings
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="security"
                  onClick={() => setKey('security')}
                  className={key === 'security' ? 'active' : ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield mr-2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Security
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="notification"
                  onClick={() => setKey('notification')}
                  className={key === 'notification' ? 'active' : ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell mr-2">
                    <path d="M18 16v-6a6 6 0 0 0-12 0v6l-2 2v1h16v-1l-2-2z"></path>
                    <path d="M13 21h-2a2 2 0 0 1-2-2h6a2 2 0 0 1-2 2z"></path>
                  </svg>
                  Notifications
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                {/* Profile Information Section */}
                <h4>Profile Information</h4>
                <p>Details about the user's profile.</p>
              </Tab.Pane>
              <Tab.Pane eventKey="account">
                <h4>Account Settings</h4>

                {/* Email Update Section */}
                <form onSubmit={handleEmailChange}>
                  <div className="form-group">
                    <label htmlFor="email">Update Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Email</button>
                </form>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                {updateMessage && <div className="alert alert-success mt-2">{updateMessage}</div>}
                {updateError && <div className="alert alert-danger mt-2">{updateError}</div>}
                
                {/* Reset Password Section */}
                <button
                  className="btn btn-secondary mt-3"
                  onClick={() => setShowResetPassword(true)}
                >
                  Reset Password
                </button>
                {showResetPassword && (
                  <div className="mt-3">
                    <form onSubmit={handleResetPassword}>
                      <div className="form-group">
                        <label htmlFor="oldPassword">Old Password</label>
                        <input
                          type="password"
                          id="oldPassword"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={handleNewPasswordChange}
                          className="form-control"
                          required
                        />
                        {passwordErrors && <div className="text-danger mt-1">{passwordErrors}</div>}
                      </div>
                      <button type="submit" className="btn btn-primary">Reset Password</button>
                      <button
                        type="button"
                        className="btn btn-secondary ml-2"
                        onClick={cancelResetPassword}
                      >
                        Cancel
                      </button>
                    </form>
                    {resetPasswordMessage && <div className="alert alert-success mt-2">{resetPasswordMessage}</div>}
                    {resetPasswordError && <div className="alert alert-danger mt-2">{resetPasswordError}</div>}
                  </div>
                )}

                {/* Delete Account Section */}
                <button
                  className="btn btn-danger mt-3"
                  onClick={confirmDeleteAccount}
                >
                  Delete Account
                </button>
                {showConfirmation && (
                  <div className="mt-3">
                    <div className="alert alert-warning">
                      Are you sure you want to delete your account? This action cannot be undone.
                      <div className="mt-2">
                        <input
                          type="checkbox"
                          checked={deleteProposals}
                          onChange={() => setDeleteProposals(!deleteProposals)}
                        />
                        <label className="ml-2">Delete all my proposals</label>
                      </div>
                      <div className="mt-2">
                        <button
                          className="btn btn-danger"
                          onClick={proceedToDeleteAccount}
                        >
                          Yes, Delete
                        </button>
                        <button
                          className="btn btn-secondary ml-2"
                          onClick={cancelDeleteAccount}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscription Section */}
                {isSubscribed ? (
                  <>
                    <p>Your subscription is active.</p>
                    <button
                      className="btn btn-danger mt-3"
                      onClick={confirmCancelSubscription}
                    >
                      Cancel Subscription
                    </button>
                    {showCancelConfirmation && (
                      <div className="mt-3">
                        <div className="alert alert-warning">
                          Are you sure you want to cancel your subscription?
                          <div className="mt-2">
                            <button
                              className="btn btn-danger"
                              onClick={handleCancelSubscription}
                            >
                              Yes, Cancel
                            </button>
                            <button
                              className="btn btn-secondary ml-2"
                              onClick={cancelCancelSubscription}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                  </>
                ) : (
                  <p>You do not have an active subscription.</p>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="security">
                <h4>Security</h4>
                <p>Details about the user's security settings.</p>
              </Tab.Pane>
              <Tab.Pane eventKey="notification">
                <h4>Notifications</h4>
                <p>Details about the user's notification settings.</p>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;


