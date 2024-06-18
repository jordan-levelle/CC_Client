import React, { useState } from 'react';
import { useDeleteAccount, useUpdateAccount } from '../hooks/useAccountUpdate';
import { useAuthContext } from '../hooks/useAuthContext';
// import { useResetPassword } from '../hooks/useForgotPassword';

const EditProfile = () => {
    const { user } = useAuthContext();
    const { deleteAccount, deleteMessage, deleteError } = useDeleteAccount();
    const { updateEmail, updateMessage, updateError } = useUpdateAccount();
    // TODO
    // const { resetPassword, resetPasswordError } = useResetPassword();

    const [email, setEmail] = useState(user.email);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false); // State to control visibility of confirmation popup
    const [deleteProposals, setDeleteProposals] = useState(false); // State to store checkbox value

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
        setShowConfirmation(true); // Show the confirmation popup
    };

    const cancelDeleteAccount = () => {
        setShowConfirmation(false); // Hide the confirmation popup
    };

    const proceedToDeleteAccount = () => {
        // Pass deleteProposals to deleteAccount function
        deleteAccount(deleteProposals);
        setShowConfirmation(false); // Hide the confirmation popup after deletion
    };

    const handleResetPassword = async (e) => {
       alert('Consensus Check is developing this feature');
    };



    return (
        <div className='settings-container'>
            <h3>Account Settings</h3>
            <div className='edit-profile'>
                <div className="edit-email-row">
                    <p>Update Email:</p>
                    <input
                        className="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleEmailChange}>Update</button>
                    {error && <div className='error'>{error}</div>}
                    {updateMessage && <p>{updateMessage}</p>}
                    {updateError && <p>{updateError}</p>}
                </div>
                <div className="edit-email-row">
                    <p>Reset Password:</p>
                    
                    <button onClick={handleResetPassword}>Reset</button>
                    {error && <div className='error'>{error}</div>}
                    {updateMessage && <p>{updateMessage}</p>}
                    {updateError && <p>{updateError}</p>}
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








