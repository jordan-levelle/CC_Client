import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createProposal } from "../api/proposals";
import { useProposalsContext } from "../hooks/useProposalContext";
import { useVoteContext } from "../hooks/useVoteContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from 'react-router-dom'; 
import { nanoid } from 'nanoid';
import { generateDummyUser } from '../utils/authUtils'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Captcha from '../components/Captcha'; // Import the Captcha component

const ProposalForm = () => {
  const { dispatch } = useProposalsContext();
  const { user } = useAuthContext();
  const { setSelectedProposalId } = useVoteContext();
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const siteKey = process.env.REACT_APP_hCAPTCHA_SITEKEY; // Adjusted to use the environment variable

  useEffect(() => {
    register("description", { required: true });
    register("email");
    register("name");
  }, [register]);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus(); // Focus on title input when component mounts
    }
  }, []);

  const handleTitleKeyPress = useCallback((event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      descriptionInputRef.current?.focus();
    }
  }, []);

  const handleDescriptionKeyPress = useCallback((event) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      document.getElementById('name')?.focus();
    }
  }, []);

  const onEditorStateChange = useCallback((content) => {
    setValue("description", content);
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      if (!data.title.trim() || !data.description.trim()) {
        throw new Error('Title and description are required');
      }

      if (!captchaToken) {
        throw new Error('Please complete the captcha');
      }

      const currentUser = user || generateDummyUser();
      const uniqueUrl = nanoid(10);
      const proposal = { ...data, uniqueUrl };

      const json = await createProposal(proposal, currentUser.token);
      dispatch({ type: 'CREATE_PROPOSAL', payload: json });
      setSelectedProposalId(json._id);
      
      navigate(`/${json.uniqueUrl}`);
      reset();
    } catch (error) {
      console.error('Error submitting proposal:', error.message);
    }
  };

  const descriptionValue = watch("description");

  return (
    <div>
      <form className="create" onSubmit={handleSubmit(onSubmit)}>
        <div className="proposal-form">
          <label htmlFor="title">Title:</label>
          <input 
            id="title"
            type="text" 
            autoFocus 
            ref={titleInputRef} 
            {...register('title', { required: 'Title is required' })}
            tabIndex="1"
            onKeyDown={handleTitleKeyPress}
            aria-required="true"
            aria-label="Title"
          />
          {errors.title && <span className="error">{errors.title.message}</span>}
          
          <label htmlFor="description">Description:</label>
          <ReactQuill 
            id="description"
            className="quill-editor"
            value={descriptionValue}
            onChange={onEditorStateChange}
            tabIndex="2" // Ensure tabIndex is set correctly
            aria-required="true"
            aria-label="Description"
            onKeyDown={handleDescriptionKeyPress} // Add key down event handler
            ref={descriptionInputRef}
          />
          <div className='error'>{errors.description && "Description is required"}</div>

          <label htmlFor="name">Proposed by:</label>
          <input 
            id="name"
            type="text" 
            placeholder="Your Name (Optional)" 
            {...register('name')}
            tabIndex="3" // Ensure tabIndex is set correctly
            aria-label="Proposed by"
          />

          {user ? (
            <div>
              <input type="checkbox" {...register('receiveNotifications')} tabIndex="4" />
              <label htmlFor="receiveNotifications">Receive response notifications at: {user.email}</label>
            </div>
          ) : (
            <>
              <label htmlFor="email">Send notifications of new responses to:</label>
              <input 
                id="email"
                type="email" 
                placeholder="Your Email (Optional)" 
                {...register('email')} 
                tabIndex="5"
                aria-label="Email"
              />
            </>
          )}

          <Captcha
            siteKey={siteKey} // Use environment variable for site key
            onVerify={(token) => setCaptchaToken(token)}
          />

          <button type="submit" tabIndex="6">Create Proposal</button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;






