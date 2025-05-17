"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { UserDrawer } from "@/components/user-drawer";
import { SideMenu } from "../side-menu/side-menu";

interface HeaderProps {
  showMenu?: boolean;
}

export function Header({ showMenu = true }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4">
      <div className="flex items-center gap-3">
        {showMenu && <SideMenu />}
        <h1 className="text-xl font-bold"></h1>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <UserDrawer />
        ) : (
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <User className="h-5 w-5" />
            <span className="sr-only">User</span>
          </Button>
        )}
      </div>
    </header>
  );
}
