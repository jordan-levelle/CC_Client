import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { STANDARD_CC_FEATURES, PRO_CC_FEATURES } from '../constants/Constants';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/pages/subscription.css';


const Subscriptions = () => {
 const { user, isSubscribed } = useAuthContext();


 return (
   <section>
     <h3>Consensus Check Membership Plans</h3>
     <div className="page-container">
       <div className="component-container-1">
         <h5>STANDARD</h5>
         <p>FREE</p>
         {STANDARD_CC_FEATURES.map((feature, index) => (
           <div key={index}>
             <span>
               {feature}
             </span>
           </div>
         ))}
         {user ? (
           <button className='medium-button'>
             <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
           </button>
         ) : (
           <Link small-button to="/auth">
             <button className='medium-button'>Sign up</button>
           </Link>
         )}
       </div>
       <div className="component-container-2">
         <h5>PRO</h5>
         <p>$20.00/Annually</p>
         {PRO_CC_FEATURES.map((feature, index) => (
           <div key={index}>
             <span>
              {feature}
             </span>
           </div>
         ))}
         {!user ? (
           <Link to="/subscribe">
             <button className='medium-button'>Buy now</button>
           </Link>
         ) : (
           isSubscribed ? (
             <button className='medium-button'>
               <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
             </button>
           ) : (
             <Link to="/subscribe">
               <button className='small-button'>Upgrade</button>
             </Link>
           )
         )}
       </div>
     </div>
   </section>
 );
};


export default Subscriptions;
