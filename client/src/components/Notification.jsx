import React, { useEffect, useState } from 'react';

const Notification = ({ message }) => {
  const [isVisible, setIsVisible] = useState(!!message); 

  useEffect(() => {
    if (message) {
      setIsVisible(true); 
      const timer = setTimeout(() => {
        setIsVisible(false); 
      }, 5000); 

      return () => clearTimeout(timer); 
    } else {
      setIsVisible(false); 
    }
  }, [message]);

  if (!isVisible) return null; 

  return (
    <div className="error-message">
      {message}
    </div>
  );
};

export default Notification;
