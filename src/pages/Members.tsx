// type Props = {}

import AddNewMemberDialog from '@/components/AddNewMemberDialog';
import DeleteMemberDialog from '@/components/DeleteMemberDialog';
import EditMemberDialog from '@/components/EditMemberDialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn, getMembershipBadgeColor, getMembershipStatus } from '@/lib/utils';
import { getMembers } from '@/services/members.service';
import { Member } from '@/types/index.types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { LuLoaderCircle } from 'react-icons/lu';
import { MdMoreHoriz, MdSearch } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Members() {
  const [tableWidth, setTableWidth] = useState(0);
  const [members, setMembers] = useState<Member[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { collapsed } = useSidebar();

  const handleAddMember = (newMember: Member) => {
    setMembers((prev) => [...prev, newMember]);
    console.log(members);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers((prevMembers) =>
      prevMembers.map((m) =>
        m.id === updatedMember.id ? { ...m, ...updatedMember } : m
      )
    );
  };

  useEffect(() => {
    function updateWidth() {
      const windowWidth = window.innerWidth;

      let sidebarWidth = 0;

      if (collapsed) {
        sidebarWidth = window.innerWidth >= 640 ? 80 : 0;
      } else {
        sidebarWidth = 256;
      }

      const calculatedWidth = windowWidth - sidebarWidth - 32;
      setTableWidth(calculatedWidth);
    }

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, [collapsed]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getMembers();
        if (response.status === 200) {
          setMembers(response.data);
          setFetchError(null);
        } else {
          setFetchError(response.statusText);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setFetchError(error?.message || 'Unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center rounded-xl gap-4">
      {/* title section */}
      <div className="w-full flex flex-col justify-start items-start">
        <h1 className="font-black text-2xl uppercase text-emerald-950 tracking-wider">
          MEMBERS DATABASE
        </h1>
        <h3 className="text-lg text-neutral-800 tracking-wide">
          Manage all the members
        </h3>
      </div>

      {/* navigation section - search/sort/add */}
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-4',
          !collapsed
            ? 'xmd:flex-col xmd-plus:flex-row'
            : 'md:flex-row md:items-end md:justify-between'
        )}
      >
        {/* Left - Search */}
        <div
          className={cn(
            'flex flex-col gap-1  w-full',
            collapsed && 'md:max-w-xs'
          )}
        >
          <p className="text-sm text-neutral-700 text-left whitespace-nowrap">
            Search members
          </p>
          <div className="relative">
            <MdSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <Input className="pl-10 bg-white" placeholder="Search" />
          </div>
        </div>

        <div className="flex flex-col xs:flex-row-reverse md:flex-row xs:gap-4 justify-between items-center md:justify-end w-full">
          {/* Middle - Filters */}
          <div className="flex gap-4 w-full justify-end  md:items-end ">
            {/* Date Filter */}
            <div className="flex flex-col gap-1 justify-start items-start w-full md:w-[140px]">
              <p className="text-sm text-neutral-700">Status</p>
              <Select>
                <SelectTrigger className="bg-white w-full ">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Active</SelectItem>
                  <SelectItem value="week">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Membership Filter */}
            <div className="flex flex-col gap-1 justify-start items-start w-full md:w-[140px]">
              <p className="text-sm text-neutral-700">Membership</p>
              <Select>
                <SelectTrigger className="bg-white w-full ">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Staff Filter */}
            <div className="flex flex-col gap-1 justify-start items-start w-full md:w-[140px]">
              <p className="text-sm text-neutral-700">Staff</p>
              <Select>
                <SelectTrigger className="bg-white w-full ">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amy">Amy</SelectItem>
                  <SelectItem value="john">John</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right - Add Button */}
          <div className="  w-full md:w-auto mt-6">
            <AddNewMemberDialog onMemberCreated={handleAddMember} />
          </div>
        </div>
      </div>

      {/* displaying data section */}
      <div
        className="bg-white w-full h-full border rounded-xl  shadow-md"
        style={{ width: tableWidth }}
      >
        <Table className="w-full text-sm">
          <TableHeader className="bg-primary uppercase tracking-wide">
            <TableRow className="hover:bg-primary">
              <TableHead className="p-4 text-gray-100 text-center">
                Name
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                Unique ID
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                Membership
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                Status
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                End Date
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                Created By
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                Options
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading &&
              !fetchError &&
              members &&
              members?.length > 0 &&
              members?.map((member) => (
                <TableRow
                  key={member.id}
                  className="hover:bg-primary/15 transition-colors duration-300"
                >
                  <TableCell className="p-4 text-center font-medium">
                    {member.name}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    {member.uniqueId}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <Badge
                      className={getMembershipBadgeColor(
                        member.membership.name
                      )}
                    >
                      {member.membership.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <Badge
                      variant={
                        getMembershipStatus(member.endDate) === 'Active'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {getMembershipStatus(member.endDate)}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    {member.endDate
                      ? format(new Date(member.endDate), 'dd/MM/yyyy')
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    {member.createdBy.name}
                  </TableCell>
                  <TableCell className="p-4 flex items-center justify-center gap-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MdMoreHoriz size={25} className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            className="flex items-center justify-center gap-2 text-gray-800"
                            to={`/members/${member.id}`}
                          >
                            <FaEye /> Show Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <EditMemberDialog
                            onMemberUpdated={handleUpdateMember}
                            member={member}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <DeleteMemberDialog
                            memberId={member.id}
                            onMemberDelete={handleDeleteMember}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {loading && (
          <div className="w-full h-full flex justify-center items-center gap-2 text-primary">
            <LuLoaderCircle size={20} className="animate-spin" /> Loading
            members...
          </div>
        )}

        {fetchError && <div className="text-red-500">Error: {fetchError}</div>}

        {!loading && !fetchError && members?.length === 0 && (
          <div>No members found.</div>
        )}
      </div>
    </div>
  );
}
