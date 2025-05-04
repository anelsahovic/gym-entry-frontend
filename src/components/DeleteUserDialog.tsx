import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { deleteUser } from '@/services/users.service';
import { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from './ui/button';

type Props = {
  userId: string;
  onUserDelete?: (userId: string) => void;
  className?: string;
};

export default function DeleteUserDialog({
  userId,
  onUserDelete,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteUser(userId);

      if (response.status === 204) {
        if (onUserDelete) {
          onUserDelete(userId);
        }
        setOpen(false);
        toast.success('User deleted successfully');
      } else {
        if (response.statusText) {
          toast.error(response.statusText);
        } else {
          toast.error("Cant't delete the user at the moment!");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Uh oh! Something went wrong!');
    } finally {
      setIsDeleting(false);
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
        <FaTrashAlt /> Delete User
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user
            and remove its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-end items-center gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {isDeleting ? (
            <Button disabled variant="destructive">
              Deleting
            </Button>
          ) : (
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
