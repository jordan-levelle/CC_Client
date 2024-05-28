import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 
import { fetchEditProposalAPI, updateProposalAPI } from "../api/proposals";
const EditProposal = () => {
  const { uniqueUrl } = useParams(); // Get unique URL parameter
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proposalData = await fetchEditProposalAPI(uniqueUrl);
        setTitle(proposalData.title || '');
        setDescription(proposalData.description || '');
        setName(proposalData.name || '');
        setReceiveNotifications(proposalData.receiveNotifications || false);
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
      receiveNotifications
    };

    try {
      const response = await updateProposalAPI(uniqueUrl, updatedProposal);
      setError(null);
      setTitle('');
      setDescription('');
      setName('');
      const votePageUrl = `/${response.uniqueUrl}`;
      navigate(votePageUrl);
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

          <div>
            <input
              type="checkbox"
              onChange={(e) => setReceiveNotifications(e.target.checked)}
              checked={receiveNotifications}
            />
            <label>Receive response notifications</label>
          </div>

          <button>Update Proposal</button>
          {error && <div className="error">{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default EditProposal;

