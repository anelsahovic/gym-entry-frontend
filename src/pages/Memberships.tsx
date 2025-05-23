// type Props = {}

import AddNewMembershipDialog from '@/components/AddNewMembershipDialog';
import Loading from '@/components/Loading';
import MembershipCard from '@/components/MembershipCard';
import { PaginationComponent } from '@/components/PaginationComponent';
import SearchInput from '@/components/SearchInput';
import SelectList from '@/components/SelectList';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { getMemberships } from '@/services/memberships.service';
import { Membership } from '@/types/index.types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function Memberships() {
  const { collapsed } = useSidebar();

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // eslint-disable-next-line prefer-const
  let [memberships, setMemberships] = useState<Membership[]>([]);
  const [allMemberships, setAllMemberships] = useState<Membership[]>([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy');
  const order = searchParams.get('order');
  const page = searchParams.get('page') || '1';
  const membershipsPerPage = 3;

  // fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await getMemberships();
        if (response.status === 200) {
          setAllMemberships(response.data);
          setMemberships(response.data);
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
        toast.error('Uh oh! Something went wrong!');
      } finally {
        setLoading(false);
      }
    };
    fetchMemberships();
  }, []);

  // filter memberships by search
  useEffect(() => {
    if (search) {
      const filtered = allMemberships.filter((user) =>
        user.name.trim().toLowerCase().includes(search.trim().toLowerCase())
      );
      setMemberships(filtered);
    } else {
      setMemberships(allMemberships);
    }
  }, [search, allMemberships]);

  // filter memberships by sorting
  useEffect(() => {
    if (sortBy && order) {
      let filtered: typeof allMemberships = [];

      switch (sortBy) {
        case 'duration':
          filtered = [...allMemberships].sort((a, b) =>
            order === 'asc'
              ? a.durationDays - b.durationDays
              : b.durationDays - a.durationDays
          );
          break;

        case 'price':
          filtered = [...allMemberships].sort((a, b) =>
            order === 'asc' ? a.price - b.price : b.price - a.price
          );
          break;

        default:
          filtered = [...allMemberships];
          break;
      }

      setMemberships(filtered);
    } else {
      setMemberships(allMemberships);
    }
  }, [allMemberships, order, sortBy]);

  const handleAddMembership = (membership: Membership) => {
    setMemberships((prev) => [...prev, membership]);
  };

  const handleDeleteMembership = (membership: Membership) => {
    setMemberships((prev) =>
      prev.filter((prevMembership) => prevMembership.id !== membership.id)
    );
  };

  // paginate memberships
  const start = (Number(page) - 1) * membershipsPerPage;
  const end = start + membershipsPerPage;
  const pageNumbers = Math.ceil(memberships.length / membershipsPerPage);
  const endDisplay = Math.min(
    Number(page) * membershipsPerPage,
    memberships.length
  );
  // slice memberships based on pagination
  memberships = memberships.slice(start, end);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center rounded-xl gap-10">
      {/* title section */}
      <div className="w-full flex flex-col justify-start items-start">
        <h1 className="font-black text-2xl uppercase text-emerald-950 tracking-wider">
          MEMBERSHIPS DATABASE
        </h1>
        <h3 className="text-lg text-neutral-800 tracking-wide">
          Manage all the memberships
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
            Search memberships
          </p>
          <SearchInput />
        </div>

        <div className="flex flex-col xs:flex-row-reverse md:flex-row xs:gap-4 justify-between items-center md:justify-end w-full">
          {/* Middle - Filters */}
          <div className="flex gap-4 w-full justify-end  md:items-end ">
            {/* Role Filter */}
            <div className=" w-full md:w-[140px]">
              <SelectList
                label="Sort by"
                queryKey="role"
                items={[
                  {
                    label: '↑ Duration',
                    value: 'duration_asc',
                  },
                  {
                    label: '↓ Duration',
                    value: 'duration_desc',
                  },
                  {
                    label: '↑ Price',
                    value: 'price_asc',
                  },
                  {
                    label: '↓ Price',
                    value: 'price_desc',
                  },
                ]}
              />
            </div>
          </div>

          {/* Right - Add Button */}
          <div className="  w-full md:w-auto mt-6">
            <AddNewMembershipDialog onMembershipCreated={handleAddMembership} />
          </div>
        </div>
      </div>

      {/* displaying data section */}
      {loading && <Loading />}

      {fetchError && (
        <div className="p-2 bg-rose-200 text-rose-600">
          Error occurred: {fetchError}
        </div>
      )}

      {!loading && !fetchError && memberships && (
        <>
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-3  gap-6 auto-rows-auto">
            {memberships.map((membership) => (
              <MembershipCard
                key={membership.id}
                membershipProp={membership}
                onMembershipDelete={handleDeleteMembership}
              />
            ))}
          </div>

          {/* pagination */}
          <div className="flex flex-col justify-center items-center gap-2 mb-4">
            <p>
              Showing <span className="font-semibold">{start + 1}</span> -{' '}
              <span className="font-semibold">{endDisplay} </span> of{' '}
              <span className="font-semibold">{allMemberships.length}</span>
            </p>

            <PaginationComponent
              perPage={membershipsPerPage.toString()}
              pageCount={pageNumbers}
            />
          </div>
        </>
      )}
    </div>
  );
}
