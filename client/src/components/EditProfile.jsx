import React, { useState } from 'react';
import { useDeleteAccount, useUpdateAccount, useResetPassword } from '../hooks/useAccountUpdate';
import { useAuthContext } from '../hooks/useAuthContext';


const EditProfile = () => {
    const { user } = useAuthContext();
    const { deleteAccount, deleteMessage, deleteError } = useDeleteAccount();
    const { updateEmail, updateMessage, updateError } = useUpdateAccount();
    const { resetPassword, resetPasswordMessage, resetPasswordError } = useResetPassword();

    const [email, setEmail] = useState(user.email);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false); 
    const [deleteProposals, setDeleteProposals] = useState(false); 
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleEmailChange = async (e) => {
        e.preventDefault();

        try {
            await updateEmail(email);
            setEmail('');
        } catch (error) {
            setError(error.message);
        }
    };

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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(oldPassword, newPassword);
            setShowResetPassword(false);
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            setError(error.message);
        }
    };

    const cancelResetPassword = () => {
        setShowResetPassword(false);
        setOldPassword('');
        setNewPassword('');
    };

    return (
        <div className='settings-container'>
            <h3>Account Settings</h3>
            <div className='edit-profile'>
                <div className="edit-userInfo-rows">
                    <p>Update Email:</p>
                    <input
                        className="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="edit-userInfo-buttons" onClick={handleEmailChange}>Update</button>
                    
                </div>

                <div className="edit-userInfo-rows">
                <p>Reset Password:</p>
                <button className="edit-userInfo-buttons" onClick={() => setShowResetPassword(true)}>Reset</button>
                    {resetPasswordMessage && <p>{resetPasswordMessage}</p>}
                    {resetPasswordError && <p>{resetPasswordError}</p>}
                    {showResetPassword && (
                        <div className="reset-password-popup">
                            <button className="close-button" onClick={cancelResetPassword}>X</button>
                            <label className="password-label">
                                <p>Please Enter Your Old Password: </p>
                                <input
                                    className="password-input"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </label>
                            <label className="password-label">
                                <p>Please Enter Your New Password: </p>
                                <input
                                    className="password-input"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </label>
                            {error && <div className='error'>{error}</div>}
                            {updateMessage && <p>{updateMessage}</p>}
                            {updateError && <p>{updateError}</p>}
                            <button className="confirm-button" onClick={handleResetPassword}>Reset Password</button>
                        </div>
                    )}
                </div>

                <button className='delete-button' onClick={confirmDeleteAccount}>Delete Account</button>
                {deleteMessage && <p>{deleteMessage}</p>}
                {deleteError && <p>{deleteError}</p>}
                {showConfirmation && (
                    <div className="confirmation-popup">
                        <div className="confirmation-content">
                            <label>
                                <p>Would you like to delete all proposals associated with this account?</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <input
                                        type="radio"
                                        id="deleteProposalsYes"
                                        name="deleteProposals"
                                        checked={deleteProposals}
                                        onChange={() => setDeleteProposals(true)}
                                        style={{ marginRight: '5px' }}
                                    />
                                    <label htmlFor="deleteProposalsYes" style={{ marginRight: '15px' }}>Yes</label>
                                    <input
                                        type="radio"
                                        id="deleteProposalsNo"
                                        name="deleteProposals"
                                        checked={!deleteProposals}
                                        onChange={() => setDeleteProposals(false)}
                                        style={{ marginRight: '5px' }}
                                    />
                                    <label htmlFor="deleteProposalsNo">No</label>
                                </div>
                            </label>
                            <p>Are you sure you want to delete your account?</p>
                            <button onClick={proceedToDeleteAccount}>Yes</button>
                            <button onClick={cancelDeleteAccount}>No</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditProfile;








