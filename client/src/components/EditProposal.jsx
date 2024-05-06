import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 

const EditProposal = () => {
  const { uniqueUrl } = useParams(); // Get unique URL parameter
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
        const response = await fetch(`/api/proposals/${uniqueUrl}`);
        if (!response.ok) {
          throw new Error('Failed to fetch proposal');
        }
        const proposalData = await response.json();
        setTitle(proposalData.title || '');
        setDescription(proposalData.description || '');
        setName(proposalData.name || '');
        setEmail(proposalData.email || '');
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
      email,
      receiveNotifications
    };
  
    try {
      const response = await fetch(`/api/proposals/${uniqueUrl}`, {
        method: 'PUT',
        body: JSON.stringify(updatedProposal),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized: Please log in to update the proposal.');
        } else {
          setError('Error submitting proposal');
        }
        console.error('Error response:', response);
        return;
      }
  
      const json = await response.json();
  
      if (response.ok) {
        setError(null);
        setTitle('');
        setDescription('');
        setName('');
        const votePageUrl = `/vote/${json.uniqueUrl}`;
        navigate(votePageUrl);
      }
  
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
            <label>Receive response notifications at: {email}</label>
          </div>

          <button>Update Proposal</button>
          {error && <div className="error">{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default EditProposal;


