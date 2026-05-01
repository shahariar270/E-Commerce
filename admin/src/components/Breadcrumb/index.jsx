import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const routeLabels = {
    'dashboard': 'Dashboard',
    'products': 'Products',
    'product': 'Products',
    'new': 'Add Product',
    'orders': 'Orders',
    'categories': 'Categories',
    'settings': 'Settings',
    'profile': 'Profile',
    'wishlist': 'Wishlist',
    'checkout': 'Checkout',
    'cart': 'Cart',
    'login': 'Login',
    'register': 'Register',
};

const getRouteLabel = (segment, index, segments) => {
    const key = segment.split(':')[0];

    if (index === segments.length - 1 && key === 'product' && segment.includes(':')) {
        return 'Edit Product';
    }

    if (routeLabels[key]) {
        return routeLabels[key];
    }

    if (segment.includes(':')) {
        return segment.replace(':', '');
    }

    return segment.charAt(0).toUpperCase() + segment.slice(1);
};

export const Breadcrumb = ({ separator = '/' }) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) {
        return null;
    }

    return (
        <nav className="st-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="st-breadcrumb__link">
                <svg
                    className="st-breadcrumb__home-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = '/' + pathnames.slice(0, index + 1).join('/');
                const isLast = index === pathnames.length - 1;
                const label = getRouteLabel(name, index, pathnames);

                return (
                    <React.Fragment key={index}>
                        <span className="st-breadcrumb__separator">{separator}</span>
                        {isLast ? (
                            <span className="st-breadcrumb__item st-breadcrumb__item--active">
                                {label}
                            </span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="st-breadcrumb__link"
                            >
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
