import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={overlayStyles} onClick={onClose}>
      <div style={popupStyles} onClick={(e) => e.stopPropagation()}>
        <button 
            style={closeButtonStyles} 
            onClick={onClose}
        >
            <FontAwesomeIcon icon={faXmark} />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Ensure you have a div with id="modal-root" in your HTML
  );
};


const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  const popupStyles = {
    position: 'relative',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'start',
    width: '650px',
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