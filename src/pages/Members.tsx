// type Props = {}

import AddNewMemberDialog from '@/components/AddNewMemberDialog';
import DeleteMemberDialog from '@/components/DeleteMemberDialog';
import EditMemberDialog from '@/components/EditMemberDialog';
import { PaginationComponent } from '@/components/PaginationComponent';
import SearchInput from '@/components/SearchInput';
import SelectList from '@/components/SelectList';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { getMemberships } from '@/services/memberships.service';
import { getUsers } from '@/services/users.service';
import { Member, Membership, User } from '@/types/index.types';
import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { LuLoaderCircle } from 'react-icons/lu';
import { MdMoreHoriz } from 'react-icons/md';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function Members() {
  const [tableWidth, setTableWidth] = useState(0);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  // eslint-disable-next-line prefer-const
  let [members, setMembers] = useState<Member[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { collapsed } = useSidebar();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy');
  const sortValue = searchParams.get('sortValue');
  const page = searchParams.get('page') || '1';
  const membersPerPage = 5;

  // set table width based on sidebar and window width
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

  // fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getMembers();
        if (response.status === 200) {
          setAllMembers(response.data);
          setMembers(response.data);
          setFetchError(null);
        } else {
          setFetchError(response.statusText);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const backendMessage = error.response?.data.error;
          if (backendMessage) {
            setFetchError(backendMessage);
          } else {
            setFetchError('An unexpected error occurred.');
          }
        } else {
          setFetchError('Something went wrong. Try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await getMemberships();

        if (response.status === 200) setMemberships(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Can't load membership types");
      }
    };
    fetchMemberships();
  }, []);

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();

        if (response.status === 200) setUsers(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Can't load users");
      }
    };
    fetchUsers();
  }, []);

  // filter members by search
  useEffect(() => {
    if (search) {
      const filtered = allMembers.filter((member) =>
        member.name.trim().toLowerCase().includes(search.trim().toLowerCase())
      );
      setMembers(filtered);
    } else {
      setMembers(allMembers);
    }
  }, [search, allMembers]);

  // filter members by sorting
  useEffect(() => {
    if (sortBy && sortValue) {
      const searchValue = sortValue.trim().toLowerCase();
      let filtered: typeof allMembers = [];

      switch (sortBy) {
        case 'status':
          filtered = allMembers.filter(
            (member) =>
              getMembershipStatus(member.endDate).toLowerCase() === searchValue
          );
          break;

        case 'membership':
          filtered = allMembers.filter((member) => {
            const membershipName = member.membership.name.toLowerCase();
            return (
              membershipName === searchValue ||
              membershipName.includes(searchValue)
            );
          });
          break;

        case 'createdBy':
          filtered = allMembers.filter((member) => {
            const creatorName = member.createdBy.name.toLowerCase();
            return (
              creatorName === searchValue || creatorName.includes(searchValue)
            );
          });
          break;

        default:
          filtered = [...allMembers];
          break;
      }

      setMembers(filtered);
    } else {
      setMembers(allMembers);
    }
  }, [allMembers, sortBy, sortValue]);

  const handleAddMember = (newMember: Member) => {
    setMembers((prev) => [...prev, newMember]);
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

  const statusSelectItems = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Expired',
      value: 'expired',
    },
  ];

  const membershipsSelectItems = memberships.map((membership) => {
    return { label: membership.name, value: membership.name.toLowerCase() };
  });

  const usersSelectItems = users.map((user) => {
    return { label: user.name, value: user.name.toLowerCase() };
  });

  // paginate members
  const start = (Number(page) - 1) * membersPerPage;
  const end = start + membersPerPage;
  const pageNumbers = Math.ceil(members.length / membersPerPage);
  const endDisplay = Math.min(Number(page) * membersPerPage, members.length);
  // slice members based on pagination
  members = members.slice(start, end);

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
          <SearchInput />
        </div>

        <div className="flex flex-col xs:flex-row-reverse md:flex-row xs:gap-4 justify-between items-center md:justify-end w-full">
          {/* Middle - Filters */}
          <div className="flex gap-4 w-full justify-end  md:items-end ">
            {/* Status Filter */}
            <div className=" w-full md:w-[140px]">
              <SelectList
                label="Status"
                queryKey="status"
                items={statusSelectItems}
              />
            </div>

            {/* Membership Filter */}
            <div className=" w-full md:w-[140px]">
              <SelectList
                label="Membership"
                queryKey="membership"
                items={membershipsSelectItems}
              />
            </div>

            {/* Staff Filter */}
            <div className=" w-full md:w-[140px]">
              <SelectList
                label="User"
                queryKey="createdBy"
                items={usersSelectItems}
              />
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
        className="bg-white w-full h-full flex flex-col justify-between border rounded-xl  shadow-md"
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
        {/* pagination */}
        <div className="flex flex-col justify-center items-center gap-2 mb-4">
          <p>
            Showing <span className="font-semibold">{start + 1}</span> -{' '}
            <span className="font-semibold">{endDisplay} </span> of{' '}
            <span className="font-semibold">{allMembers.length}</span>
          </p>

          <PaginationComponent
            perPage={membersPerPage.toString()}
            pageCount={pageNumbers}
          />
        </div>

        {!loading && !fetchError && !members && (
          <div className="w-full h-full flex justify-center items-center text-neutral-700">
            No members found.
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex justify-center items-center gap-2 text-primary">
            <LuLoaderCircle size={20} className="animate-spin" /> Loading
            members...
          </div>
        )}

        {fetchError && (
          <div className="w-full h-full flex justify-center items-center text-red-500">
            Error: {fetchError}
          </div>
        )}
      </div>
    </div>
  );
}
