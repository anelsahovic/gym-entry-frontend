import { Outlet, useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import Topbar from './Topbar';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import Loading from './Loading';
import { Toaster } from './ui/sonner';

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
    <div className="flex min-h-screen font-poppins">
      <Toaster position="top-center" richColors />

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
