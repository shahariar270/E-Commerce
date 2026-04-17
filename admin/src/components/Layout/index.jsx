import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCookie, removeCookie } from "@utils/helper";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "../../store/slices/authSlice";
import { Topbar } from "@Component/Topbar";

const Icon = ({ d, extra }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {extra}
    <path d={d} />
  </svg>
);

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
const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
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
const CategoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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

const MENU_CONFIG = {
  admin: {
    title: "Admin Panel",
    subtitle: "E-commerce Dashboard",
    items: [
      { to: "/admin/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
      { to: "/admin/products", icon: <ProductsIcon />, label: "Products" },
      { to: "/admin/orders", icon: <OrdersIcon />, label: "Orders" },
      { to: "/admin/categories", icon: <CategoryIcon />, label: "Categories" },
      { to: "/admin/settings", icon: <SettingsIcon />, label: "Settings" },
      { to: "/admin/profile", icon: <ProfileIcon />, label: "Profile" },
    ],
  },
  buyer: {
    title: "My Account",
    subtitle: "User Dashboard",
    items: [
      { to: "/product", icon: <ProductsIcon />, label: "Product" },
      { to: "/orders", icon: <OrdersIcon />, label: "My Orders" },
      { to: "/cart", icon: <CartIcon />, label: "Shopping Cart" },
      { to: "/wishlist", icon: <WishlistIcon />, label: "Wishlist" },
      { to: "/profile", icon: <ProfileIcon />, label: "My Profile" },
      { to: "/settings", icon: <SettingsIcon />, label: "Settings" },
    ],
  },
};

const PREFIX = { admin: "st-layout", buyer: "st-user-layout" };

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: reduxUser, loading } = useSelector((state) => state.auth);

  const token = getCookie("token");
  const isPublicRoute = location.pathname === "/" || location.pathname.startsWith("/product");
  const isProtectedRoute = location.pathname.startsWith("/admin") || !isPublicRoute;

  useEffect(() => {
    const checkTokenValidity = () => {
      const latestToken = getCookie("token");
      if (!latestToken) {
        removeCookie("token");
        if (isProtectedRoute) {
          navigate("/login", { replace: true });
        }
        return;
      }

      try {
        const decoded = jwtDecode(latestToken);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          removeCookie("token");
          if (isProtectedRoute) {
            navigate("/login", { replace: true });
          }
        }
      } catch {
        removeCookie("token");
        if (isProtectedRoute) {
          navigate("/login", { replace: true });
        }
      }
    };

    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 30 * 1000);
    return () => clearInterval(interval);
  }, [navigate, isProtectedRoute]);

  if (!token && isProtectedRoute) {
    removeCookie("token");
    return <Navigate to="/login" replace />;
  }

  let role = "buyer";
  let user = {
    name: "User",
    email: "user@example.com",
    initials: "U",
  };

  try {
    const decoded = jwtDecode(token);
    role = decoded.user_role ?? "buyer";
    user = {
      name: decoded.name ?? (role === "admin" ? "Admin User" : "User"),
      email: decoded.email ?? `${role}@example.com`,
      initials: decoded.initials ?? (role === "admin" ? "AU" : "U"),
    };
  } catch {
    removeCookie("token");
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (token && !reduxUser) {
      dispatch(getProfile());
    }
  }, [dispatch, token, reduxUser]);

  // Use Redux user if available, otherwise fallback to JWT
  const displayUser = reduxUser ? {
    name: `${reduxUser.first_name} ${reduxUser.last_name}`.trim(),
    email: reduxUser.email,
    initials: `${reduxUser.first_name?.charAt(0) || ''}${reduxUser.last_name?.charAt(0) || reduxUser.user_name?.charAt(0) || ''}`.toUpperCase(),
  } : user;

  const config = MENU_CONFIG[role] ?? MENU_CONFIG.buyer;
  const p = PREFIX[role] ?? PREFIX.buyer;

  const getPageTitle = () => {
    const path = location.pathname.replace(/^\/(admin\/)?/, "");
    return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard";
  };

  const handleLogout = () => {
    removeCookie("token");
    window.location.href = "/login";
  };

  return (
    <div className={p}>
      <div
        className={`${p}-overlay ${sidebarOpen ? "" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`${p === "st-layout" ? "st-mobile-header" : "st-user-mobile-header"}`}>
        <button
          className={`${p === "st-layout" ? "st-mobile-header" : "st-user-mobile-header"}__menu-btn`}
          onClick={() => setSidebarOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className={`${p === "st-layout" ? "st-mobile-header" : "st-user-mobile-header"}__logo`}>
          {/* <img src={logo} alt="Logo" height="30" /> */}
        </div>
      </div>

      <aside className={`${p}--sidebar ${sidebarOpen ? `${p}--sidebar--open` : ""}`}>
        <div className={`${p}--sidebar__logo`}>
          <h2>{config.title}</h2>
          <p>{config.subtitle}</p>
        </div>

        <nav className={`${p}--sidebar__nav`}>
          <ul className={`${p}--sidebar__menu`}>
            {config.items.map((item) => (
              <li key={item.to} className={`${p}--sidebar__menu-item`}>
                <NavLink to={item.to} onClick={() => setSidebarOpen(false)}>
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            <li className={`${p}--sidebar__menu-item`}>
              <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                <LogoutIcon />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={`${p}--sidebar__footer`}>
          <div className={`${p}--sidebar__footer-user`}>
            <div className={`${p}--sidebar__footer-user-avatar`}>{displayUser.initials || displayUser.name?.charAt(0).toUpperCase()}</div>
            <div className={`${p}--sidebar__footer-user-info`}>
              <p>{displayUser.name}</p>
              <span>{displayUser.email}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className={`${p}--main`}>
        <Topbar
          breadcrumb={true}
          rightContent={
            <div className={`${p === "st-layout" ? "st-topbar" : "st-user-topbar"}--breadcrumb`}>
              {getPageTitle()}
            </div>
          }
        />
        <div className={`${p}--content`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;