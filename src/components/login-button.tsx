"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { LogIn, LogOut } from "lucide-react";

export function LoginButton() {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-2">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture || "/placeholder.svg"}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : null}
          <span className="text-sm font-medium hidden md:inline">
            {user.name}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login}>
      <LogIn className="h-4 w-4 mr-2" />
      Login with Google
    </Button>
  );
}
