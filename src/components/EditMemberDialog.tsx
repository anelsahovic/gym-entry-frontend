import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { UpdateMemberBody, UpdateMemberSchema } from '@/schemas/zod.schemas';
import { updateMember } from '@/services/members.service';
import { Member } from '@/types/index.types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { MdErrorOutline } from 'react-icons/md';
import { Input } from './ui/input';
import SubmitButton from './SubmitButton';

type Props = {
  text?: string;
  member: Member;
  className?: string;
  onMemberUpdated?: (member: Member) => void;
};

export default function EditMemberDialog({
  className,
  member,
  text,
  onMemberUpdated,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateMemberBody>({
    resolver: zodResolver(UpdateMemberSchema),
    defaultValues: {
      name: member.name,
      email: member.email,
      phone: member.phone,
      uniqueId: member.uniqueId,
      dateOfBirth: member.dateOfBirth,
    },
  });

  const onSubmit = async (values: UpdateMemberBody) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await updateMember(member.id, values);

      if (response.status === 200) {
        setOpen(false);
        toast.success('Member updated successfully');
        if (onMemberUpdated) onMemberUpdated(response.data);
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
      <DialogTrigger
        className={cn(
          'flex items-center w-full justify-start gap-2 text-sm  cursor-pointer hover:cursor-pointer hover:bg-neutral-100 whitespace-nowrap',
          className
        )}
      >
        <FaEdit />
        {text ? text : 'Edit Member'}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Edit {member.name ? member.name : 'member'}s data
          </DialogDescription>
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
                      <Input type="date" className="rounded-lg" {...field} />
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
            </div>
            <SubmitButton text="Save member" loading={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
