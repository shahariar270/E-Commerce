import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import logo from '../../assets/images/logo.svg';
import { subscribe } from '@Store/slices/subscriberSlice';
import './styles.scss';

const columns = [
  ['Support', ['123 Demo Street, Dhaka', 'help@ecommerce.example', '+880 1000-000000']],
  ['Account', ['My Account', 'Login / Register', 'Cart']],
  ['Quick Link', ['Privacy Policy', 'Terms Of Use', 'FAQ', 'Contact']],
];

const SubscribeForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;

    setStatus('loading');
    setMessage('');
    dispatch(subscribe(email.trim()))
      .unwrap()
      .then(() => {
        setStatus('success');
        setMessage("You're subscribed! 🎉");
        setEmail('');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.message || 'Failed to subscribe — please try again.');
      });
  };

  return (
    <form className="eshop-footer__subscribe" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="eshop-footer__subscribe-input"
      />
      <button type="submit" className="eshop-footer__subscribe-btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && (
        <p className={`eshop-footer__subscribe-message eshop-footer__subscribe-message--${status}`}>
          {message}
        </p>
      )}
    </form>
  );
};

const Footer = () => (
  <div className="eshop-footer">
    <div className="eshop-container eshop-footer__inner">
      <div>
        <div className="eshop-footer__brand-logo">
          <img src={logo} alt="" className="eshop-footer__brand-logo-icon" />
          <span className="eshop-footer__brand-logo-text">E-commerce</span>
        </div>
        <p className="eshop-footer__brand-copy">
          Everything you need, delivered right. Subscribe for 10% off your first order.
        </p>
        <SubscribeForm />
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
