import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { STANDARD_CC_FEATURES, PRO_CC_FEATURES } from '../constants/Constants';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../components/PopupOverlay';  // Import the modal component
import ProductDisplay from './Subscribe';  // Import the product display component
import '../styles/pages/subscription.css';

const Subscriptions = () => {
  const { user, isSubscribed } = useAuthContext();
  const [showMessage, setShowMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      setShowMessage(true);
    } else {
      setIsModalOpen(true);  // Open the modal when "Buy Now" is clicked
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);  // Close the modal
  };

  return (
    <section>
      <h3>Consensus Check Membership Plans</h3>
      <div className="page-container">
        <div className="component-container-1">
          <h5>STANDARD</h5>
          <p>FREE</p>
          {STANDARD_CC_FEATURES.map((feature, index) => (
            <div key={index}>
              <span>{feature}</span>
            </div>
          ))}
          {user ? (
            <button className='medium-button'>
              <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
            </button>
          ) : (
            <Link to="/auth">
              <button className='medium-button'>Sign up</button>
            </Link>
          )}
        </div>

        <div className="component-container-2">
          <h5>PRO</h5>
          <p>$20.00/Annually</p>
          {PRO_CC_FEATURES.map((feature, index) => (
            <div key={index}>
              <span>{feature}</span>
            </div>
          ))}
          {!user ? (
            <div>
              <button className='medium-button' onClick={handleClick}>Buy now</button>
              {showMessage && <p>Please sign up or log in to upgrade.</p>}
            </div>
          ) : (
            isSubscribed ? (
              <button className='medium-button'>
                <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
              </button>
            ) : (
              <button className='small-button' onClick={handleClick}>Upgrade</button>
            )
          )}
        </div>
      </div>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <ProductDisplay handleCheckout={() => { /* Add handleCheckout logic */ }} />
      </Modal>
    </section>
  );
};

export default Subscriptions;
