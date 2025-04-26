import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props {
  text: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  loading?: boolean;
}

export default function SubmitButton({ text, variant, loading }: Props) {
  return (
    <>
      {loading ? (
        <Button
          variant={`${variant ? variant : 'default'}`}
          disabled
          className="w-full"
        >
          <Loader2 className="size-4 mr-2 animate-spin" /> Please wait...
        </Button>
      ) : (
        <Button
          variant={`${variant ? variant : 'default'}`}
          type="submit"
          className="w-full cursor-pointer"
        >
          {text}
        </Button>
      )}
    </>
  );
}
