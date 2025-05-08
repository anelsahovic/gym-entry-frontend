import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';
import { FaTrashAlt } from 'react-icons/fa';
import { Button } from './ui/button';
import { deleteMembership } from '@/services/memberships.service';
import { Membership } from '@/types/index.types';

type Props = {
  membership: Membership;
  onMembershipDelete?: (membership: Membership) => void;
  className?: string;
  text?: string;
};

export default function DeleteMembershipDialog({
  membership,
  className,
  text,
  onMembershipDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteMembership(membership.id);

      if (response.status === 204) {
        if (onMembershipDelete) {
          onMembershipDelete(membership);
        }
        setOpen(false);
        toast.success('Membership deleted successfully');
      } else {
        if (response.statusText) {
          toast.error(response.statusText);
        } else {
          toast.error("Cant't delete the membership at the moment!");
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
        <FaTrashAlt /> {text ? text : 'Delete Membership'}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the{' '}
            {membership.name} membership and remove its data from our servers.
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
