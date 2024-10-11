import { faThumbsUp, faThumbsDown, faBan, faHandPointRight } from '@fortawesome/free-solid-svg-icons';

export const HomePageText = {
  welcomeMessage: "Welcome to Consensus Check",
  description: "Lots of back and forth over email can be confusing.\nConsensusCheck complements group decision making over email by making the proposal and responses clear and easy.",
  createProposalLink: "Create Proposal",
  exampleProposalLink: "View an Example Proposal",
  basicsSection: {
    title: "Basics",
    description: "Consensus is a cooperative process in which group members develop and agree to support a decision in the best interest of the whole."
  },
  learnMoreLink: "Learn More"
};

export const STANDARD_CC_FEATURES = [
  "Access to User Dashboard",
  "Access to All Active Proposals.",
  "Email Notifications",
  "Edit Your Active Proposals",
  "Proposals expire after a certain period",
  "Limit of 15 respondents per proposal"
];

export const PRO_CC_FEATURES = [
  "Access to User Dashboard",
  "Access to All Proposals(no expiration)",
  "Advanced Email Notifications",
  "Edit Your Proposals(no expiration)",
  "No Limit of respondents per proposal",
  "Create Teams for Simplified Proposal Creation",
  "Attach files to proposals",
  "Text alerts",
  "Browser notifications",
  "Unlimited respondents"
];

export const icons = {
  Agree: faThumbsUp,
  Neutral: faHandPointRight,
  Disagree: faThumbsDown,
  Block: faBan
};

export const tooltips = {
  Agree: '<div><h3>Agree</h3><p>Basic alignment with the proposal</p></div>',
  Neutral: '<div><h3>Neutral</h3><p>Not having an opinion either way and agreeing<br/>to go along with the group\'s decision.</p></div>',
  Disagree: '<div><h3>Stand Aside</h3><p>A choice to let the proposal proceed,<br/>while personally not feeling aligned with direction.</p></div>',
  Block: '<div><h3>Block</h3><p>Proposal is disastrous for the group or<br/>doesn\'t align with the group\'s core principles.</p></div>'
};

export const teamTooltips = {
  Edit: 'Edit',
  Create: 'Create Team Proposal',
  Delete: 'Delete',
};


export const passwordCriteria = [
  { key: 'minLength', label: ' 8 Characters' },
  { key: 'uppercase', label: 'A-Z' },
  { key: 'lowercase', label: 'a-z' },
  { key: 'number', label: '0-9' },
  { key: 'specialChar', label: '(!@#$%^&*)' }
];

export const formatDate = (dateString) => {
  if (!dateString || !Date.parse(dateString)) {
    return '';
  }
  const options = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
};