import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Topbar } from "@Component/Topbar";
// import "./styles/layout.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "@utils/helper";
import Button from "@Component/Buttons";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [token, setToken] = useState(getCookie("token"));

  useEffect(() => {
    setToken(getCookie("token"));
  }, []);

  return (
    <div className={`st-layout ${sidebarOpen ? "st-layout--sidebar-open" : "st-layout--sidebar-collapsed"}`}>
      {token && (
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(prev => !prev)}
        />
      )}

      <div className="st-layout__body">
        <Topbar
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;