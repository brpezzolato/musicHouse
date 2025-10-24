import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[#e0e0e0] animate-pulse [animation-duration:.5s] rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }
