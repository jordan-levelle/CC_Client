import React, { useEffect, useState } from 'react';

const Notification = ({ message }) => {
  const [isVisible, setIsVisible] = useState(!!message); // Track visibility based on message

  useEffect(() => {
    if (message) {
      setIsVisible(true); // Show the notification
      const timer = setTimeout(() => {
        setIsVisible(false); // Hide the notification after 3 seconds
      }, 5000); // Duration in milliseconds

      return () => clearTimeout(timer); // Cleanup timeout on unmount or message change
    } else {
      setIsVisible(false); // Hide if there is no message
    }
  }, [message]);

  if (!isVisible) return null; // Don't render if not visible

  return (
    <div className="error-message">
      {message}
    </div>
  );
};

export default Notification;
