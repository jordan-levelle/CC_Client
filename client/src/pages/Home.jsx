import React from 'react';
import { Link } from 'react-router-dom';
import { HomePageText } from '../constants/HomeTextConstants';
const Home = () => {
  return (
    <div className="home-page">
      <div className="rectangle">
        <h1>{HomePageText.welcomeMessage}</h1>
        <p>{HomePageText.description}</p>
        <div className='rectangle-link-group'>
          <Link to="/create" className="create-proposal-link">{HomePageText.createProposalLink}</Link>
          <Link to='/example' className='example-proposal-link'>{HomePageText.exampleProposalLink}</Link>
        </div>
      </div>
      <div className="sections-container">
        <div className="section">
          <h2>{HomePageText.basicsSection.title}</h2>
          <p>{HomePageText.basicsSection.description}</p>
          <Link to="/basics" className="learn-more-link">{HomePageText.learnMoreLink}</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;





