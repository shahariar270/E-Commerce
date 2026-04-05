import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Topbar } from "../../components/Topbar";
import logo from "../../assets/images/logo.svg";

// Menu icons as SVG components
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ProductsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const OrdersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CategoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MenuItem = ({ to, icon, label, onClick }) => (
  <li className="st-layout--sidebar__menu-item">
    <NavLink to={to} >
      {icon}
      <span>{label}</span>
    </NavLink>
  </li>
);

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get page title from URL
  const getPageTitle = () => {
    const path = location.pathname.replace("/", "");
    return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard";
  };

  const menuItems = [
    { to: "/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { to: "/products", icon: <ProductsIcon />, label: "Products" },
    { to: "/orders", icon: <OrdersIcon />, label: "Orders" },
    { to: "/categories", icon: <CategoryIcon />, label: "Categories" },
    { to: "/settings", icon: <SettingsIcon />, label: "Settings" },
    { to: "/profile", icon: <ProfileIcon />, label: "Profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const user = {
    name: "Admin User",
    email: "admin@example.com",
    initials: "AU",
  };

  return (
    <div className="st-layout">
      <div
        className={`st-layout-overlay ${sidebarOpen ? "" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile header */}
      <div className="st-mobile-header">
        <button
          className="st-mobile-header__menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="st-mobile-header__logo">
          <img src={logo} alt="Logo" height="30" />
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`st-layout--sidebar ${
          sidebarOpen ? "st-layout--sidebar--open" : ""
        }`}
      >
        <div className="st-layout--sidebar__logo">
          <h2>Admin Panel</h2>
          <p>E-commerce Dashboard</p>
        </div>

        <nav className="st-layout--sidebar__nav">
          <ul className="st-layout--sidebar__menu">
            {menuItems.map((item) => (
              <MenuItem key={item.to} {...item} />
            ))}
            <li className="st-layout--sidebar__menu-item">
              <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                <LogoutIcon />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="st-layout--sidebar__footer">
          <div className="st-layout--sidebar__footer-user">
            <div className="st-layout--sidebar__footer-user-avatar">
              {user.initials}
            </div>
            <div className="st-layout--sidebar__footer-user-info">
              <p>{user.name}</p>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="st-layout--main">
        <Topbar
          breadcrumb={true}
          rightContent={
            <div className="st-topbar--breadcrumb">{getPageTitle()}</div>
          }
        />
        <div className="st-layout--content">{children}</div>
      </main>
    </div>
  );
};

export default Layout;