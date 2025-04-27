import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import Topbar from './Topbar';
import { useState } from 'react';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AppSidebar isCollapsed={collapsed} handleCollapse={handleCollapse} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar handleCollapse={handleCollapse} />

        {/* Page Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
