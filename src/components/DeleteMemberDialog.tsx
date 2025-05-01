import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteMember } from '@/services/members.service';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { FaTrashAlt } from 'react-icons/fa';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
type Props = {
  memberId: string;
  onMemberDelete?: (memberId: string) => void;
  redirect?: boolean;
  className?: string;
  text?: string;
};

export default function DeleteMemberDialog({
  memberId,
  onMemberDelete,
  redirect,
  className,
  text,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteMember(memberId);

      if (response.status === 204) {
        if (onMemberDelete) {
          onMemberDelete(memberId);
        }
        setOpen(false);
        toast.success('Member deleted successfully');
        if (redirect) {
          navigate('/members');
        }
      } else {
        if (response.statusText) {
          toast.error(response.statusText);
        } else {
          toast.error("Cant't delete the member at the moment!");
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
        <FaTrashAlt /> {text ? text : 'Delete Member'}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            member and remove its data from our servers.
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
