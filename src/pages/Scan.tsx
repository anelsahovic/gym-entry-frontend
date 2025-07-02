// type Props = {}

import Loading from '@/components/Loading';
import SubmitButton from '@/components/SubmitButton';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getMembershipStatus } from '@/lib/utils';
import {
  ExtendMembershipBody,
  ExtendMembershipSchema,
  FindMemberBody,
  FindMemberSchema,
} from '@/schemas/zod.schemas';
import {
  extendMembership,
  getMemberByUniqueId,
} from '@/services/members.service';
import { getMemberships } from '@/services/memberships.service';
import { Member, Membership } from '@/types/index.types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { formatDate } from 'date-fns';
import { KeyRound, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { FaIdCard } from 'react-icons/fa';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { MdOutlineReportGmailerrorred } from 'react-icons/md';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import FlippingText from '@/components/FlippingText';

export default function Scan() {
  const [member, setMember] = useState<Member | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 9),
    to: new Date(2025, 5, 26),
  });
  const [memberships, setMemberships] = useState<Membership[]>([]);

  const [openScanResult, setOpenScanResult] = useState(false);
  const [openExtendMembership, setOpenExtendMembership] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [membershipExtendErrorMessage, setMembershipExtendErrorMessage] =
    useState('');
  const [loading, setLoading] = useState(false);

  // fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await getMemberships();

        if (response.status === 200) setMemberships(response.data);
      } catch (error) {
        setErrorMessage(error as string);
      }
    };
    fetchMemberships();
  }, []);

  // finding member by id form
  const form = useForm<FindMemberBody>({
    resolver: zodResolver(FindMemberSchema),
  });

  // onsubmit for finding member by id form
  const onSubmit = async (values: FindMemberBody) => {
    try {
      setOpenScanResult(true);
      setLoading(true);
      setErrorMessage('');

      const response = await getMemberByUniqueId(values.uniqueId);

      if (response.status === 200) {
        setMember(response.data);
        setDateRange({
          from: new Date(response.data.startDate),
          to: new Date(response.data.endDate),
        });
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data.error;
        if (backendMessage) {
          setErrorMessage(backendMessage);
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      } else {
        setErrorMessage('Something went wrong. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // extending members membership form
  const extendMembershipForm = useForm<ExtendMembershipBody>({
    resolver: zodResolver(ExtendMembershipSchema),
  });

  // onsubmit for extending members membership form
  const onSubmitMembershipExtend = async (values: ExtendMembershipBody) => {
    try {
      setLoading(true);
      setMembershipExtendErrorMessage('');

      const response = await extendMembership(
        member ? member.id : '',
        values.membershipId
      );

      if (response.status === 200) {
        setMember(response.data);
        setDateRange({
          from: new Date(response.data.startDate),
          to: new Date(response.data.endDate),
        });

        toast.success('Successfully extended membership.');

        setOpenExtendMembership(false);
      } else {
        setMembershipExtendErrorMessage(response.data.error);
        toast.error("Can't extend membership at the moment.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data.error;
        if (backendMessage) {
          setMembershipExtendErrorMessage(backendMessage);
        } else {
          setMembershipExtendErrorMessage('An unexpected error occurred.');
        }
      } else {
        setMembershipExtendErrorMessage(
          'Something went wrong. Try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const texts: string[] = [
    'Ready to scan member QR code',
    'Please present your QR code',
    'Scan your member QR code here',
    'Authenticate your membership now',
    'Get ready, scan your code',
    'Member access: scan your code',
    'Show your QR code to proceed',
  ];
  return (
    <div className="w-full h-full flex flex-col justify-between items-center rounded-xl gap-4">
      {/* title section */}
      <div className="w-full flex flex-col justify-start items-start border-b pb-2 border-neutral-400/30">
        <h1 className="font-black text-2xl uppercase text-emerald-950 tracking-wider">
          MEMBER SCAN
        </h1>
        <h3 className="text-lg text-neutral-800 tracking-wide">
          Check members membership
        </h3>
      </div>

      {/* scan section */}
      <div className="h-full w-full flex justify-around items-center">
        {/* action section for scanning/searching manually */}
        <div className="flex flex-col gap-6 items-center justify-center bg-white shadow-xl rounded-2xl p-6 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800">
            Gym Entry Scanner
          </h2>

          <p className="text-sm text-gray-500">
            To check in a gym member, scan their QR code or enter their
            membership ID below.
          </p>

          <button
            // onClick={handleScan}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-xl w-full justify-center"
          >
            <QrCode className="w-5 h-5" />
            Scan Member QR Code
          </button>

          <span className="text-gray-500">OR</span>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="uniqueId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-full">
                        <KeyRound className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          type="text"
                          placeholder="Enter Member ID"
                          className="rounded-lg w-full p-4 pl-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <SubmitButton text="Search" />
            </form>
          </Form>

          {/* scan result dialog */}
          <Dialog open={openScanResult} onOpenChange={setOpenScanResult}>
            <DialogContent className="md:min-w-3xl overflow-y-scroll md:overflow-y-auto h-8/9 md:h-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Scan Result
                </DialogTitle>
                <DialogDescription>
                  Showing results from scanned user{' '}
                </DialogDescription>
              </DialogHeader>

              <div className="text-sm text-gray-600 mt-2 space-y-4">
                {loading && (
                  <div className="flex justify-center items-center py-6">
                    <Loading />
                  </div>
                )}

                {!loading && errorMessage && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                {!loading && member && (
                  <div className="w-full flex justify-center items-center flex-col md:flex-row md:justify-between gap-6 sm:p-6 bg-white rounded-2xl ">
                    {/* Left Section: Status + Calendar */}
                    <div className="flex flex-col justify-center items-center gap-6 max-w-sm">
                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <div className="flex justify-center gap-2 items-stretch">
                          <FaIdCard size={20} /> <span>Membership status:</span>
                        </div>
                        <Badge
                          className="px-2 py-1 text-sm uppercase"
                          variant={
                            getMembershipStatus(member.endDate) === 'Active'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {new Date(member.endDate) > new Date()
                            ? 'Active'
                            : 'Expired'}
                        </Badge>
                      </div>

                      {/* Calendar */}
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        style={
                          {
                            '--primary':
                              getMembershipStatus(member.endDate) === 'Active'
                                ? '#00bc7d'
                                : '#dc2626',
                            '--accent':
                              getMembershipStatus(member.endDate) === 'Active'
                                ? '#cafcdb'
                                : '#ffc3c3',
                            '--accent-foreground':
                              getMembershipStatus(member.endDate) === 'Active'
                                ? '#065f46'
                                : '#7f1d1d',
                          } as React.CSSProperties
                        }
                        className={twMerge(
                          'rounded-xl border  shadow-s',
                          getMembershipStatus(member.endDate) === 'Active'
                            ? 'border-emerald-500 text-emerald-500'
                            : 'border-red-500 text-red-500'
                        )}
                      />
                    </div>

                    {/* Right Section: Detailed Info + Buttons */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Row 1 */}
                      <InfoItem
                        label="Name"
                        value={member.name}
                        status={getMembershipStatus(member.endDate)}
                      />
                      <InfoItem
                        label="Email"
                        value={member.email}
                        status={getMembershipStatus(member.endDate)}
                      />

                      {/* Row 2 */}
                      <InfoItem
                        label="Phone"
                        value={member.phone}
                        status={getMembershipStatus(member.endDate)}
                      />
                      <InfoItem
                        label="Unique ID"
                        value={member.uniqueId}
                        status={getMembershipStatus(member.endDate)}
                      />

                      {/* Row 3 */}
                      <InfoItem
                        label="Membership"
                        value={member.membership.name}
                        status={getMembershipStatus(member.endDate)}
                      />
                      <InfoItem
                        label="Created By"
                        value={member.createdBy.name}
                        status={getMembershipStatus(member.endDate)}
                      />

                      {/* Row 4 */}
                      <InfoItem
                        label="Start Date"
                        value={formatDate(
                          member ? member?.startDate : '1/1/1111',
                          'dd/MM/yyy'
                        )}
                        status={getMembershipStatus(member.endDate)}
                      />
                      <InfoItem
                        label="End Date"
                        value={formatDate(
                          member ? member?.endDate : '1/1/1111',
                          'dd/MM/yyy'
                        )}
                        status={getMembershipStatus(member.endDate)}
                      />

                      {/* Row 5 */}
                      <InfoItem
                        label="Created At"
                        value={new Date(member.createdAt).toLocaleString()}
                        status={getMembershipStatus(member.endDate)}
                      />
                      <InfoItem
                        label="Updated At"
                        value={new Date(member.updatedAt).toLocaleString()}
                        status={getMembershipStatus(member.endDate)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="pb-2 px-6">
                <Dialog
                  open={openExtendMembership}
                  onOpenChange={setOpenExtendMembership}
                >
                  <DialogTrigger
                    className={buttonVariants({ variant: 'default' })}
                  >
                    Extend Membership
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Extend the Membership</DialogTitle>

                      {membershipExtendErrorMessage && (
                        <div className="bg-red-200 text-red-500 p-2 flex justify-center items-center gap-2 rounded-lg">
                          <MdOutlineReportGmailerrorred />
                          {membershipExtendErrorMessage}
                        </div>
                      )}

                      <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div>
                      <Form {...extendMembershipForm}>
                        <form
                          onSubmit={extendMembershipForm.handleSubmit(
                            onSubmitMembershipExtend
                          )}
                          className="w-full space-y-4 flex flex-col justify-center items-center"
                        >
                          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-full">
                            <div>
                              <p className=" text-xs sm:text-sm text-gray-500 uppercase">
                                Member
                              </p>
                              <p className=" font-medium text-gray-800">
                                {member?.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs sm:text-sm text-gray-500 uppercase">
                                Expires On
                              </p>
                              <p className="font-medium text-gray-800">
                                {formatDate(
                                  member ? member?.endDate : '1/1/1111',
                                  'dd/MM/yyy'
                                )}
                              </p>
                            </div>
                          </div>

                          <FormField
                            control={extendMembershipForm.control}
                            name="membershipId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Membership type</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {memberships &&
                                        memberships.length &&
                                        memberships.map((membership) => (
                                          <SelectItem
                                            key={membership.id}
                                            value={membership.id}
                                          >
                                            {membership.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="text-start" />
                              </FormItem>
                            )}
                          />

                          {/* <FormField
                            control={extendMembershipForm.control}
                            name="memberId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Member ID</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="NOI13"
                                    className="rounded-lg"
                                    {...field}
                                    value={member?.id}
                                  />
                                </FormControl>
                                <FormMessage className="text-start" />
                              </FormItem>
                            )}
                          /> */}

                          <SubmitButton
                            text="Extend Membership"
                            loading={loading}
                          />
                        </form>
                      </Form>
                    </div>
                  </DialogContent>
                </Dialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* help dialog */}
          <Dialog>
            <DialogTrigger>
              <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary cursor-pointer transition-colors">
                <IoMdHelpCircleOutline />
                Need help?
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to scan the user membership card</DialogTitle>
                <div className="text-sm text-gray-500 mt-2 leading-relaxed">
                  To scan a user's membership card:
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>
                      Click the <strong>"Scan Member QR Code"</strong> button.
                    </li>
                    <li>Allow camera access if prompted.</li>
                    <li>
                      Hold the member's card in front of your camera until it’s
                      recognized.
                    </li>
                    <li>
                      If scanning fails, enter their Member ID manually below.
                    </li>
                  </ol>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* footer section */}
      <div className="w-full border-t pt-2 border-neutral-400/30">
        <FlippingText texts={texts} className="text-primary font-medium" />
      </div>
    </div>
  );
}

const InfoItem = ({
  label,
  value,
  status,
}: {
  label: string;
  status: string;
  value: string | number;
}) => (
  <div className="flex flex-col">
    <label
      className={twMerge('text-xs uppercase text-gray-800 font-medium mb-1')}
    >
      {label}
    </label>
    <div
      className={twMerge(
        ' px-4 py-2 rounded-lg  font-medium',
        status === 'Active'
          ? 'bg-emerald-100 text-green-600'
          : 'bg-red-100 text-red-500'
      )}
    >
      {value}
    </div>
  </div>
);
