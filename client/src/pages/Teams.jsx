import React from 'react';

const Teams = () => {
  return (
    <section id="price-section">
      <div className="container">
        <div className="row justify-content-center gapsectionsecond">
          <div className="col-lg-7 text-center">
            <div className="title-big pb-3 mb-3">
              <h3>SERVICE PRICES</h3>
            </div>
            <p className="description-p text-muted pe-0 pe-lg-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus quas optio reiciendis deleniti voluptatem facere sequi, quia, est sed dicta aliquid quidem facilis culpa iure perferendis? Dolor ad quia deserunt.
            </p>
          </div>
        </div>
        <div className="row pt-3 justify-content-center">
          <div className="col-lg-4 pb-5 pb-lg-0 text-center">
            <div className="wrap-price center-wrap">
              <div className="price-innerdetail text-center">
                <h5>STANDARD TEAMS</h5>
                <p className="prices">0$</p>
                <div className="detail-pricing">
                  <span className="float-left"> <i className="bi bi-check2-circle"></i> amet consectetur adipisicing </span>
                </div>
                <div className="detail-pricing">
                  <span className="float-left"> <i className="bi bi-check2-circle"></i> amet consectetur adipisicing</span>
                </div>
                <div className="detail-pricing">
                  <span className="float-left"> <i className="bi bi-check2-circle"></i> amet consectetur adipisicing</span>
                </div>
                <button href="#" className="btn btn-secondary mt-5">Sign up</button>
              </div>
            </div>
          </div>
          <div className="col-lg-4 pb-5 pb-lg-0 text-center">
            <div className="wrap-price">
              <div className="price-innerdetail text-center">
                <h5>PRO TEAMS</h5>
                <p className="prices">10$</p>
                <div className="detail-pricing">
                  <span className="float-left"> <i className="bi bi-check2-circle"></i> amet consectetur adipisicing </span>
                </div>
                <div className="detail-pricing">
                  <span className="float-left"> <i className="bi bi-check2-circle"></i> amet consectetur adipisicing</span>
                </div>
                <div className="detail-pricing">
                  <span className="float-left"> <i className="bi bi-check2-circle"></i> amet consectetur adipisicing</span>
                </div>
                <button href="#" className="btn btn-secondary mt-5">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Teams;
