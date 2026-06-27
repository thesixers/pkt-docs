import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ docs }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-button" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span className="logo-text">PKT Docs</span>
      </header>

      {/* Main Layout Grid */}
      <div className="layout-grid">
        <Sidebar docs={docs} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="main-content glass-panel">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
