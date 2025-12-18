"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import ProfileModal from "@/components/ProfileModal/ProfileModal";

export function UserInfo({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const shortName = (() => {
    const full = user?.funcionario?.nome || "";
    const parts = full.trim().split(" ");
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0];
  })();

  const fotoUrl = user?.funcionario?.foto
    ? `http://localhost:8080${user.funcionario.foto}`
    : "/notFound/semFoto.png";

  return (
    <>
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)} />

      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-3 rounded-lg outline-none",
              "focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
            )}
          >
            <span className="sr-only">My Account</span>

            <figure className="flex items-center gap-3">
              <img
                src={fotoUrl}
                className="w-12 h-12 rounded-full object-cover"
                alt={`Avatar of ${shortName}`}
              />

              <figcaption className="flex items-center gap-1 font-medium text-[var(--bege-claro)] max-[1024px]:sr-only">
                <span>{shortName}</span>

                <ChevronUp
                  className={cn(
                    "transition-transform",
                    isOpen ? "rotate-0" : "rotate-180"
                  )}
                  size={18}
                />
              </figcaption>
            </figure>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="min-w-[17.5rem] border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center gap-3 px-5 py-3.5">
            <img
              src={fotoUrl}
              className="w-12 h-12 rounded-full object-cover"
              alt={`Avatar of ${shortName}`}
            />

            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {shortName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.funcionario?.email}
              </p>
            </div>
          </div>

          <DropdownMenuItem
            className="
    data-[highlighted]:bg-transparent 
    data-[highlighted]:text-red-600 
    cursor-pointer
  "
            onClick={() => setProfileOpen(true)}
          >
            <div className="flex items-center gap-3 py-2 px-3">
              <UserIcon />
              View Profile
            </div>
          </DropdownMenuItem>



          <DropdownMenuItem
            asChild
            className="
    data-[highlighted]:bg-transparent 
    data-[highlighted]:text-red-900
  "
          >
            <button
              className="flex items-center gap-3 py-2 px-3 text-red-600"
              onClick={async () => {
                try {
                  const res = await fetch("http://localhost:8080/auth/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                  if (res.ok) router.replace("/");
                } catch (err) {
                  console.error("Erro de conexão:", err);
                }
              }}
            >
              <LogOutIcon />
              Log Out
            </button>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
