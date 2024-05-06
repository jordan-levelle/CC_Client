import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-container">
        <nav>
          <Link
            className='nav-link'
            to="/feedback"
          >Send Me Feedback</Link>
        </nav>
      </div>
    </div>
  );
};

export default Footer;

