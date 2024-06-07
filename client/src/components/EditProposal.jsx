import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEditProposalAPI, updateProposalAPI } from "../api/proposals";
import { useAuthContext } from "../hooks/useAuthContext";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 

const EditProposal = () => {
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
        const proposalData = await fetchEditProposalAPI(uniqueUrl);
        setTitle(proposalData.title || '');
        setDescription(proposalData.description || '');
        setName(proposalData.name || '');
        setEmail(proposalData.email || '');
        setReceiveNotifications(!!proposalData.email);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [uniqueUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProposal = {
      title,
      description,
      name,
      email: receiveNotifications ? (user ? user.email : email) : email // Ensure email is always set
    };

    try {
      const response = await updateProposalAPI(uniqueUrl, updatedProposal);
      setError(null);
      navigate(`/${response.uniqueUrl}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="edit-proposal">
      <h4>Edit Proposal</h4>  
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
            <div>
              <input
                type="checkbox"
                onChange={(e) => setReceiveNotifications(e.target.checked)}
                checked={receiveNotifications}
              />
              <label>Receive response notifications at: {user.email}</label>
            </div>
          ) : (
            <div>
              <label htmlFor="email">Send notifications of new responses to:</label>
              <input 
                id="email"
                type="email" 
                placeholder="Your Email (Optional)" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          )}

          <button>Update Proposal</button>
          {error && <div className="error">{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default EditProposal;