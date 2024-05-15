import React from 'react';


const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light border-top border-light">
      <div className="container overflow-hidden">
        <div className="row gy-5 gy-md-0 align-items-md-end">
          <div className="col-xs-12 col-md-7 order-1 order-md-0">
            <div className="copyright text-center text-md-start">
              &copy; 2024. All Rights Reserved.
            </div>
            <div className="credits text-secondary text-center text-md-start mt-2 fs-8">
              <p className="link-secondary text-decoration-none"> Built by Jordan Levelle</p>
            </div>
          </div>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;


