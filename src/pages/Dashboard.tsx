import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { FiUserCheck, FiUserPlus, FiUsers } from 'react-icons/fi';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import SmallStatCard from '@/components/SmallStatCard';
import { FaRegAddressCard } from 'react-icons/fa';
import { getMembers } from '@/services/members.service';
import { Member, Membership } from '@/types/index.types';
import { toast } from 'sonner';
import { getMemberships } from '@/services/memberships.service';
import {
  isBefore,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
} from 'date-fns';
import RecentMemberCard from '@/components/RecentMemberCard';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { ChartLineDefault } from '@/components/ChartLineDefault';
import { getLastThreeMonthsRevenue } from '@/lib/utils';
import { ChartRadialStacked } from '@/components/ChartRadialStacked';

export default function Dashboard() {
  const { isLoading, name, username, userId } = useAuth();
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberships, setMemberships] = useState<Membership[] | null>(null);
  const [loadingMemberships, setLoadingMemberships] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const response = await getMembers();

        if (response.status === 200) setMembers(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Can't load membership types");
      } finally {
        setLoadingMembers(false);
      }
    };
    const fetchMemberships = async () => {
      try {
        setLoadingMemberships(true);
        const response = await getMemberships();

        if (response.status === 200) setMemberships(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Can't load membership types");
      } finally {
        setLoadingMemberships(false);
      }
    };

    fetchMembers();
    fetchMemberships();
  }, []);

  const activeMembers = members?.filter((member) =>
    isBefore(new Date(), member.endDate)
  );

  const membersCreatedByLoggedInUser = members?.filter(
    (member) => userId === member.staffId
  );

  const mostRecentMembers = members?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let chartData;
  if (members && memberships) {
    chartData = getLastThreeMonthsRevenue(members, memberships);
  }

  const todaysMembers = members?.filter((member) => isToday(member.updatedAt));
  const thisWeeksMembers = members?.filter((member) =>
    isThisWeek(member.updatedAt)
  );
  const thisMonthsMembers = members?.filter((member) =>
    isThisMonth(member.updatedAt)
  );
  const thisYearsMembers = members?.filter((member) =>
    isThisYear(member.updatedAt)
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
      {/* title section */}
      <div className="w-full flex flex-col justify-start items-start border-b pb-2 border-neutral-400/30">
        <h1 className="font-black text-2xl uppercase text-emerald-950 tracking-wider">
          Dashboard
        </h1>
        <h3 className="text-lg text-neutral-800 tracking-wide">
          Quick insights at a glance
        </h3>
      </div>

      {/* charts and profile section */}
      <div className="w-full h-full grid grid-cols-4 gap-4">
        {/* charts and data */}
        <div className="col-span-4 md:col-span-3 h-full">
          <div className="w-full h-full flex flex-col justify-between items-center gap-4">
            {/* first row */}
            <div className="w-full h-[30%] md:h-[15%]   grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* number of all members */}
              {loadingMembers && !members && <Loading />}
              {!loadingMembers && members && (
                <SmallStatCard
                  title="Total Members"
                  number={members.length}
                  icon={FiUsers}
                  color="blue"
                />
              )}

              {/* number of active members */}
              {loadingMembers && !members && <Loading />}
              {!loadingMembers && members && (
                <SmallStatCard
                  title="Active Members"
                  number={activeMembers ? activeMembers.length : 0}
                  icon={FiUserCheck}
                  color="green"
                />
              )}

              {/* number of members created by logged in user */}
              {loadingMembers && !members && <Loading />}
              {!loadingMembers && members && (
                <SmallStatCard
                  title="Created Members"
                  number={
                    membersCreatedByLoggedInUser
                      ? membersCreatedByLoggedInUser.length
                      : 0
                  }
                  icon={FiUserPlus}
                  color="yellow"
                />
              )}

              {/* number of memberships */}
              {loadingMemberships && !memberships && <Loading />}
              {!loadingMemberships && memberships && (
                <SmallStatCard
                  title="Total Memberships"
                  number={memberships.length}
                  icon={FaRegAddressCard}
                  color="purple"
                />
              )}
            </div>

            {/* Second row */}
            <div className="w-full h-[50%] md:h-[60%] grid grid-cols-3 gap-4">
              {/* Chart section */}
              <Card className="col-span-3 md:col-span-2 h-full overflow-hidden">
                <CardContent className="p-0 m-0">
                  <ChartLineDefault chartData={chartData} />
                </CardContent>
              </Card>

              <Card className="hidden md:flex md:col-span-1 h-full p-0 py-3 ">
                <CardContent className="h-full flex flex-col justify-between gap-1 p-0 px-1">
                  <div className="flex  items-center justify-center gap-2 text-zinc-700">
                    <FaClockRotateLeft />

                    <h2>Recently added </h2>
                  </div>
                  <div className="flex flex-col gap-2 h-60 overflow-y-scroll">
                    {loadingMembers && !members && <Loading />}
                    {!loadingMembers &&
                      members &&
                      mostRecentMembers?.map((member) => (
                        <RecentMemberCard member={member} />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* third row */}
            <div className="w-full h-[20%] md:h-[25%] grid grid-cols-2 sm:grid-cols-3 gap-4 ">
              <Card className="p-0 m-0 h-32 sm:h-full  overflow-hidden">
                <CardContent className="p-0 m-0">
                  {loadingMembers && !members && <Loading />}
                  {!loadingMembers && members && (
                    <ChartRadialStacked
                      totalVisitors={todaysMembers?.length}
                      chartColor="chart-2"
                      label="Today"
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="p-0 m-0 h-32 sm:h-full overflow-hidden">
                <CardContent className="p-0 m-0">
                  {loadingMembers && !members && <Loading />}
                  {!loadingMembers && members && (
                    <ChartRadialStacked
                      totalVisitors={thisWeeksMembers?.length}
                      chartColor="chart-4"
                      label="This week"
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="p-0 m-0 h-32 sm:h-full overflow-hidden">
                <CardContent className="p-0 m-0">
                  {loadingMembers && !members && <Loading />}
                  {!loadingMembers && members && (
                    <ChartRadialStacked
                      totalVisitors={thisMonthsMembers?.length}
                      chartColor="chart-1"
                      label="This month"
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="p-0 m-0 h-32 sm:h-full overflow-hidden sm:hidden">
                <CardContent className="p-0 m-0">
                  {loadingMembers && !members && <Loading />}
                  {!loadingMembers && members && (
                    <ChartRadialStacked
                      totalVisitors={thisYearsMembers?.length}
                      chartColor="chart-3"
                      label="This year"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* user profile */}
        <div className="hidden md:flex col-span-1 bg-white rounded-xl p-4 shadow-sm border flex-col justify-around items-center text-center gap-2 overflow-hidden">
          {/* Welcome message */}
          <h2 className=" flex flex-col text-lg font-semibold text-gray-800">
            Welcome back,
            <span className="text-primary">
              {' '}
              {name && name.split(' ')[0]} 👋
            </span>
          </h2>

          {/* Avatar and username */}
          <div className="flex flex-col justify-center items-center gap-5">
            <div className="size-20 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold shadow-sm">
              {name && name?.charAt(0)}
            </div>

            <div>
              <h2 className="font-medium">{name && name}</h2>
              <h4 className="text-sm">@{username && username}</h4>
            </div>
          </div>

          {/* calendar */}
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-lg "
          />
        </div>
      </div>
    </div>
  );
}
