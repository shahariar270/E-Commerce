import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCart } from '@Store/slices/cartSlice';
import Notification from '@Component/Notifications';
import UtilityBar from './UtilityBar';
import Nav from './Nav';
import Footer from './Footer';
import NewsletterPopup from './NewsletterPopup';

const StorefrontLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Guests get a stable cart via a client-generated guest id (see
    // Utils/api.js), so load it here too — not just for logged-in users.
    dispatch(getCart());
  }, [dispatch]);

  return (
    <div className="eshop-theme">
      <UtilityBar />
      <Nav />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <NewsletterPopup />
      <Notification />
    </div>
  );
};

export default StorefrontLayout;
