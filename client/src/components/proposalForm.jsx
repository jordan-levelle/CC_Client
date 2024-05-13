import React, { useEffect } from 'react';
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

  useEffect(() => {
    register("description", {required: true});
  }, [register]);

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
      const proposal = { ...data, uniqueUrl };

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
          <input type="text" {...register('title', { required: 'Title is required' })} />
          {errors.title && <span className="error">{errors.title.message}</span>}

          <label>Description:</label>
          <ReactQuill 
            className="quill-editor"
            value={descriptionValue}
            onChange={onEditorStateChange}
          />
          <p className='error'>{errors.description && "Description is required"}</p>

          <label>Proposed by:</label>
          <input type="text" placeholder="Your Name (Optional)" {...register('name')} />

          {user ? (
            <div>
              <input type="checkbox" {...register('receiveNotifications')} />
              <label>Receive response notifications at: {user.email}</label>
            </div>
          ) : (
            <>
              <label>Send notifications of new responses to:</label>
              <input type="email" placeholder="Your Email (Optional)" {...register('email')} />
            </>
          )}

          <button type="submit">Create Proposal</button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;






