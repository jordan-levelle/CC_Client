import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createProposal } from "../api/proposals";
import { useProposalsContext } from "../hooks/useProposalContext";
import { useVoteContext } from "../hooks/useVoteContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTeamsContext } from '../context/TeamsContext';
import { useNavigate } from 'react-router-dom'; 
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import ReactQuill from 'react-quill';
import Select from 'react-select'
import 'react-quill/dist/quill.snow.css';
import '../styles/components/proposalform.css';

const ProposalForm = () => {
  const { dispatch } = useProposalsContext();
  const { user, isSubscribed } = useAuthContext();
  const { teams, fetchTeams, selectedTeam, updateSelectedTeam } = useTeamsContext();
  const { setSelectedProposalId } = useVoteContext();
  const { register, 
          handleSubmit, 
          setValue, 
          watch, 
          formState: { errors }, reset } = useForm();

  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const navigate = useNavigate();
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  useEffect(() => {
    if (user && isSubscribed) {
      fetchTeams(); // Fetch teams when the component mounts and user is available and subscribed
    }
  }, [fetchTeams, user, isSubscribed]); 

  useEffect(() => {
    if (!user) {
      loadCaptchaEnginge(6);
    }
    register("description", { required: true });
    register("email");
    register("name");
  }, [register, user]);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus(); 
    }
  }, []);

  const options = [
    { value: null, label: 'No Team' },
    ...teams.map((team) => ({
      value: team._id,
      label: team.teamName
    }))
  ];

  const handleTeamChange = (selectedOption) => {
    const teamId = selectedOption?.value || null;
    const team = teams.find(t => t._id === teamId);
    updateSelectedTeam(team); // Update the context with the selected team
    setValue('team', teamId); // Update the form value
  };

  const generateDummyUser = () => ({
    _id: process.env.REACT_APP_NON_AUTH_USER,
    token: process.env.REACT_APP_NON_AUTH_TOKEN
  });


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
  
      if (!user && !validateCaptcha(captchaInput)) {
        setCaptchaError('Invalid CAPTCHA');
        return; // Exit early if CAPTCHA is invalid
      } else {
        setCaptchaError(''); // Clear error if CAPTCHA is valid
      }
  
      const currentUser = user || generateDummyUser();
  
      // Log the current user information
      console.log("Submitting proposal as user:", currentUser.email || data.email);
  
      const proposal = { 
        ...data, 
        email: user ? (data.receiveNotifications ? currentUser.email : null) : data.email,
        teamId: data.sendNotifications && selectedTeam ? selectedTeam._id : null
      };
  
      // Log whether notifications will be sent to a team
      if (proposal.teamId) {
        console.log("Sending notifications to team:", selectedTeam.teamName, "Team ID:", proposal.teamId);
      } else {
        console.log("No team selected for notifications.");
      }
  
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
            name="title" // Add name attribute
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
              tabIndex="3"
              aria-label="Proposed by"
              name="name" 
            />
            <div>
              {isSubscribed ? (
                <div>
                  <h6>Select Team</h6>
                  <Select 
                    options={options} 
                    defaultValue={selectedTeam ? { value: selectedTeam._id, label: selectedTeam.teamName } : { value: null, label: 'No Team' }}
                    onChange={handleTeamChange} // Handle dropdown selection
                  />
                </div>
              ) : null}
            </div>
            <div>
              {isSubscribed ? (
                <div style={{ paddingTop:'5px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  {...register('sendNotifications')}
                  tabIndex="4"
                  style={{ marginRight: '5px' }} // Adjust margin as needed
                />
                <label htmlFor="sendNotifications">
                  Send Notifications
                </label>
              </div>
              ) : null}
            </div>

            {user ? (
              <div style={{ paddingTop:'5px', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                {...register('receiveNotifications')}
                tabIndex="4"
                style={{ marginRight: '5px' }} // Adjust margin as needed
              />
              <label htmlFor="receiveNotifications">
                Receive Notifications
              </label>
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
                  name="email" // Add name attribute
                />
              </>
            )}
            
            {!user && (
            <>
              <LoadCanvasTemplate />
              <input
                id="captcha"
                type="text"
                placeholder="Enter CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                tabIndex="6"
                aria-label="CAPTCHA"
              />
              {captchaError && <span className="error">{captchaError}</span>}
            </>
          )}
          <button type="submit" tabIndex="7">Create Proposal</button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;
