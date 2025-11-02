import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriaSkeleton() {
  return (
    <div className="mt-5 mb-15">
      <div className="ms-[4%] mb-5">
        <Skeleton className="h-7 w-[200px]" />
      </div>
      <div className="flex flex-col ms-[4%] gap-y-3">
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-7 w-[200px]" />
        </div>
        <div className="ms-[5%] mb-2 space-y-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-6 w-[180px]" />
        </div>
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-7 w-[200px]" />
        </div>
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-7 w-[200px]" />
        </div>
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-7 w-[200px]" />
        </div>
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-7 w-[200px]" />
        </div>
      </div>
    </div>
  );
}
