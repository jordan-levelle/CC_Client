import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DropzoneUploader from './DropzoneUploader';
import { fetchEditProposalAPI, updateProposalAPI } from "../api/proposals";
import { removeDocument, uploadDocument } from 'src/api/documents';
import { useAuthContext } from "../hooks/useAuthContext";
import ReactQuill from 'react-quill'; 
import { showSuccessToast, showErrorToast } from "src/utils/toastNotifications";
import 'react-quill/dist/quill.snow.css'; 

const EditProposal = ({ onUpdate, onClose, isModal }) => {
  const { uniqueUrl } = useParams(); 
  const { user, isSubscribed } = useAuthContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposalAndDocuments = async () => {
      try {
        const { proposal, documents } = await fetchEditProposalAPI(uniqueUrl);
        setTitle(proposal.title || '');
        setDescription(proposal.description || '');
        setName(proposal.name || '');
        setEmail(proposal.email || '');
        setReceiveNotifications(!!proposal.email);
  
        // Set the first document (if any) to `uploadedFile`
        if (documents?.length > 0) {
          setUploadedFile(documents[0]); // Use the first document if available
        }
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchProposalAndDocuments();
  }, [uniqueUrl]);
  
  

  useEffect(() => {
    if (user) {
      setReceiveNotifications(!!email);
    }
  }, [email, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedProposal = {
      title,
      description,
      name,
      email: receiveNotifications ? (user ? user.email : email) : '', 
    };
  
    try {
      const response = await updateProposalAPI(uniqueUrl, updatedProposal, user.token);
  
      // Upload the new file if it exists
      if (uploadedFile && uploadedFile instanceof File) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        await uploadDocument(response._id, formData); // Replace with your API call
      }
  
      // Handle modal close or navigation
      if (isModal) {
        onUpdate(response);
        onClose();
      } else {
        navigate(`/${response.uniqueUrl || uniqueUrl}`);
      }
  
      showSuccessToast('proposalUpdateSuccess');
    } catch {
      setError('Failed to update proposal');
      showErrorToast('proposalUpdateError');
    }
  };
  

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setReceiveNotifications(!!e.target.value);
  };

  return (
    <div className='form-container'>
      <div className="edit-proposal">
      <h4 style={{ textAlign: 'center' }}>Edit Proposal</h4>
        <form className="edit" onSubmit={handleSubmit}>
          <div className="proposal-form">
            <label>Title:</label>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <label>Description:</label>
            <ReactQuill
              className="quill-editor"
              value={description}
              onChange={(value) => setDescription(value)}
            />

          {isSubscribed ? (
            <DropzoneUploader 
            onFileUpload={setUploadedFile}
            initialFile={uploadedFile} 
            canCancel={true}
            onFileRemove={async (file) => {
              try {
                await removeDocument(file._id);
                setUploadedFile(null);
              } catch (error) {
                console.error('Failed to remove document:', error);
              }
            }}
          />          
          ) : null}

            <label>Proposed by:</label>
            <input
              type="text"
              placeholder="Your Name (Optional)"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            {user ? (
              <div style={{ paddingTop: '5px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  onChange={(e) => setReceiveNotifications(e.target.checked)}
                  checked={receiveNotifications}
                />
                <label>Receive Email Notifications</label>
              </div>
            ) : (
              <div>
                <label htmlFor="email">Send notifications of new responses to:</label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="Your Email (Optional)" 
                  onChange={handleEmailChange}
                  value={email}
                />
              </div>
            )}
            <button>Update Proposal</button>
            {error && <div className="error">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProposal;


