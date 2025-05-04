import {
  ResetUserPasswordBody,
  ResetUserPasswordSchema,
} from '@/schemas/zod.schemas';
import { resetUserPassword } from '@/services/users.service';
import { User } from '@/types/index.types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
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
import { MdErrorOutline, MdOutlinePassword } from 'react-icons/md';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import SubmitButton from './SubmitButton';
import { Input } from './ui/input';

type Props = {
  user: User;
  className?: string;
};

export default function ResetUserPassword({ user, className }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<ResetUserPasswordBody>({
    resolver: zodResolver(ResetUserPasswordSchema),
  });

  const onSubmit = async (values: ResetUserPasswordBody) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await resetUserPassword(user.id, values);

      if (response.status === 200) {
        toast.success('User password reset successfully');
        setOpen(false);
      } else {
        toast.error('Failed resetting user password.');
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
        <MdOutlinePassword />
        Reset password
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Reset {user.name}s password</DialogDescription>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*******"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
            </div>
            <SubmitButton text="Reset password" loading={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
