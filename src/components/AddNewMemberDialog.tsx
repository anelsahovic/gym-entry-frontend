// type Props = {}

import { FaPlus } from 'react-icons/fa';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useForm } from 'react-hook-form';
import { CreateMemberBody, CreateMemberSchema } from '@/schemas/zod.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { createMember } from '@/services/members.service';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import useAuth from '@/hooks/useAuth';
import SubmitButton from './SubmitButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { getMemberships } from '@/services/memberships.service';
import { Member, Membership } from '@/types/index.types';
import axios from 'axios';
import { MdErrorOutline } from 'react-icons/md';

type Props = {
  onMemberCreated?: (member: Member) => void;
};

export default function AddNewMemberDialog({ onMemberCreated }: Props) {
  const { userId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);

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

  const form = useForm<CreateMemberBody>({
    resolver: zodResolver(CreateMemberSchema),
    defaultValues: {
      name: '',
      email: undefined,
      phone: '+387',
      // dateOfBirth: undefined,
      uniqueId: '',
      // startDate: '',
      membershipId: '',
      staffId: userId,
    },
  });

  const onSubmit = async (values: CreateMemberBody) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await createMember(values);

      if (response.status === 201) {
        toast.success('Member created successfully');
        if (onMemberCreated) onMemberCreated(response.data);
        setOpen(false);
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
      toast.error('Uh oh! Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex justify-center items-center gap-2 md:w-auto">
          <FaPlus />
          <span className="hidden  lg:flex">Add New Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>Add new member to database</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {errorMessage && (
            <div className="w-full bg-rose-200 text-rose-500 p-2 rounded-lg flex items-center gap-2">
              <MdErrorOutline size={20} />

              {errorMessage}
            </div>
          )}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{ required: false }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@mail.com"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="+38766123123"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="12/12/2000"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uniqueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unique ID</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="NOI13"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
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

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Date{' '}
                      <span className="text-xs uppercase text-gray-700">
                        OPTIONAL
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="12/12/2025"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      End Date{' '}
                      <span className="text-xs uppercase text-gray-700">
                        OPTIONAL
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="12/12/2025"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
            </div>
            <SubmitButton text="Add New Member" loading={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
