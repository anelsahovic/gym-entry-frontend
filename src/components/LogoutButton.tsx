import { logout } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import { cn } from '@/lib/utils';
import { MdLogout } from 'react-icons/md';

type Props = {
  isCollapsed?: boolean;
};

export default function LogoutButton({ isCollapsed }: Props) {
  const navigate = useNavigate();

  async function onSubmit() {
    try {
      const response = await logout();

      if (response.status === 200) {
        await mutate('/auth');
        navigate('/login');
      }
    } catch (error) {
      console.error('Caught error : ' + error);
    }
  }
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'group flex  w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-rose-100 hover:text-rose-700  cursor-pointer',
        isCollapsed ? 'justify-center' : 'justify-start w-full'
      )}
    >
      <button type="submit" className="flex items-center gap-2 cursor-pointer">
        <MdLogout className="text-xl rotate-180" />
        {!isCollapsed && (
          <span className="group-hover:font-semibold">Logout</span>
        )}
      </button>
    </form>
  );
}
