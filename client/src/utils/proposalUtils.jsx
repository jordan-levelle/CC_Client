// proposalUtils.jsx

export const handleExistingVoteUpdate = (index, newVoteValue, exampleProposal, setExampleProposal) => {
    if (!exampleProposal) {
      console.error('Example proposal is undefined.');
      return;
    }
  
    const updatedVotes = [...exampleProposal.votes];
    updatedVotes[index].vote = newVoteValue;
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes,
    }));
  };
  
  export const handleExistingCommentUpdate = (index, newComment, exampleProposal, setExampleProposal) => {
    const updatedVotes = [...exampleProposal.votes];
    updatedVotes[index].comment = newComment;
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
    const updatedVotes = [...exampleProposal.votes, newVote];
    setExampleProposal(prevProposal => ({
      ...prevProposal,
      votes: updatedVotes,
    }));
    setNewVote({ name: '', vote: '', comment: '' });
  };
  





  





  
  
  
