import { getCookie } from '@utils/helper'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const NAV_CONFIG = {
    admin: [
        { label: 'Overview', link: "/admin/dashboard", icon: "overview" },
        { label: 'Products', link: "/admin/products", icon: "product" },
        { label: 'All Orders', link: "/admin/orders", icon: "cart" },
        { label: 'Categories', link: "/admin/categories", icon: "filter" },
        { label: 'Settings', link: "/admin/settings", icon: "settings" },
        { label: 'Profile', link: "/admin/profile", icon: "profile" },
    ],
    user: [
        { label: 'Products', link: "/", icon: "product" },
        { label: 'My Orders', link: "/orders", icon: "cart" },
        { label: 'Wishlist', link: "/wishlist", icon: "wishlist" },
        { label: 'Profile', link: "/profile", icon: "profile" },
        { label: 'Settings', link: "/settings", icon: "settings" },
    ],
}

const ChevronIcon = ({ flipped }) => (
    <svg
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        style={{
            transition: 'transform 0.25s',
            transform: flipped ? 'rotate(180deg)' : 'none',
            flexShrink: 0,
        }}
    >
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const UserAvatar = ({ name, email }) => {
    const initials = name
        ? name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : email?.[0]?.toUpperCase() ?? '?'

    return (
        <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6d28d9, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '12px', fontWeight: '700',
            flexShrink: 0,
            userSelect: 'none',
        }}>
            {initials}
        </div>
    )
}

const NavItem = ({ label, icon, link, isOpen }) => (
    <NavLink
        to={link}
        end
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 8px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive ? '#6d28d9' : '#6b7280',
            fontWeight: isActive ? '500' : '400',
            fontSize: '14px',
            background: isActive ? '#ede9fe' : 'transparent',
            border: 'none',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            marginBottom: '2px',
            transition: 'background 0.15s, color 0.15s',
        })}
        onMouseEnter={e => {
            if (e.currentTarget.style.background !== 'rgb(237, 233, 254)') {
                e.currentTarget.style.background = '#f9fafb'
            }
        }}
        onMouseLeave={e => {
            if (e.currentTarget.style.background !== 'rgb(237, 233, 254)') {
                e.currentTarget.style.background = 'transparent'
            }
        }}
    >
        <span className={`st-icon--${icon}`} style={{ flexShrink: 0 }} />
        <span style={{
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.2s ease',
        }}>
            {label}
        </span>
    </NavLink>
)

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate();
    const role = user?.user_role ?? 'user'
    const navItems = NAV_CONFIG[role] ?? NAV_CONFIG.user

    useEffect(() => {
        const token = getCookie("token")
        if (!token) return
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
        <div
            className="st-layout--sidebar-wrapper"
            style={{ position: 'relative', display: 'flex' }}
        >
            <aside style={{
                width: isOpen ? '220px' : '60px',
                minWidth: isOpen ? '220px' : '60px',
                background: '#ffffff',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                padding: isOpen ? '24px 16px' : '24px 10px',
                transition: 'width 0.25s ease, min-width 0.25s ease, padding 0.25s ease',
                overflow: 'hidden',
                height: '100vh',
            }}>
                <div style={{ marginBottom: '28px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <div style={{
                        fontSize: '16px', fontWeight: '600', color: '#6d28d9',
                        opacity: isOpen ? 1 : 0,
                        transition: 'opacity 0.2s ease',
                    }}>
                        The Curator
                    </div>
                    <div style={{
                        fontSize: '12px', color: '#9ca3af', marginTop: '2px',
                        opacity: isOpen ? 1 : 0,
                        transition: 'opacity 0.2s ease',
                    }}>
                        Premium Inventory
                    </div>
                </div>
                <nav style={{ flex: 1, overflow: 'hidden' }}>
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

                <div style={{ margin: '8px 0', borderTop: '1px solid #f3f4f6' }} />
                <div
                    onClick={() => navigate('/admin/profile')}
                    title={!isOpen ? (user?.name || user?.email || 'Profile') : undefined}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 8px', borderRadius: '8px',
                        cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap',
                        transition: 'background 0.15s',
                        marginBottom: '4px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <UserAvatar name={user?.name} email={user?.email} />
                    <div style={{
                        opacity: isOpen ? 1 : 0,
                        transition: 'opacity 0.2s ease',
                        overflow: 'hidden',
                        lineHeight: 1.3,
                    }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                            {user?.name || 'Admin'}
                        </div>
                        <div style={{
                            fontSize: '11px', color: '#9ca3af',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                            {user?.email || ''}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    title={!isOpen ? 'Logout' : undefined}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 8px', borderRadius: '8px',
                        cursor: 'pointer', color: '#ef4444',
                        fontSize: '14px', fontWeight: '400',
                        background: 'transparent', border: 'none',
                        width: '100%', textAlign: 'left',
                        whiteSpace: 'nowrap', overflow: 'hidden',
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <span className="st-icon--logout" style={{ flexShrink: 0 }} />
                    <span style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s ease' }}>
                        Logout
                    </span>
                </button>

            </aside>

            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Toggle sidebar"
                style={{
                    position: 'absolute', top: '16px',
                    left: isOpen ? '208px' : '48px',
                    width: '24px', height: '24px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'left 0.25s ease',
                    zIndex: 10, padding: 0,
                }}
            >
                <ChevronIcon flipped={!isOpen} />
            </button>
        </div>
    )
}

export default Sidebar