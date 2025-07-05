/* eslint-disable @typescript-eslint/no-unused-vars */
import { Outlet, useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import Topbar from './Topbar';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import Loading from './Loading';
import { Toaster } from './ui/sonner';
import { Badge } from './ui/badge';

export default function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isLoading]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex min-h-screen font-poppins relative">
      <Toaster position="top-center" richColors />
      <Badge className="absolute z-50000 top-1 right-1 bg-fuchsia-500">
        DEMO MODE
      </Badge>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
