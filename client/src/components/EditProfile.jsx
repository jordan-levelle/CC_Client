import React, { useState } from 'react';
import { passwordCriteria } from '../constants/Constants';
import { useSignup } from '../hooks/useSignup';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDeleteAccount, useUpdateAccount, useResetPassword } from '../hooks/useAccountUpdate';
import { cancelUserSubscription } from '../api/users';
import Modal from './PopupOverlay'; 
import '../styles/components/editprofile.css';


const EditProfile = () => {
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
   const [showUpdateEmail, setShowUpdateEmail] = useState(false); // New state for email update modal
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


   const handleEmailUpdate = async () => {
       try {
           await updateEmail(email);
           setEmail('');
           setShowUpdateEmail(false); // Close modal after successful update
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
       <div className='page-container'>    
           <div className='component-container-1'>
               <h3>Account Settings</h3>


               <div className="edit-userInfo-rows">
                   <p>Update Email:</p>
                   <button className="small-button" onClick={() => setShowUpdateEmail(true)}>Update</button>
               </div>


               {/* Update Email Modal */}
               <Modal isOpen={showUpdateEmail} onClose={() => setShowUpdateEmail(false)}>
                   <div>
                       <label className="email-label">
                           <p>Enter New Email:</p>
                           <input
                               id="email"
                               className="input-field"
                               type="email"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               aria-label='Enter your email'
                           />
                       </label>
                       {error && <div className='error'>{error}</div>}
                       {updateMessage && <p>{updateMessage}</p>}
                       {updateError && <p>{updateError}</p>}
                       <button className="medium-button" onClick={handleEmailUpdate}>Update Email</button>
                   </div>
               </Modal>


               <div className="edit-userInfo-rows">
                   <p>Reset Password:</p>
                   <button className="small-button" onClick={() => setShowResetPassword(true)}>Reset</button>
                   {resetPasswordMessage && <p>{resetPasswordMessage}</p>}
                   {resetPasswordError && <p>{resetPasswordError}</p>}


                   {/* Reset Password Modal */}
                   <Modal isOpen={showResetPassword} onClose={cancelResetPassword}>
                       <label className="password-label">
                           <p>Please Enter Your Old Password: </p>
                           <input
                               id='oldPassword'
                               className="input-field"
                               type="password"
                               value={oldPassword}
                               onChange={(e) => setOldPassword(e.target.value)}
                               aria-label='Enter Old Password'
                           />
                       </label>
                       <label className="password-label">
                           <p>Please Enter Your New Password: </p>
                           <input
                               id='newPassword'
                               className="input-field"
                               type="password"
                               value={newPassword}
                               onChange={handleNewPasswordChange}
                               aria-label='Enter New Password'
                           />
                           <ul className="password-criteria">
                               {passwordCriteria.map((criterion, index) => (
                                   <React.Fragment key={criterion.key}>
                                       <span className={passwordErrors[criterion.key] ? 'valid' : 'invalid'}>
                                           {criterion.label}
                                       </span>
                                       {index !== passwordCriteria.length - 1 && <span> </span>}
                                   </React.Fragment>
                               ))}
                           </ul>
                       </label>
                       {error && <div className='error'>{error}</div>}
                       {updateMessage && <p>{updateMessage}</p>}
                       {updateError && <p>{updateError}</p>}
                       <button className="medium-button" onClick={handleResetPassword}>Reset Password</button>
                   </Modal>
               </div>


               <button className='medium-button red' onClick={confirmDeleteAccount}>Delete Account</button>
               {deleteMessage && <p>{deleteMessage}</p>}
               {deleteError && <p>{deleteError}</p>}


               {/* Delete Account Modal */}
               <Modal isOpen={showConfirmation} onClose={cancelDeleteAccount}>
                   <div className='modal-content'>
                       <div className='delete-account-content'>
                       <label>
                           <p>Would you like to delete all proposals associated with this account?</p>
                           <input
                               type="radio"
                               id="deleteProposalsYes"
                               name="deleteProposals"
                               checked={deleteProposals}
                               onChange={() => setDeleteProposals(true)}
                               style={{ marginRight: '5px' }}
                              
                           />
                           <label style={{ marginRight: '5px' }} htmlFor="deleteProposalsYes">Yes</label>
                          
                           <input
                               type="radio"
                               id="deleteProposalsNo"
                               name="deleteProposals"
                               checked={!deleteProposals}
                               onChange={() => setDeleteProposals(false)}
                               style={{ marginLeft: '5px' }}
                           />
                           <label style={{ marginLeft: '5px' }} htmlFor="deleteProposalsNo">No</label>
                       </label>
                           <p>Are you sure you want to delete your account?</p>
                           <button className='small-button' onClick={proceedToDeleteAccount}>Yes</button>
                           <button className='small-button' onClick={cancelDeleteAccount}>No</button>
                       </div>
                   </div>
               </Modal>




               {/* Cancel Subscription Modal */}
               {isSubscribed && (
                   <button className='medium-button' onClick={confirmCancelSubscription}>Cancel Subscription</button>
               )}
               <Modal isOpen={showCancelConfirmation} onClose={cancelCancelSubscription}>
                   <p>Are you sure you want to cancel your subscription?</p>
                   <button className='small-button' onClick={handleCancelSubscription}>Yes</button>
                   <button className='small-button' onClick={cancelCancelSubscription}>No</button>
               </Modal>


               {error && <p className="error">{error}</p>}
           </div>
       </div>
   );
};


export default EditProfile;