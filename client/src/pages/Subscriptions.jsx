import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { PLANS_DESCRIPTION_PARAGRAPH, STANDARD_CC_FEATURES, PRO_CC_FEATURES } from '../constants/TextConstants';
import { useAuthContext } from '../hooks/useAuthContext';

const Subscriptions = () => {
  const { user, isSubscribed } = useAuthContext();

  return (
    <section id="price-section">
      <div className="container">
        <div className="row justify-content-center gapsectionsecond">
          <div className="col-lg-7 text-center">
            <div className="title-big">
              <h3>SERVICE PRICES</h3>
            </div>
            <p className="description-p">
              {PLANS_DESCRIPTION_PARAGRAPH}
            </p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-4 text-center">
            <div className="wrap-price center-wrap">
              <div className="price-innerdetail">
                <h5>STANDARD</h5>
                <p className="prices">FREE</p>
                {STANDARD_CC_FEATURES.map((feature, index) => (
                  <div key={index} className="detail-pricing">
                    <span className="pricing-detail-item">
                      <i className="bi bi-check2-circle"></i> {feature}
                    </span>
                  </div>
                ))}
                {user ? (
                  <button className="btn btn-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                  </button>
                ) : (
                  <Link to="/auth">
                    <button className="btn btn-secondary">Sign up</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4 text-center">
            <div className="wrap-price">
              <div className="price-innerdetail">
                <h5>PRO</h5>
                <p className="prices">10$</p>
                {PRO_CC_FEATURES.map((feature, index) => (
                  <div key={index} className="detail-pricing">
                    <span className="pricing-detail-item">
                      <i className="bi bi-check2-circle"></i> {feature}
                    </span>
                  </div>
                ))}
                {!user ? (
                  <Link to="/subscribe">
                    <button className="btn btn-secondary">Buy now</button>
                  </Link>
                ) : (
                  isSubscribed ? (
                    <button className="btn btn-secondary">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                    </button>
                  ) : (
                    <Link to="/subscribe">
                      <button className="btn btn-secondary">Upgrade</button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subscriptions;

