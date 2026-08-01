import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@Store/slices/auth/authSlice';
import logo from '../../assets/images/logo.svg';
import './styles.scss';

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartCount = useSelector((state) => state.cart.total_quantity);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
  };

  const handleAccountClick = () => {
    navigate(isAuthenticated ? '/profile' : '/login');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="eshop-nav">
      <div className="eshop-container eshop-nav__inner">
        <div className="eshop-nav__logo" onClick={() => navigate('/')}>
          <img src={logo} alt="" className="eshop-nav__logo-icon" />
          <span className="eshop-nav__logo-text">E-commerce</span>
        </div>

        <form className="eshop-nav__search" onSubmit={handleSearch}>
          <span className="eshop-nav__search-icon">⌕</span>
          <input
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="eshop-nav__links">
          <a className="eshop-nav__link" onClick={() => navigate('/')}>Home</a>
          <a className="eshop-nav__link" onClick={() => navigate('/products')}>Products</a>
          <button type="button" className="eshop-nav__icon-link" onClick={() => navigate('/cart')} aria-label="Cart">
            🛒
            {cartCount > 0 && <span className="eshop-nav__badge">{cartCount}</span>}
          </button>
          {isAuthenticated ? (
            <>
              <a className="eshop-nav__link" onClick={handleAccountClick}>My Account</a>
              <button type="button" className="eshop-nav__cta" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <button type="button" className="eshop-nav__cta" onClick={() => navigate('/login')}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
