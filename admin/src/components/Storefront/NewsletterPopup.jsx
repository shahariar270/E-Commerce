import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from '@Component/Modal';
import { subscribe } from '@Store/slices/subscriberSlice';

const DELAY_MS = 30000;
const SUBSCRIBED_KEY = 'newsletter_subscribed';
const DISMISSED_KEY = 'newsletter_popup_dismissed';
const FIRST_SEEN_KEY = 'newsletter_first_seen_at';

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

    // StorefrontLayout (and this popup with it) unmounts whenever a
    // logged-in user visits an account page (/profile, /orders, /settings,
    // /dashboard render under the plain admin-style Layout, not this one).
    // A fresh 30s-from-mount timer would keep getting reset every time they
    // wander back — anchor the delay to when they first arrived this
    // session instead, so it counts total time on the site.
    let firstSeenAt = sessionStorage.getItem(FIRST_SEEN_KEY);
    if (!firstSeenAt) {
      firstSeenAt = Date.now().toString();
      sessionStorage.setItem(FIRST_SEEN_KEY, firstSeenAt);
    }

    const remaining = Math.max(0, DELAY_MS - (Date.now() - Number(firstSeenAt)));
    const timer = setTimeout(() => setOpen(true), remaining);
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
