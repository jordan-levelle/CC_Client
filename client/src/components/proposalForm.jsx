import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { createProposal } from "../api/proposals";
import { useProposalsContext } from "../hooks/useProposalContext";
import { useVoteContext } from "../hooks/useVoteContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from 'react-router-dom'; 
import { nanoid } from 'nanoid';
import { generateDummyUser } from '../utils/authUtils'; 

const ProposalForm = () => {
  const { dispatch } = useProposalsContext();
  const { user } = useAuthContext();
  const { setSelectedProposalId } = useVoteContext();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const proposedByInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    register("description", { required: true });
  }, [register]);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus(); // Focus on title input when component mounts
    }
  }, []);

  const handleTitleKeyPress = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (descriptionInputRef.current) {
        descriptionInputRef.current.focus(); // Focus on description input when Tab key is pressed
      }
    }
  };

  const handleDescriptionKeyPress = (event) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      if (proposedByInputRef.current) {
        proposedByInputRef.current.focus(); // Focus on proposed by input when Tab key is pressed
      }
    }
  };

  const onEditorStateChange = (content) => {
    setValue("description", content);
  };

  const onSubmit = async (data) => {
    try {
      if (!data.title.trim() || !data.description.trim()) {
        throw new Error('Title and description are required');
      }

      const currentUser = user || generateDummyUser();
      const uniqueUrl = nanoid(10);
      const proposal = { ...data, uniqueUrl, isFirstCreation: true };
      console.log("State of isFirstCreation: ", proposal.isFirstCreation)

      const json = await createProposal(proposal, currentUser.token);
      dispatch({ type: 'CREATE_PROPOSAL', payload: json });
      setSelectedProposalId(json._id);
      
      const votePageUrl = `/vote/${json.uniqueUrl}`;
      navigate(votePageUrl);
    } catch (error) {
      console.error('Error submitting proposal:', error.message);
    }
  };

  const descriptionValue = watch("description");

  return (
    <div>
      <form className="create" onSubmit={handleSubmit(onSubmit)}>
        <div className="proposal-form">
          <label>Title:</label>
          <input 
            type="text" 
            autoFocus 
            ref={titleInputRef} 
            {...register('title', { required: 'Title is required' })}
            onKeyDown={handleTitleKeyPress} // Listen for Tab key press on title input
          />
          {errors.title && <span className="error">{errors.title.message}</span>}
          
          <label>Description:</label>
          <ReactQuill 
            ref={descriptionInputRef}
            className="quill-editor"
            value={descriptionValue}
            onChange={onEditorStateChange}
            tabIndex="0" // Ensure description input receives focus when using Tab key
            onKeyDown={handleDescriptionKeyPress} // Listen for Tab key press on description input
          />
          <div className='error'>{errors.description && "Description is required"}</div>

          <label>Proposed by:</label>
          <input 
            type="text" 
            placeholder="Your Name (Optional)" 
            {...register('name')}
            ref={proposedByInputRef} 
            tabIndex="1"
          />

          {user ? (
            <div>
              <input type="checkbox" {...register('receiveNotifications')} tabIndex="2" />
              <label>Receive response notifications at: {user.email}</label>
            </div>
          ) : (
            <>
              <label>Send notifications of new responses to:</label>
              <input 
                type="email" 
                placeholder="Your Email (Optional)" 
                {...register('email')} 
                ref={emailInputRef} 
                tabIndex="3"
              />
            </>
          )}

          <button type="submit" tabIndex="4">Create Proposal</button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;








