import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from '@Component/Modal';
import { subscribe } from '@Store/slices/subscriberSlice';

const DELAY_MS = 30000;
const SUBSCRIBED_KEY = 'newsletter_subscribed';
const DISMISSED_KEY = 'newsletter_popup_dismissed';

const NewsletterPopup = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Never nag someone who already subscribed; only nag once per session
    // if they closed it without subscribing.
    if (localStorage.getItem(SUBSCRIBED_KEY) || sessionStorage.getItem(DISMISSED_KEY)) {
      return;
    }

    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(DISMISSED_KEY, 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;

    setStatus('loading');
    setMessage('');
    dispatch(subscribe(email.trim()))
      .unwrap()
      .then(() => {
        localStorage.setItem(SUBSCRIBED_KEY, 'true');
        setStatus('success');
        setMessage("You're subscribed! 🎉");
        setTimeout(handleClose, 1500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.message || 'Failed to subscribe — please try again.');
      });
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={handleClose} title="Get 10% off your first order">
      <form className="eshop-newsletter-popup" onSubmit={handleSubmit}>
        <p className="eshop-newsletter-popup__copy">
          Subscribe for exclusive deals, new arrivals, and offers straight to your inbox.
        </p>
        <input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="eshop-newsletter-popup__input"
        />
        <button type="submit" className="eshop-newsletter-popup__btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {message && (
          <p className={`eshop-newsletter-popup__message eshop-newsletter-popup__message--${status}`}>
            {message}
          </p>
        )}
      </form>
    </Modal>
  );
};

export default NewsletterPopup;
