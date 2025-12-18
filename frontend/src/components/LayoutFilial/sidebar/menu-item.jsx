import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";

const menuItemBaseStyles = cva(
  "rounded-lg px-3.5 font-medium text-[var(--bege-claro)] transition-all duration-200 dark:text-dark-6",
  {
    variants: {
      isActive: {
        true: "bg-[rgba(87,80,241,0.10)]  hover:bg-[rgba(87,80,241,0.07)] dark:bg-[#FFFFFF1A] dark:text-white",
        false:
          "hover:text-dark hover:dark:bg-[#FFFFFF1A] hover:dark:text-white",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

export function MenuItem(props) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  const baseClass = menuItemBaseStyles({ isActive: props.isActive });

  // LINK VERSION
  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        onClick={() => isMobile && toggleSidebar()}
        className={cn(
          baseClass,
          "relative block py-2 flex items-center gap-3",
          props.className
        )}
      >
        {props.children}
      </Link>
    );
  }

  // BUTTON VERSION
  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      className={cn(
        baseClass,
        "flex w-full items-center gap-3 py-3",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}
