import React, { useState } from 'react'

const NAV_ITEMS = [
    {
        label: 'Overview',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        label: 'Orders',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        ),
    },
    {
        label: 'Products',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
]

const BOTTOM_ITEMS = [
    {
        label: 'Profile',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        label: 'Wishlist',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    },
    {
        label: 'Settings',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
]

const ChevronIcon = ({ flipped }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        style={{ transition: 'transform 0.25s', transform: flipped ? 'rotate(180deg)' : 'none' }}
    >
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [activeItem, setActiveItem] = useState('Products')

    return (
        <div className="st-layout--sidebar-wrapper" style={{ position: 'relative', display: 'flex' }}>
            <aside
                style={{
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
                }}
            >
                {/* Logo */}
                <div style={{ marginBottom: '28px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <div
                        style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#6d28d9',
                            opacity: isOpen ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        The Curator
                    </div>
                    <div
                        style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            marginTop: '2px',
                            opacity: isOpen ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        Premium Inventory
                    </div>
                </div>

                {NAV_ITEMS.map(({ label, icon }) => (
                    <NavItem
                        key={label}
                        label={label}
                        icon={icon}
                        isOpen={isOpen}
                        isActive={activeItem === label}
                        onClick={() => setActiveItem(label)}
                    />
                ))}

                <div style={{ margin: '8px 0', borderTop: '1px solid #f3f4f6' }} />

                {BOTTOM_ITEMS.map(({ label, icon }) => (
                    <NavItem
                        key={label}
                        label={label}
                        icon={icon}
                        isOpen={isOpen}
                        isActive={activeItem === label}
                        onClick={() => setActiveItem(label)}
                    />
                ))}
            </aside>

            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Toggle sidebar"
                style={{
                    position: 'absolute',
                    top: '16px',
                    left: isOpen ? '208px' : '48px',
                    width: '24px',
                    height: '24px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'left 0.25s ease',
                    zIndex: 10,
                    padding: 0,
                }}
            >
                <ChevronIcon flipped={!isOpen} />
            </button>
        </div>
    )
}

const NavItem = ({ label, icon, isOpen, isActive, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: isActive ? '#6d28d9' : '#6b7280',
            fontWeight: isActive ? '500' : '400',
            fontSize: '14px',
            background: isActive ? '#ede9fe' : 'transparent',
            border: 'none',
            width: '100%',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            marginBottom: '2px',
            transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f9fafb' }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
    >
        <span style={{ flexShrink: 0 }}>{icon}</span>
        <span style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s ease' }}>{label}</span>
    </button>
)

export default Sidebar