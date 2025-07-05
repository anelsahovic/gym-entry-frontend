import { Outlet, useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import Topbar from './Topbar';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import Loading from './Loading';
import { Toaster } from './ui/sonner';
import { Badge } from './ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { toast } from 'sonner';

export default function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isLoading]);

  useEffect(() => {
    toast.message('Demo mode active', {
      description:
        'You are viewing a temporary version of this app for demonstration purposes only.',
      style: { background: 'oklch(58.5% 0.233 277.117)', color: 'white' },
    });
  });

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex min-h-screen font-poppins relative">
      <Toaster position="top-center" richColors />

      <HoverCard>
        <HoverCardTrigger className="absolute z-500000 top-1 right-1">
          <Badge className="absolute z-50000 top-1 right-1 bg-indigo-500">
            DEMO MODE
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent align="center">
          Demo mode is temporarily enabled for easier access in recruiting
          process.
        </HoverCardContent>
      </HoverCard>

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
