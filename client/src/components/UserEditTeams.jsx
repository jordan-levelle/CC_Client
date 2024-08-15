import React from 'react'

const UserEditTeams = ({onClose}) => {
  return (
    <div style={overlayStyles}>
            <div style={popupStyles}>
                <h2>Edit Team</h2>
                <p>This is the Edit Teams Component.</p>
                <p>Consensus Check is working on this Feature. </p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
  )
}

const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const popupStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
};

export default UserEditTeams;


