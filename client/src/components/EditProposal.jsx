import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEditProposalAPI, updateProposalAPI } from "../api/proposals";
import { useAuthContext } from "../hooks/useAuthContext";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 

const EditProposal = ({ onUpdate, onClose, isModal }) => {
  const { uniqueUrl } = useParams(); 
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { proposal } = await fetchEditProposalAPI(uniqueUrl);
        setTitle(proposal.title || '');
        setDescription(proposal.description || '');
        setName(proposal.name || '');
        setEmail(proposal.email || '');
        setReceiveNotifications(!!proposal.email);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
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

      if (isModal) {
        onUpdate(response); 
        onClose(); 
      } else {
        navigate(`/${response.uniqueUrl || uniqueUrl}`);
      }
    } catch {
      setError('Failed to update proposal');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setReceiveNotifications(!!e.target.value);
  };

  return (
    <div className={isModal ? 'modal-form-container' : 'form-container'}>
      <div className="edit-proposal">
        <h4>{isModal ? "Edit Proposal in Modal" : "Edit Proposal on Main Page"}</h4>
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
