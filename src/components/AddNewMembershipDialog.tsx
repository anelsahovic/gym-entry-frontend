import {
  CreateMembershipBody,
  CreateMembershipSchema,
} from '@/schemas/zod.schemas';
import { Membership } from '@/types/index.types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { MdErrorOutline } from 'react-icons/md';
import { Button } from './ui/button';
import { FaPlus } from 'react-icons/fa';
import { Input } from './ui/input';
import SubmitButton from './SubmitButton';
import { useState } from 'react';
import { createMembership } from '@/services/memberships.service';

type Props = {
  onMembershipCreated?: (membership: Membership) => void;
};

export default function AddNewMembershipDialog({ onMembershipCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<CreateMembershipBody>({
    resolver: zodResolver(CreateMembershipSchema),
  });

  const onSubmit = async (values: CreateMembershipBody) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await createMembership({
        name: values.name,
        durationDays: Number(values.durationDays),
        price: Number(values.price),
      });

      if (response.status === 201) {
        if (onMembershipCreated) onMembershipCreated(response.data);

        toast.success('User created successfully');
        setOpen(false);
      } else {
        toast.error('Failed creating user.');
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
          <span className="hidden  lg:flex">New Membership</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Membership</DialogTitle>
          <DialogDescription>
            Create new membership for members to use
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
            <SubmitButton text="Add New Membership" loading={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
