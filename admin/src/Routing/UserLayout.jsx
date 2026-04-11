import { NavLink, useLocation } from "react-router-dom";
import { removeCookie } from "@utils/helper";
import logo from "../assets/images/logo.svg";
import { Topbar } from "@Component/Topbar";

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const OrdersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const WishlistIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
  <li className="st-user-layout--sidebar__menu-item">
    <NavLink to={to}>
      {icon}
      <span>{label}</span>
    </NavLink>
  </li>
);

export const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.replace("/user", "");
    return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard";
  };

  const menuItems = [
    { to: "/user/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { to: "/user/orders", icon: <OrdersIcon />, label: "My Orders" },
    { to: "/user/cart", icon: <CartIcon />, label: "Shopping Cart" },
    { to: "/user/wishlist", icon: <WishlistIcon />, label: "Wishlist" },
    { to: "/user/profile", icon: <ProfileIcon />, label: "My Profile" },
    { to: "/user/settings", icon: <SettingsIcon />, label: "Settings" },
  ];

  const handleLogout = () => {
    removeCookie("token");
    window.location.href = "/login";
  };

  const user = {
    name: "User",
    email: "user@example.com",
    initials: "U",
  };

  return (
    <div className="st-user-layout">
      <div
        className={`st-user-layout-overlay ${sidebarOpen ? "" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="st-user-mobile-header">
        <button
          className="st-user-mobile-header__menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="st-user-mobile-header__logo">
          <img src={logo} alt="Logo" height="30" />
        </div>
      </div>

      <aside
        className={`st-user-layout--sidebar ${
          sidebarOpen ? "st-user-layout--sidebar--open" : ""
        }`}
      >
        <div className="st-user-layout--sidebar__logo">
          <h2>My Account</h2>
          <p>User Dashboard</p>
        </div>

        <nav className="st-user-layout--sidebar__nav">
          <ul className="st-user-layout--sidebar__menu">
            {menuItems.map((item) => (
              <MenuItem key={item.to} {...item} />
            ))}
            <li className="st-user-layout--sidebar__menu-item">
              <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                <LogoutIcon />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="st-user-layout--sidebar__footer">
          <div className="st-user-layout--sidebar__footer-user">
            <div className="st-user-layout--sidebar__footer-user-avatar">
              {user.initials}
            </div>
            <div className="st-user-layout--sidebar__footer-user-info">
              <p>{user.name}</p>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="st-user-layout--main">
        <Topbar
          breadcrumb={true}
          rightContent={
            <div className="st-user-topbar--breadcrumb">{getPageTitle()}</div>
          }
        />
        <div className="st-user-layout--content">{children}</div>
      </main>
    </div>
  );
};

export default UserLayout;