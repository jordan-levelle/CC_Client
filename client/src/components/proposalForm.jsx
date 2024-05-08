import React, { useState, useEffect } from "react";
import { useProposalsContext } from "../hooks/useProposalContext";
import { useVoteContext } from "../hooks/useVoteContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from 'react-router-dom'; 
import { nanoid } from 'nanoid';
import { generateDummyUser } from '../utils/authUtils'; 
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 
import { createProposal } from "../api/proposals";

const ProposalForm = () => {
  const { dispatch } = useProposalsContext();
  const { user } = useAuthContext();
  const { setSelectedProposalId } = useVoteContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [error, setError] = useState(null);

  // Update email state with user's email when checkbox is checked
  useEffect(() => {
    if (user && receiveNotifications) {
      setEmail(user.email);
    }
  }, [user, receiveNotifications]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let currentUser = user || generateDummyUser();
    
    const uniqueUrl = nanoid(10);
    const proposal = { title, 
                       description, 
                       name, 
                       email, 
                       receiveNotifications, 
                       uniqueUrl 
                      };

    try {
      const json = await createProposal(proposal, currentUser.token);
      setError(null);
      setTitle('');
      setDescription('');
      setName('');
      setEmail('');
      dispatch({ type: 'CREATE_PROPOSAL', payload: json });
      setSelectedProposalId(json._id);
      
      const votePageUrl = `/vote/${json.uniqueUrl}`;
      navigate(votePageUrl);
    } catch (error) {
      setError('Error submitting proposal');
      console.error('Error submitting proposal:', error);
    }
  };

  return (
    <div>
      <form className="create" onSubmit={handleSubmit}>
        <div className="proposal-form">
          <label>Title:</label>
          <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} />

          <label>Description:</label>
          <ReactQuill className="quill-editor" value={description} onChange={setDescription} />

          <label>Proposed by:</label>
          <input type="text" placeholder="Your Name (Optional)" onChange={(e) => setName(e.target.value)} value={name} />

          {/* Display email input if user is not logged in */}
          {user ? (
            <div>
              <input type="checkbox" onChange={(e) => setReceiveNotifications(e.target.checked)} />
              <label>Receive response notifications at: {user.email}</label>
            </div>
          ) : (
            <>
              <label>Send notifications of new responses to:</label>
              <input type="email" placeholder="Your Email (Optional)" onChange={(e) => setEmail(e.target.value)} value={email} />
            </>
          )}

          <button>Create Proposal</button>
          {error && <div className="error">{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;



