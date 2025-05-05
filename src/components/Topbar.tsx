import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { FaRegUser } from 'react-icons/fa';
import useAuth from '@/hooks/useAuth';
import { FiSidebar } from 'react-icons/fi';
import LogoutButton from './LogoutButton';
import { useSidebar } from '@/contexts/SidebarContext';
import { getRoleBadgeColor } from '@/lib/utils';
import { Badge } from './ui/badge';
import { CgOptions } from 'react-icons/cg';

export default function Topbar() {
  const location = useLocation();
  const { userId, name, email, role } = useAuth();
  const { toggleSidebar } = useSidebar();

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, dd/MM/yyyy');

  const pageTitle =
    location.pathname === '/'
      ? 'Dashboard'
      : location.pathname === '/members' &&
        location.pathname.includes('/members')
      ? 'Members'
      : location.pathname === '/memberships' &&
        location.pathname.includes('/memberships')
      ? 'Memberships'
      : location.pathname === '/users' && location.pathname.includes('/users')
      ? 'Users'
      : location.pathname === '/scan' && location.pathname.includes('/scan')
      ? 'Scan'
      : 'Gym Entry';
  return (
    <div className="h-14 bg-white flex justify-between items-center px-8 shadow">
      <div className="flex items-center justify-center gap-4">
        <div className="border-r border-gray-900 pr-4">
          <FiSidebar
            size={20}
            className="cursor-pointer hover:text-primary transition duration-300"
            onClick={toggleSidebar}
          />
        </div>
        <h1 className="font-bold text-lg">{pageTitle}</h1>
        <p className="hidden md:flex">{formattedDate}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-9 cursor-pointer hover:ring-2 hover:ring-primary transition duration-200">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <FaRegUser className="text-xl" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-3 rounded-xl shadow-xl border bg-white">
          {/* User Info */}
          <DropdownMenuLabel className="flex items-center justify-start gap-2">
            {/* left - avatar/image */}
            <div className="size-14 rounded-full border">
              <img src="/images/user-icon.png" alt="user icon" />
            </div>

            {/* right - User info */}

            <div className="flex flex-col">
              <div className=" flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {name ? name : 'N/A'}
                </span>
                <Badge className={getRoleBadgeColor(role ? role : 'N/a')}>
                  {role ? role : 'N/A'}
                </Badge>
              </div>
              <span className="text-neutral-700">{email ? email : 'N/A'}</span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* My Profile */}
          <DropdownMenuItem className="text-sm text-gray-700 px-2 py-2 rounded-md hover:bg-muted transition">
            <Link
              to={`/users/${userId}`}
              className="flex items-center justify-start gap-1 w-full h-full"
            >
              <CgOptions className="text-neutral-500" size={15} />
              <span className="text-neutral-700">Profile Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem className="text-sm text-red-600 font-medium px-2 py-2 rounded-md hover:bg-red-50 transition">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
