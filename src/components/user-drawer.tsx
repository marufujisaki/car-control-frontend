"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { LogOut } from "lucide-react";

export function UserDrawer() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.picture || "/placeholder.svg"}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-400 text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>Manage your account</SheetDescription>
        </SheetHeader>

        <div className="mt-8 flex flex-1 flex-col">
          <div className="flex items-center gap-4 border-b pb-4">
            {user.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.picture || "/placeholder.svg"}
                alt={user.name}
                className="w-12 h-12 rounded-full ml-3"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-400 text-white text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

        </div>

        <SheetFooter className="mt-auto flex-col sm:flex-col">
          <Button
            variant="outline"
            className="w-full justify-start text-red-500"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
