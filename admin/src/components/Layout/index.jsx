import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./Sidebar";
import { Topbar } from "@Component/Topbar";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "@utils/helper";
import Button from "@Component/Buttons";
import Notification from "@Component/Notifications";
import AdminNotificationSocket from "@Component/AdminNotificationSocket";

export const Layout = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getCookie("token"));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setToken(getCookie("token"));
  }, []);

  let isAdmin = false;
  if (token) {
    try {
      isAdmin = jwtDecode(token)?.user_role === 'admin';
    } catch (e) { /* invalid token */ }
  }

  return (
    <div className={`st-layout ${sidebarOpen && isAdmin ? 'st-layout--sidebar-open' : 'st-layout--sidebar-collapsed'}`}>
      {isAdmin && <AdminNotificationSocket />}
      {isAdmin && (
        <div className="st-layout__sidebar-container">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </div>
      )}

      <div className="st-layout__body">
        <Topbar
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          showMenuToggle={isAdmin}
          leftContent={!token ? (
            <div className='st-flex st-gap-2'>
              <Button onClick={() => navigate('/login')} label='login' />
              <Button onClick={() => navigate('/register')} label='Register' />
            </div>) : null
          }
        />

        <main className="st-layout__main">
          <div className="st-layout__content">
            <Outlet />
            <Notification />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;