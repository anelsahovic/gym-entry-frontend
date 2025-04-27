import { useLocation } from 'react-router-dom';
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

type Props = {
  handleCollapse: () => void;
};

export default function Topbar({ handleCollapse }: Props) {
  const location = useLocation();
  const { name, email, role } = useAuth();

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, dd/MM/yyyy');

  const pageTitle =
    location.pathname === '/'
      ? 'Dashboard'
      : location.pathname === '/members'
      ? 'Members'
      : location.pathname === '/memberships'
      ? 'Memberships'
      : 'Scan';
  return (
    <div className="h-14 bg-white flex justify-between items-center px-8 shadow">
      <div className="flex items-center justify-center gap-4">
        <div className="border-r border-gray-900 pr-4">
          <FiSidebar
            size={20}
            className="cursor-pointer hover:text-emerald-600 transition duration-300"
            onClick={handleCollapse}
          />
        </div>
        <h1 className="font-bold text-lg">{pageTitle}</h1>
        <p className="hidden md:flex">{formattedDate}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-9 cursor-pointer hover:ring-2 hover:ring-primary transition">
            <AvatarFallback>
              <FaRegUser className="text-xl" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 p-2">
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{role}</span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-sm">{email}</DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="w-full">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
