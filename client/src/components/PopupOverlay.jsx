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
        
        <div style={contentContainerStyles}>
          {children}
        </div>
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
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyles = {
  position: 'relative',
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '8px',
  width: '750px',
  maxHeight: '90vh', // Ensures the modal has a max height of 80% of the viewport height
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden', // Hides overflow for content exceeding modal bounds
};

const contentContainerStyles = {
  maxHeight: '77vh', // Set a max height for the content area
  overflowY: 'auto', // Enable vertical scrolling when content exceeds max height
  paddingRight: '10px', // Space for scrollbar
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


