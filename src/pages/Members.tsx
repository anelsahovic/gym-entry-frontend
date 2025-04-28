// type Props = {}

import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { MdSearch } from 'react-icons/md';

export default function Members() {
  const [tableWidth, setTableWidth] = useState(0);
  const { collapsed } = useSidebar();

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
              <p className="text-sm text-neutral-700">Date</p>
              <Select>
                <SelectTrigger className="bg-white w-full ">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
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
            <Button className="w-full flex justify-center items-center gap-2 md:w-auto">
              <FaPlus />
              <span className="hidden  lg:flex">Add New Member</span>
            </Button>
          </div>
        </div>
      </div>

      {/* displaying data section */}
      <div
        className="bg-white w-full h-full border rounded-xl  shadow-md  "
        style={{ width: tableWidth }}
      >
        <Table className="w-full h-full text-sm rounded-xl overflow-scroll  ">
          <TableHeader className="bg-primary uppercase tracking-wide">
            <TableRow className="hover:bg-primary">
              <TableHead className="p-4 text-gray-100">Name</TableHead>
              <TableHead className="p-4 text-gray-100">Email</TableHead>
              <TableHead className="p-4 text-gray-100">Phone</TableHead>
              <TableHead className="p-4 text-gray-100">Date of Birth</TableHead>
              <TableHead className="p-4 text-gray-100">Unique ID</TableHead>
              <TableHead className="p-4 text-gray-100">Start Date</TableHead>
              <TableHead className="p-4 text-gray-100">End Date</TableHead>
              <TableHead className="p-4 text-gray-100">Membership</TableHead>
              <TableHead className="p-4 text-gray-100">Created By</TableHead>
              <TableHead className="p-4 text-gray-100">Created On</TableHead>
              <TableHead className="p-4 text-center text-gray-100">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow className="hover:bg-emerald-50 transition-colors duration-300 ">
              <TableCell className="p-4 font-medium">John Doe</TableCell>
              <TableCell className="p-4">johndoe@mail.com</TableCell>
              <TableCell className="p-4">123123131</TableCell>
              <TableCell className="p-4">12/12/2000</TableCell>
              <TableCell className="p-4">NI109</TableCell>
              <TableCell className="p-4">01/02/2025</TableCell>
              <TableCell className="p-4">01/03/2025</TableCell>
              <TableCell className="p-4">Monthly</TableCell>
              <TableCell className="p-4">Amy</TableCell>
              <TableCell className="p-4">01/01/2025</TableCell>
              <TableCell className="p-4 flex items-center justify-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-emerald-100"
                >
                  <FaEdit className="text-emerald-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-rose-100"
                >
                  <FaTrashAlt className="text-rose-600" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-emerald-50 transition-colors duration-300">
              <TableCell className="p-4 font-medium">John Doe</TableCell>
              <TableCell className="p-4">johndoe@mail.com</TableCell>
              <TableCell className="p-4">123123131</TableCell>
              <TableCell className="p-4">12/12/2000</TableCell>
              <TableCell className="p-4">NI109</TableCell>
              <TableCell className="p-4">01/02/2025</TableCell>
              <TableCell className="p-4">01/03/2025</TableCell>
              <TableCell className="p-4">Monthly</TableCell>
              <TableCell className="p-4">Amy</TableCell>
              <TableCell className="p-4">01/01/2025</TableCell>
              <TableCell className="p-4 flex items-center justify-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-emerald-100"
                >
                  <FaEdit className="text-emerald-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-rose-100"
                >
                  <FaTrashAlt className="text-rose-600" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-emerald-50 transition-colors duration-300">
              <TableCell className="p-4 font-medium">John Doe</TableCell>
              <TableCell className="p-4">johndoe@mail.com</TableCell>
              <TableCell className="p-4">123123131</TableCell>
              <TableCell className="p-4">12/12/2000</TableCell>
              <TableCell className="p-4">NI109</TableCell>
              <TableCell className="p-4">01/02/2025</TableCell>
              <TableCell className="p-4">01/03/2025</TableCell>
              <TableCell className="p-4">Monthly</TableCell>
              <TableCell className="p-4">Amy</TableCell>
              <TableCell className="p-4">01/01/2025</TableCell>
              <TableCell className="p-4 flex items-center justify-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-emerald-100"
                >
                  <FaEdit className="text-emerald-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-rose-100"
                >
                  <FaTrashAlt className="text-rose-600" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-emerald-50 transition-colors duration-300">
              <TableCell className="p-4 font-medium">John Doe</TableCell>
              <TableCell className="p-4">johndoe@mail.com</TableCell>
              <TableCell className="p-4">123123131</TableCell>
              <TableCell className="p-4">12/12/2000</TableCell>
              <TableCell className="p-4">NI109</TableCell>
              <TableCell className="p-4">01/02/2025</TableCell>
              <TableCell className="p-4">01/03/2025</TableCell>
              <TableCell className="p-4">Monthly</TableCell>
              <TableCell className="p-4">Amy</TableCell>
              <TableCell className="p-4">01/01/2025</TableCell>
              <TableCell className="p-4 flex items-center justify-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-emerald-100"
                >
                  <FaEdit className="text-emerald-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-rose-100"
                >
                  <FaTrashAlt className="text-rose-600" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-emerald-50 transition-colors duration-300">
              <TableCell className="p-4 font-medium">John Doe</TableCell>
              <TableCell className="p-4">johndoe@mail.com</TableCell>
              <TableCell className="p-4">123123131</TableCell>
              <TableCell className="p-4">12/12/2000</TableCell>
              <TableCell className="p-4">NI109</TableCell>
              <TableCell className="p-4">01/02/2025</TableCell>
              <TableCell className="p-4">01/03/2025</TableCell>
              <TableCell className="p-4">Monthly</TableCell>
              <TableCell className="p-4">Amy</TableCell>
              <TableCell className="p-4">01/01/2025</TableCell>
              <TableCell className="p-4 flex items-center justify-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-emerald-100"
                >
                  <FaEdit className="text-emerald-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-rose-100"
                >
                  <FaTrashAlt className="text-rose-600" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
