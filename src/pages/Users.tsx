// type Props = {}

import SearchInput from '@/components/SearchInput';
import SelectList from '@/components/SelectList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { cn, getRoleBadgeColor } from '@/lib/utils';
import { getUsers } from '@/services/users.service';
import { User } from '@/types/index.types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { LuLoaderCircle } from 'react-icons/lu';
import { MdMoreHoriz } from 'react-icons/md';
import { Link, useSearchParams } from 'react-router-dom';

export default function Users() {
  const { collapsed } = useSidebar();
  const [tableWidth, setTableWidth] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy');
  const sortValue = searchParams.get('sortValue');

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

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response.status === 200) {
          setAllUsers(response.data);
          setUsers(response.data);
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
    fetchUsers();
  }, []);

  // filter users by search
  useEffect(() => {
    if (search) {
      const filtered = allUsers.filter((user) =>
        user.name.trim().toLowerCase().includes(search.trim().toLowerCase())
      );
      setUsers(filtered);
    } else {
      setUsers(allUsers);
    }
  }, [search, allUsers]);

  // filter users by sorting
  useEffect(() => {
    if (sortBy && sortValue) {
      const searchValue = sortValue.trim().toLowerCase();
      let filtered: typeof allUsers = [];

      switch (sortBy) {
        case 'role':
          filtered = allUsers.filter((user) => {
            const role = user.role.toLowerCase();
            return role === searchValue || role.includes(searchValue);
          });
          break;

        default:
          filtered = [...allUsers];
          break;
      }

      setUsers(filtered);
    } else {
      setUsers(allUsers);
    }
  }, [allUsers, sortBy, sortValue]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center rounded-xl gap-4">
      {/* title section */}
      <div className="w-full flex flex-col justify-start items-start">
        <h1 className="font-black text-2xl uppercase text-emerald-950 tracking-wider">
          STAFF USERS DATABASE
        </h1>
        <h3 className="text-lg text-neutral-800 tracking-wide">
          Manage all the employers
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
            Search users
          </p>
          <SearchInput />
        </div>

        <div className="flex flex-col xs:flex-row-reverse md:flex-row xs:gap-4 justify-between items-center md:justify-end w-full">
          {/* Middle - Filters */}
          <div className="flex gap-4 w-full justify-end  md:items-end ">
            {/* Role Filter */}
            <div className=" w-full md:w-[140px]">
              <SelectList
                label="Role"
                queryKey="role"
                items={[
                  { label: 'Admin', value: 'ADMIN' },
                  { label: 'Staff', value: 'STAFF' },
                ]}
              />
            </div>
          </div>

          {/* Right - Add Button */}
          <div className="  w-full md:w-auto mt-6">
            <Button>Add New User</Button>
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
                E-mail
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                Role
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                Employed at
              </TableHead>
              <TableHead className="p-4 text-gray-100 text-center">
                Options
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading &&
              !fetchError &&
              users &&
              users?.length > 0 &&
              users?.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-primary/15 transition-colors duration-300"
                >
                  <TableCell className="p-4 text-center font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="p-4 text-center font-medium">
                    {user.email}
                  </TableCell>
                  <TableCell className="p-4 text-center font-medium">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-center font-medium ">
                    {format(new Date(user.createdAt), 'dd/mm/yyyy')}
                  </TableCell>

                  <TableCell className="p-4 flex items-center justify-center gap-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MdMoreHoriz size={25} className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            className="flex items-center justify-center gap-2 text-gray-800"
                            to={`/users/${user.id}`}
                          >
                            <FaEye /> Show Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Delete User</DropdownMenuItem>
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
            users...
          </div>
        )}

        {fetchError && (
          <div className="w-full h-full flex justify-center items-center text-red-500">
            Error: {fetchError}
          </div>
        )}

        {!loading && !fetchError && users?.length === 0 && (
          <div className="w-full h-full flex justify-center items-center text-neutral-700">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
