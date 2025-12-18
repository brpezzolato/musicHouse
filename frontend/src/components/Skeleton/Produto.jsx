import { Skeleton } from '@/components/ui/skeleton';
export default function ProdutoSkeleton() {
  return (
    <div className="bg-white">
      <nav aria-label="Breadcrumb" className="mb-3 mt-3">
        <ol
          role="list"
          className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
        >
          <Skeleton className="mr-2 h-12 w-12 p-7 rounded-lg md:hidden" />
          <li>
            <div className="flex items-center">
              <Skeleton className="h-5 w-20 mr-2" />
              <svg
                fill="currentColor"
                width={16}
                height={20}
                viewBox="0 0 16 20"
                aria-hidden="true"
                className="h-5 w-4 text-gray-300"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <Skeleton className="h-5 w-24 mr-2" />
              <svg
                fill="currentColor"
                width={16}
                height={20}
                viewBox="0 0 16 20"
                aria-hidden="true"
                className="h-5 w-4 text-gray-300"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li className="text-sm">
            <Skeleton className="h-5 w-32" />
          </li>
        </ol>
      </nav>

      <div className="cabecalho mb-5">
        <Skeleton className="h-14 ml-5 mr-5" />
      </div>

      <div className="relative ml-5 mr-5">
        <Skeleton className="h-80" />
        <button className="pl-20 pr-20 absolute left-0 top-0 bottom-0 flex items-center justify-center text-gray-300 cursor-wait">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-[15%] text-gray-300 cursor-wait">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      <div className="pt-6">
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pt-16 lg:pb-24 -mt-10">
          <div className="pl-10 mb-8 -mt-4 items-center flex lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <fieldset aria-label="Choose a color" className="mr-5">
              <div className="flex items-center gap-x-3">
                <Skeleton className="size-15 rounded-full" />
                <Skeleton className="size-15 rounded-full" />
                <Skeleton className="size-15 rounded-full" />
                <Skeleton className="size-15 rounded-full opacity-40" />
              </div>
            </fieldset>
            <div className="textos-nome-product space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          <div className="lg:col-span-3 pl-30 pr-30">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap text-sm font-medium text-center mb-5"
                role="tablist"
              >
                <li className="me-2" role="presentation">
                  <Skeleton className="h-10 w-24" />
                </li>
                <li className="me-2" role="presentation">
                  <Skeleton className="h-10 w-24" />
                </li>
                <li role="presentation">
                  <Skeleton className="h-10 w-24" />
                </li>
              </ul>
            </div>
            <div className="space-y-3 mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[85%]" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Skeleton className="h-8 w-72 md:h-9 lg:h-10 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 md:h-6 mx-auto" />
      </div>
      <div className="flex flex-wrap justify-center mt-23 gap-6 mb-16">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-56 w-56" />
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-56 w-56" />
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-56 w-56" />
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
