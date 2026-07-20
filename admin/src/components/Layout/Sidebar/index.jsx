import { getCookie } from '@utils/helper'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import logo from '../../../assets/images/logo.svg'
import './styles.scss'

const NAV_CONFIG = {
    admin: [
        { label: 'Overview', link: "/admin/dashboard", icon: "overview" },
        { label: 'Products', link: "/admin/products", icon: "product" },
        { label: 'All Orders', link: "/admin/orders", icon: "cart" },
        { label: 'Categories', link: "/admin/categories", icon: "filter" },
        { label: 'Coupons', link: "/admin/coupons", icon: "clipboard" },
        { label: 'Settings', link: "/admin/settings", icon: "settings" },
        { label: 'Profile', link: "/admin/profile", icon: "profile" },
    ],
    user: [
        { label: 'Home', link: "/", icon: "product" },
        { label: 'Products', link: "/products", icon: "product" },
        { label: 'My Orders', link: "/orders", icon: "cart" },
        { label: 'Cart', link: "/cart", icon: "wishlist" },
        { label: 'Profile', link: "/profile", icon: "profile" },
        { label: 'Settings', link: "/settings", icon: "settings" },
    ],
}

const ChevronIcon = ({ flipped }) => (
    <svg
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        className={`st-sidebar__toggle-icon ${flipped ? 'st-sidebar__toggle-icon--flipped' : ''}`}
    >
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const UserAvatar = ({ name, email }) => {
    const initials = name
        ? name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : email?.[0]?.toUpperCase() ?? '?'

    return (
        <div className="st-sidebar__user-avatar">
            {initials}
        </div>
    )
}

const NavItem = ({ label, icon, link, isOpen }) => {
    const location = useLocation();
    return (
        <NavLink
            to={link}
            end={link === '/' || link === '/admin'}
            className={({ isActive }) => {
                const isProductActive = (link === '/admin/products' && location.pathname.startsWith('/admin/product')) ||
                                       (link === '/products' && location.pathname.startsWith('/product'));
                const isOrderActive = (link === '/admin/orders' && location.pathname.startsWith('/admin/order')) ||
                                     (link === '/orders' && location.pathname.startsWith('/order'));
                const activeClass = (isActive || isProductActive || isOrderActive) ? 'st-sidebar__nav-item--active' : '';
                return `st-sidebar__nav-item ${activeClass}`;
            }}
        >
            <span className={`st-icon--${icon} st-sidebar__nav-icon`} />
            <span className={`st-sidebar__nav-label ${!isOpen ? 'st-sidebar__nav-label--hidden' : ''}`}>
                {label}
            </span>
        </NavLink>
    )
}


const Sidebar = ({ isOpen, setIsOpen }) => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate();
    const role = user?.user_role ?? 'user'
    const navItems = NAV_CONFIG[role] ?? NAV_CONFIG.user

    useEffect(() => {
        const token = getCookie("token")
        if (!token) return navigate('/login')
        try {
            setUser(jwtDecode(token))
        } catch (err) {
            console.error("Failed to decode token:", err)
        }
    }, [])

    const handleLogout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        navigate('/login')
    }

    return (
        <>
            <div 
                className={`st-sidebar-overlay ${isOpen ? 'st-sidebar-overlay--visible' : ''}`}
                onClick={() => setIsOpen(false)}
            />
            <div className="st-layout--sidebar-wrapper">
                <aside
                    className={`st-sidebar ${!isOpen ? 'st-sidebar--collapsed' : ''}`}
                    style={{ '--sidebar-width': isOpen ? '220px' : '60px' }}
                >
                    <div className="st-sidebar__header">
                        <div className="st-sidebar__logo">
                            <img src={logo} alt="E-commerce" className="st-sidebar__logo-img" />
                            <span className={`st-sidebar__logo-text ${!isOpen ? 'st-sidebar__logo-text--hidden' : ''}`}>E-commerce</span>
                        </div>
                        <div className="st-sidebar__tagline">
                            Admin Panel
                        </div>
                    </div>

                    <nav className="st-sidebar__nav">
                        {navItems.map(({ label, icon, link }) => (
                            <NavItem
                                key={label}
                                label={label}
                                icon={icon}
                                link={link}
                                isOpen={isOpen}
                            />
                        ))}
                    </nav>

                    <div className="st-sidebar__divider" />

                    {/* <div
                        className="st-sidebar__user"
                        onClick={() => navigate('/admin/profile')}
                        title={!isOpen ? (user?.name || user?.email || 'Profile') : undefined}
                    >
                        <UserAvatar name={user?.name} email={user?.email} />
                        <div className={`st-sidebar__user-info ${!isOpen ? 'st-sidebar__user-info--hidden' : ''}`}>
                            <div className="st-sidebar__user-name">
                                {user?.name || 'Admin'}
                            </div>
                            <div className="st-sidebar__user-email">
                                {user?.email || ''}
                            </div>
                        </div>
                    </div> */}

                    <button
                        className="st-sidebar__logout"
                        onClick={handleLogout}
                        title={!isOpen ? 'Logout' : undefined}
                    >
                        <span className="st-icon--logout st-sidebar__logout-icon" />
                        <span className={`st-sidebar__logout-label ${!isOpen ? 'st-sidebar__logout-label--hidden' : ''}`}>
                            Logout
                        </span>
                    </button>

                    <button
                        className="st-sidebar__toggle"
                        onClick={() => setIsOpen(prev => !prev)}
                        aria-label="Toggle sidebar"
                    >
                        <ChevronIcon flipped={!isOpen} />
                    </button>
                </aside>
            </div>
        </>
    )
}

export default Sidebar
