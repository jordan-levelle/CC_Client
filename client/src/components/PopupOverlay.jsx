import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <button
          style={closeButtonStyles}
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
    
        {children}
       
        
      </div>
    </div>
  );
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  padding: '18px',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyles = {
  position: 'relative',
  backgroundColor: '#fff',
  padding: '15px',
  borderRadius: '8px',
  width: 'fit-content',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};



const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.5rem',
};

export default Modal;
