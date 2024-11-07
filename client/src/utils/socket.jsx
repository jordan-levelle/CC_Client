// socket.js
/* 
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_BASE_URL, {
  autoConnect: false,
});

let isJoined = false;

export const connectToProposalRoom = (uniqueUrl, onNewVote) => {
  if (!socket.connected) {
    socket.connect();
  }
  
  if (!isJoined) {
    socket.emit('joinProposal', uniqueUrl);
    isJoined = true;
    console.log(`Socket connected and joined proposal room: ${uniqueUrl}`);
  }

  if (!socket.hasListeners('newVote')) {
    socket.on('newVote', onNewVote);
  }
};

export const disconnectFromProposalRoom = () => {
  if (socket.connected && isJoined) {
    socket.emit('leaveProposal');
    socket.disconnect();
    isJoined = false;
    console.log('Socket disconnected from proposal room');
  }
  // Ensure listeners are cleared when disconnecting
  socket.off('newVote');
};

export default socket;
*/


