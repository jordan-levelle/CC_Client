// voteConstants

import { faThumbsUp, faThumbsDown, faBan, faHandPointRight } from '@fortawesome/free-solid-svg-icons';

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
