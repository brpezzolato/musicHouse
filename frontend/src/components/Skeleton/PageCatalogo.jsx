import { Skeleton } from '@/components/ui/skeleton';

export default function BuscaSkeleton() {
  return (
    <>
      <div className="ms-[4%] mb-[10%]">
        <div className="flex justify-start px-4 sm:px-8 py-10 gap-10">
          <div className="flex flex-col space-y-3">
            <Skeleton className="w-50 h-60 rounded-xl" />
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="w-50 h-60 rounded-xl" />
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="w-50 h-60 rounded-xl" />
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="w-50 h-60 rounded-xl" />
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="w-50 h-60 rounded-xl" />
          </div>
        </div>
        <div className="flex justify-center flex-col items-center space-x-4 mb-10 gap-y-3">
          <div className="">
            <Skeleton className="h-15 w-[450px]" />
          </div>
          <div className="">
            <Skeleton className="h-10 w-[280px]" />
          </div>
        </div>

        <div className="flex justify-center items-center flex-wrap flex-col md:flex-row gap-y-14 md:gap-x-[7%]">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-60 w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-60 w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-60 w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
