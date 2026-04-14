import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const ErrorPage = ({
    code = '404',
    title = 'Page Not Found',
    message = 'The page you are looking for does not exist.',
    showHomeButton = true,
    homeButtonText = 'Go to Dashboard',
    homeButtonLink = '/admin/dashboard'
}) => {
    return (
        <div className="st-page">
            <div className="error-content">
                <div className="error-code">{code}</div>
                <h1 className="error-title">{title}</h1>
                <p className="error-message">{message}</p>
                {showHomeButton && (
                    <Link to={homeButtonLink} className="error-button">
                        {homeButtonText}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ErrorPage;