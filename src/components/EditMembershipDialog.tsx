import {
  UpdateMembershipBody,
  UpdateMembershipSchema,
} from '@/schemas/zod.schemas';
import { updateMembership } from '@/services/memberships.service';
import { Membership } from '@/types/index.types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FaEdit } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { Input } from './ui/input';
import SubmitButton from './SubmitButton';

type Props = {
  membership: Membership;
  onMembershipUpdated?: (membership: Membership) => void;
  className?: string;
  text?: string;
};

export default function EditMembershipDialog({
  membership,
  onMembershipUpdated,
  className,
  text,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<UpdateMembershipBody>({
    resolver: zodResolver(UpdateMembershipSchema),
    defaultValues: {
      name: membership.name,
      durationDays: membership.durationDays,
      price: membership.price,
    },
  });

  const onSubmit = async (values: UpdateMembershipBody) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await updateMembership(membership.id, values);

      if (response.status === 200) {
        if (onMembershipUpdated) onMembershipUpdated(response.data);

        toast.success('Membership updated successfully');
        setOpen(false);
      } else {
        toast.error('Failed updating membership.');
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
        {text ? text : 'Edit Membership'}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Data</DialogTitle>
          <DialogDescription>
            Update {membership.name} memberships data in database
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
            <div className="w-full grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Daily"
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
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration of membership</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        className="rounded-lg"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="20"
                        className="rounded-lg"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
            </div>
            <SubmitButton text="Save Membership" loading={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
