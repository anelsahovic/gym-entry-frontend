import { LuLoaderCircle } from 'react-icons/lu';

export default function Loading() {
  return (
    <div className=" w-full h-full flex justify-center items-center">
      <LuLoaderCircle className="text-primary animate-spin" size={40} />
    </div>
  );
}
