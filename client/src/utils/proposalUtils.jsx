import { handleSubmittedVoteUpdate } from "src/api/proposals";


export const updateOpinion = async (proposalId, submittedVotes, setSubmittedVotes, index, newOpinionValue) => {
    try {
      const updatedVotes = [...submittedVotes];
      updatedVotes[index] = {
        ...updatedVotes[index],
        opinion: newOpinionValue,
        updatedAt: new Date(),
      };
      setSubmittedVotes(updatedVotes);
      await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]._id, updatedVotes[index]);
    } catch (error) {
      console.error('Error updating opinion:', error.message);
    }
  };
  
  export const updateComment = async (proposalId, submittedVotes, setSubmittedVotes, index, newComment) => {
    try {
      const updatedVotes = [...submittedVotes];
      updatedVotes[index] = {
        ...updatedVotes[index],
        comment: newComment,
        updatedAt: new Date(),
      };
      setSubmittedVotes(updatedVotes);
      await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]._id, updatedVotes[index]);
    } catch (error) {
      console.error('Error updating comment:', error.message);
    }
  };
  
  
  export const updateName = async (proposalId, submittedVotes, setSubmittedVotes, index, newName) => {
    try {
      const updatedVotes = [...submittedVotes];
      updatedVotes[index] = {
        ...updatedVotes[index],
        name: newName,
        updatedAt: new Date(),
      };
      setSubmittedVotes(updatedVotes);
      await handleSubmittedVoteUpdate(proposalId, updatedVotes[index]._id, updatedVotes[index]);
    } catch (error) {
      console.error('Error updating name:', error.message);
    }
  };
  
  








  /***************** 
   *  
   * Example Proposal Util Functions 
   * 
  ******************/
  export const handleExistingOpinionUpdate = (index, newVoteValue, exampleProposal, setExampleProposal) => {
    const updatedVotes = [...exampleProposal.votes];
    const currentDate = new Date().toISOString();
    updatedVotes[index].opinion = newVoteValue;
    updatedVotes[index].updatedAt = currentDate;
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes,
    }));
  };
  
  export const handleExistingCommentUpdate = (index, newComment, exampleProposal, setExampleProposal) => {
    const updatedVotes = [...exampleProposal.votes];
    const currentDate = new Date().toISOString();
    updatedVotes[index].comment = newComment;
    updatedVotes[index].updatedAt = currentDate;
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes,
    }));
  };
  
  export const handleExistingSubmissionDelete = (index, exampleProposal, setExampleProposal) => {
    const updatedVotes = exampleProposal.votes.filter((_, i) => i !== index);
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes,
    }));
  };
  
  export const handleNewTableEntry = (e, newVote, setNewVote) => {
    const { name, value } = e.target;
    setNewVote(prevVote => ({
      ...prevVote,
      [name]: value,
    }));
  };
  
  export const handleNewSubmission = (exampleProposal, newVote, setExampleProposal, setNewVote) => {
    const currentDate = new Date().toISOString();
    const updatedNewVote = {
      ...newVote,
      updatedAt: currentDate
    };
    const updatedVotes = [...exampleProposal.votes, updatedNewVote];
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes,
    }));
    setNewVote({ name: '', opinion: '', comment: '' });
  };