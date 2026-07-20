import React from 'react';
import './styles.scss';

const UtilityBar = () => (
  <div className="eshop-utility-bar">
    <div className="eshop-container eshop-utility-bar__inner">
      <span>Free shipping over $50</span>
      <span className="eshop-utility-bar__sep">·</span>
      <span>Secure checkout</span>
      <span className="eshop-utility-bar__sep">·</span>
      <span>30-day returns</span>
    </div>
  </div>
);

export default UtilityBar;
