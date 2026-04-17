import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Topbar } from "@Component/Topbar";
// import "./styles/layout.scss";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`st-layout ${sidebarOpen ? "st-layout--sidebar-open" : "st-layout--sidebar-collapsed"}`}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      <div className="st-layout__body">
        <Topbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />

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