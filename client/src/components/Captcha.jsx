import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Captcha = ({ siteKey, onVerify }) => {
  return (
    <HCaptcha
      sitekey={siteKey}
      onVerify={onVerify}
      data-theme="dark" 

    />
  );
};

export default Captcha;