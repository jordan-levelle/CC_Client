import React from 'react';
import { Link } from 'react-router-dom';
import { HomePageText } from '../constants/Constants';
import '../styles/pages/homepage.css';


const Home = () => {
 return (
   <div className="home-page">
     <div className="container1">
       <h1>{HomePageText.welcomeMessage}</h1>
       <p>{HomePageText.description}</p>
       <div className='container1-link-group'>
         <Link to="/create" className="small-button green">{HomePageText.createProposalLink}</Link>
         <Link to='/example' className='medium-button'>{HomePageText.exampleProposalLink}</Link>
       </div>
     </div>
     <div className="container2">
       <div className="container2-section">
         <h2>{HomePageText.basicsSection.title}</h2>
         <p>{HomePageText.basicsSection.description}</p>
         <Link to="/basics" className="medium-button">{HomePageText.learnMoreLink}</Link>
       </div>
     </div>
   </div>
 );
};


export default Home;