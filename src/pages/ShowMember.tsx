import Loading from '@/components/Loading';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { getMembershipStatus } from '@/lib/utils';
import { getMemberById } from '@/services/members.service';
import { Member } from '@/types/index.types';
import { format } from 'date-fns';
import { Calendar, Phone, Shield, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RiAdminLine } from 'react-icons/ri';
import { FaRegCreditCard, FaRegUser } from 'react-icons/fa';
import { MdAlternateEmail } from 'react-icons/md';
import DeleteMemberDialog from '@/components/DeleteMemberDialog';
import EditMemberDialog from '@/components/EditMemberDialog';

export default function ShowMember() {
  const { id } = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [responseError, setResponseError] = useState<string | null>(null);

  const handleUpdateMemberData = (values: Member) => {
    setMember((prev) => (prev ? { ...prev, ...values } : prev));
  };

  useEffect(() => {
    if (!id) {
      setResponseError('Missing member ID.');
      return;
    }

    const fetchMemberById = async () => {
      try {
        setLoading(true);
        const response = await getMemberById(id);

        if (response.status === 200) {
          setMember(response.data);
        } else {
          setResponseError(response.statusText);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        setFetchError(error?.message || 'Unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberById();
  }, [id]);

  return (
    <div className="w-full h-full">
      {loading && <Loading />}
      {fetchError ||
        (responseError && (
          <div className="p-2 bg-rose-200 text-rose-600">
            Error occurred: {fetchError} {responseError}
          </div>
        ))}
      {!loading && !fetchError && member && (
        <div className="max-w-5xl mx-auto mt-10 px-6">
          <div className="bg-gradient-to-tr from-slate-50 to-white shadow-xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex flex-col xmd-plus:flex-row justify-between items-center gap-6 p-8 bg-primary/10 border-b-2 border-primary/30">
              {/* left side */}
              <div className="flex justify-center items-center gap-5">
                {/* user profile icon */}
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 bg-primary text-white rounded-full flex items-center justify-center text-4xl">
                    <UserCircle className="w-10 h-10" />
                  </div>
                </div>
                {/* separator */}
                <div className="h-24 w-0.5 bg-primary"></div>
                {/* user info */}
                <div className="flex flex-col justify-start items-start gap-0.5">
                  <h2 className="text-3xl font-bold text-primary">
                    {member.name}
                  </h2>
                  <p className="text-primary">{member.email}</p>
                  <p className="text-primary text-sm">
                    Joined on{' '}
                    {format(new Date(member.createdAt), 'dd MMM yyyy')}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-primary text-sm">Membership status: </p>
                    <Badge
                      variant={
                        getMembershipStatus(member.endDate) === 'Active'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {getMembershipStatus(member.endDate)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="h-0.5 w-full bg-primary/40 xmd-plus:hidden"></div>
              {/* right side */}
              <div className="flex items-center justify-center gap-2">
                <Link
                  to="/members"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Back
                </Link>
                <EditMemberDialog
                  text="Edit"
                  member={member}
                  onMemberUpdated={handleUpdateMemberData}
                  className="bg-primary justify-center hover:bg-primary/50 text-white p-2 rounded-lg transition duration-300"
                />
                <DeleteMemberDialog
                  memberId={member.id}
                  redirect
                  className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-lg transition duration-300"
                  text="Delete"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full h-full flex flex-col xmd-plus:flex-row items-center justify-between gap-4 p-4">
              <div className="flex flex-col justify-center items-center gap-4 h-full w-full p-4">
                <InfoRow
                  icon={<FaRegUser size={17} />}
                  label={'Name'}
                  value={member.name ? member.name : 'N/A'}
                />
                <InfoRow
                  icon={<Phone size={17} />}
                  label={'Phone'}
                  value={member.phone ? member.phone : 'N/A'}
                />
                <InfoRow
                  icon={<Shield size={17} />}
                  label={'Membership type'}
                  value={
                    member.membership.name ? member.membership.name : 'N/A'
                  }
                />
                <InfoRow
                  icon={<Calendar size={17} />}
                  label={'Start date'}
                  value={
                    member.startDate
                      ? format(new Date(member.startDate), 'dd/MM/yyyy')
                      : 'N/A'
                  }
                />
                <InfoRow
                  icon={<RiAdminLine size={17} />}
                  label={'Created by'}
                  value={member.createdBy.name ? member.createdBy.name : 'N/A'}
                />
              </div>

              <div className="flex flex-col justify-center items-center gap-4 h-full w-full p-4">
                <InfoRow
                  icon={<MdAlternateEmail size={17} />}
                  label={'E-mail'}
                  value={member.email ? member.email : 'N/A'}
                />
                <InfoRow
                  icon={<Calendar size={17} />}
                  label={'Birth Date'}
                  value={
                    member.dateOfBirth
                      ? format(new Date(member.dateOfBirth), 'dd/MM/yyyy')
                      : 'N/A'
                  }
                />
                <InfoRow
                  icon={<FaRegCreditCard size={17} />}
                  label={'Unique ID'}
                  value={member.uniqueId ? member.uniqueId : 'N/A'}
                />
                <InfoRow
                  icon={<Calendar size={17} />}
                  label={'End date'}
                  value={
                    member.endDate
                      ? format(new Date(member.endDate), 'dd/MM/yyyy')
                      : 'N/A'
                  }
                />
                <InfoRow
                  icon={<Calendar size={17} />}
                  label={'Updated at'}
                  value={
                    member.updatedAt
                      ? format(new Date(member.updatedAt), 'dd/MM/yyyy')
                      : 'N/A'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type InfoRowProps = {
  icon?: React.ReactNode;
  label: string;
  value: string;
  badgeColor?: string;
};

function InfoRow({ icon, label, value, badgeColor }: InfoRowProps) {
  return (
    <div className="flex justify-between px-10 items-center p-2 border border-primary/40 rounded-xl w-full">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-gray-500 uppercase">{label}</p>
      </div>

      <div>
        {badgeColor && !status && (
          <Badge variant="secondary" className={badgeColor}>
            {value}
          </Badge>
        )}

        {!badgeColor && (
          <p className="text-base font-medium text-gray-800">{value}</p>
        )}
      </div>
    </div>
  );
}
