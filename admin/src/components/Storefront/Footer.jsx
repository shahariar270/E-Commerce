import React from 'react';
import logo from '../../assets/images/fulllogo.svg';
import './styles.scss';

const columns = [
  ['Support', ['123 Demo Street, Dhaka', 'help@ecommerce.example', '+880 1000-000000']],
  ['Account', ['My Account', 'Login / Register', 'Cart']],
  ['Quick Link', ['Privacy Policy', 'Terms Of Use', 'FAQ', 'Contact']],
];

const Footer = () => (
  <div className="eshop-footer">
    <div className="eshop-container eshop-footer__inner">
      <div>
        <img src={logo} alt="E-commerce" className="eshop-footer__brand-logo" />
        <p className="eshop-footer__brand-copy">
          Everything you need, delivered right. Subscribe for 10% off your first order.
        </p>
      </div>
      {columns.map(([heading, items]) => (
        <div className="eshop-footer__col" key={heading}>
          <h4>{heading}</h4>
          <div className="eshop-footer__col-links">
            {items.map((item) => (
              <a key={item}>{item}</a>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="eshop-footer__bottom">© {new Date().getFullYear()} E-commerce. All rights reserved.</div>
  </div>
);

export default Footer;
