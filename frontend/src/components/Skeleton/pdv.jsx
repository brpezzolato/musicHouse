import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonPDV() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-wrap justify-between items-center px-6 md:px-10 pt-6 gap-4">
        <Skeleton className="h-10 w-64 rounded-[15px]" />
        <div className="w-80 flex justify-end">
          <Skeleton className="h-10 w-100 rounded-md" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 px-4 md:px-10 py-5 gap-6 md:gap-8">
        <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-100 p-4 md:p-12 overflow-hidden h-[80vh]">
          <div className="hidden sm:grid grid-cols-3 text-center border-b pb-3 mb-4">
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
            <Skeleton className="h-4 w-10 mx-auto" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-md px-4 py-8">
              <div className="flex items-center gap-3 sm:w-1/3">
                <Skeleton className="h-15 w-15 rounded-[5px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <div className="sm:w-1/3 flex justify-center my-2 sm:my-0">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-end sm:justify-center items-center gap-3 sm:w-1/3">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-md px-4 py-8">
              <div className="flex items-center gap-3 sm:w-1/3">
                <Skeleton className="h-15 w-15 rounded-[5px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <div className="sm:w-1/3 flex justify-center my-2 sm:my-0">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-end sm:justify-center items-center gap-3 sm:w-1/3">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-md px-4 py-8">
              <div className="flex items-center gap-3 sm:w-1/3">
                <Skeleton className="h-15 w-15 rounded-[5px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <div className="sm:w-1/3 flex justify-center my-2 sm:my-0">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-end sm:justify-center items-center gap-3 sm:w-1/3">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-md px-4 py-8">
              <div className="flex items-center gap-3 sm:w-1/3">
                <Skeleton className="h-15 w-15 rounded-[5px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <div className="sm:w-1/3 flex justify-center my-2 sm:my-0">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-end sm:justify-center items-center gap-3 sm:w-1/3">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-md px-4 py-8">
              <div className="flex items-center gap-3 sm:w-1/3">
                <Skeleton className="h-15 w-15 rounded-[5px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <div className="sm:w-1/3 flex justify-center my-2 sm:my-0">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-end sm:justify-center items-center gap-3 sm:w-1/3">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[320px] flex flex-col gap-3">
          <div className="flex flex-col gap-y-[10px]">
            <Skeleton className="h-14 w-full rounded-[15px]" />
            <Skeleton className="h-10 w-full rounded-[15px]" />
          </div>
          <div className="border border-gray-200 p-3 rounded-md bg-white flex items-center gap-3">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="border-t pt-2 flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
          <div className="flex justify-around gap-3 mt-2">
            <Skeleton className="h-16 w-full rounded-[15px]" />
            <Skeleton className="h-16 w-full rounded-[15px]" />
            <Skeleton className="h-16 w-full rounded-[15px]" />
          </div>
          <Skeleton className="h-12 w-full rounded-md mt-2" />
        </div>
      </div>
    </div>
  );
}
