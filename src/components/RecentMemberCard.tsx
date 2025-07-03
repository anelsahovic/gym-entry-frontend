import { Member } from '@/types/index.types';
import { format, formatDistanceToNow } from 'date-fns';
import { FiUser, FiClock } from 'react-icons/fi';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { IoMdInformationCircleOutline } from 'react-icons/io';

interface RecentMemberCardProps {
  member: Member;
}

function RecentMemberCard({ member }: RecentMemberCardProps) {
  const createdDate = new Date(member.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div className="relative w-full bg-white border border-gray-100 rounded-md px-3 py-4 shadow-sm hover:shadow transition text-sm">
      <div className="flex w-full  items-center justify-start gap-3">
        {/* Left section: Icon + name  */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full">
            <FiUser className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{member.name}</span>
          </div>
        </div>

        {/* hover - card info */}
        <div className="absolute top-1 right-1">
          <HoverCard>
            <HoverCardTrigger>
              <IoMdInformationCircleOutline
                className="text-gray-600 cursor-pointer"
                size={20}
              />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="text-sm text-gray-700 p-3 space-y-2 w-64">
                {/* Member Info */}
                <div>
                  <p className="font-medium text-gray-800">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                  <p className="text-xs text-gray-500">{member.phone}</p>
                </div>

                {/* Membership Info */}
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Membership:</span>{' '}
                    {member.membership.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Start:</span>{' '}
                    {format(new Date(member.startDate), 'dd MMM yyyy')}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">End:</span>{' '}
                    {format(new Date(member.endDate), 'dd MMM yyyy')}
                  </p>
                </div>

                {/* Created Info */}
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">DOB:</span>{' '}
                    {format(new Date(member.dateOfBirth), 'dd MMM yyyy')}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Joined:</span>{' '}
                    {format(new Date(member.createdAt), 'dd MMM yyyy')}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Added By:</span>{' '}
                    {member.createdBy.name}
                  </p>
                </div>

                {/* Unique ID */}
                <div className="text-gray-400 text-xs pt-2 border-t border-gray-100">
                  ID: {member.uniqueId}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* time ago */}
        <span className="flex items-center text-gray-500 text-xs gap-1 absolute bottom-1 right-1">
          <FiClock className="w-3 h-3" />
          {timeAgo}
        </span>
      </div>
    </div>
  );
}

export default RecentMemberCard;
