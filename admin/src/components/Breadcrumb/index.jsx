import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProductById } from '@Store/slices/productSlice';

const routeLabels = {
    'dashboard': 'Dashboard',
    'products': 'Products',
    'product': 'Products',
    'new': 'Add Product',
    'orders': 'Orders',
    'order': 'Orders',
    'categories': 'Categories',
    'settings': 'Settings',
    'profile': 'Profile',
    'wishlist': 'Wishlist',
    'checkout': 'Checkout',
    'cart': 'Cart',
    'login': 'Login',
    'register': 'Register',
};

const isObjectId = (str) => /^[0-9a-f]{24}$/.test(str);

const getRouteLabel = (segment, index, segments, productId) => {
    const key = segment.split(':')[0];

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
    const params = useParams();
    const dispatch = useDispatch();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const currentProduct = useSelector(state => state.product?.current);
    const productId = params.id;

    useEffect(() => {
        if (productId && pathnames.includes('product')) {
            dispatch(getProductById(productId));
        }
    }, []);

    if (pathnames.length === 0) {
        return null;
    }

    const getSegmentLabel = (name, index) => {
        const key = name.split(':')[0];

        // Check if this segment is an ObjectId and the previous segment was 'product'
        const prevSegment = index > 0 ? pathnames[index - 1] : null;
        if (isObjectId(name) && prevSegment === 'product' && currentProduct?.product_name) {
            return currentProduct.product_name;
        }

        return getRouteLabel(name, index, pathnames, productId);
    };

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
                const label = getSegmentLabel(name, index);

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
