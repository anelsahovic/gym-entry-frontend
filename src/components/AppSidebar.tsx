// components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FaRegAddressCard } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import LogoutButton from './LogoutButton';

type Props = {
  isCollapsed: boolean;
  handleCollapse: () => void;
};

export function AppSidebar({ isCollapsed, handleCollapse }: Props) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Scan', path: '/scan', icon: <ScanLine size={20} /> },
    { name: 'Members', path: '/members', icon: <Users size={20} /> },
    {
      name: 'Memberships',
      path: '/memberships',
      icon: <FaRegAddressCard size={20} />,
    },
  ];

  return (
    <div
      className={cn(
        'h-dvh bg-white border-r p-4 flex flex-col justify-between transition-all duration-500 z-50',
        isCollapsed
          ? 'w-0 opacity-0 sm:relative sm:w-20 sm:opacity-100'
          : 'w-64',
        'sm:static',
        'absolute sm:relative'
      )}
    >
      <div
        className="sm:hidden absolute top-4 right-4"
        onClick={handleCollapse}
      >
        <IoClose
          size={24}
          className="cursor-pointer hover:text-rose-500 transition duration-300"
        />
      </div>
      <div className="flex flex-col gap-10">
        {/* App Logo */}
        <div
          onClick={handleCollapse}
          className="flex flex-col items-center cursor-pointer"
        >
          <img src="/public/logo.png" alt="Logo" className="w-20" />
          {!isCollapsed && <span className="text-xl font-bold">Gym Entry</span>}
          {!isCollapsed && (
            <span className=" text-gray-700">Gym Management</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-100 hover:text-emerald-700',
                location.pathname === item.path
                  ? 'bg-emerald-500 text-white'
                  : 'text-muted-foreground',
                isCollapsed ? 'justify-center' : 'justify-start'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && (
                <span className="ml-3 group-hover:font-semibold">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 px-3">
        <LogoutButton isCollapsed={isCollapsed} />

        {!isCollapsed && (
          <span className="text-xs text-gray-400 mt-2 text-center">
            Copyright © 2025 @anelsahovic
          </span>
        )}
      </div>
    </div>
  );
}
