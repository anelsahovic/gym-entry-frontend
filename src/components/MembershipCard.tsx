import { Membership } from '@/types/index.types';
import { format } from 'date-fns';
import { FaBarcode, FaRegUser } from 'react-icons/fa';
import { MdMoreHoriz } from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type Props = {
  membership: Membership;
};

export default function MembershipCard({ membership }: Props) {
  return (
    <div className="relative h-64  rounded-xl p-2 bg-gradient-to-br from-rose-500 via-orange-500 to-red-500 border border-neutral-200 shadow-lg hover:shadow-2xl transition-all duration-300 w-full max-w-sm">
      <div className="flex flex-col justify-between gap-4 w-full h-full rounded-xl border border-dashed border-white/50 bg-white/10 backdrop-blur-sm p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-full border-2 border-white bg-white/10">
            <FaRegUser size={26} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white text-center truncate">
            {membership.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MdMoreHoriz size={25} className="cursor-pointer text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Show Details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Membership Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-md text-sm text-neutral-800 shadow-sm">
            <span className="font-medium">Price:</span>
            <span>${membership.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-md text-sm text-neutral-800 shadow-sm">
            <span className="font-medium">Duration:</span>
            <span>
              {membership.durationDays}{' '}
              {membership.durationDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-md text-sm text-neutral-800 shadow-sm">
            <span className="font-medium">Created:</span>
            <span>{format(new Date(membership.createdAt), 'dd/MM/yyyy')}</span>
          </div>
        </div>

        {/* Footer Icon */}
        <div className="flex justify-between items-center  text-[8px] text-white">
          <FaBarcode size={30} />
          <p className="text-[8px] text-white">{membership.id}</p>
        </div>
      </div>
    </div>
  );
}
