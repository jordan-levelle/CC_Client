import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const successIcon = <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '20px' }} />;
const deleteIcon = <FontAwesomeIcon icon={faTrashCan} style={{ color: 'green', fontSize: '20px' }} />;
const warningIcon = <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'orange', fontSize: '20px' }} />;



const messages = {
  teamVoteSuccess: 'Team votes submitted successfully!',
  teamVoteError: 'Failed to submit team votes.',
  voteLimitError: 'Limit of 15 votes reached. Upgrade subscription for unlimited votes.',
  voteSuccess: 'Vote submitted successfully!',
  voteDelete: 'Vote deleted successfully',
  voteError: 'An error occurred while submitting your vote. Please try again.',
};

export const showSuccessToast = (messageKey) => {
  const message = messages[messageKey];
  toast.success(message, { icon: successIcon });
};

export const showErrorToast = (messageKey) => {
  const message = messages[messageKey];
  toast.error(message, { icon: warningIcon });
};

export const showDeleteToast = (messageKey) => {
    const message = messages[messageKey];
    toast.success(message, { icon: deleteIcon})
}
