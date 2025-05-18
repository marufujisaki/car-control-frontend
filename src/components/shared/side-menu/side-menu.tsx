"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Car, Wrench, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import "./side-menu.css"

interface SideMenuProps {
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SideMenu({ className }: SideMenuProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [maintenanceSubmenuOpen, setMaintenanceSubmenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer h-12 w-12 flex items-center justify-center p-0">
          <Menu className="h-6 w-6 menu-icon" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl">Vehicle Maintenance</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-1 pl-3 pr-3">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/dashboard") ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <Car className="h-5 w-5" />
            My Vehicles
          </Link>

          <div className="mt-2">
            <button
              onClick={() => setMaintenanceSubmenuOpen(!maintenanceSubmenuOpen)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5" />
                Maintenances
              </div>
              {maintenanceSubmenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {maintenanceSubmenuOpen && (
              <div className="ml-9 mt-1 flex flex-col gap-1">
                <Link
                  href="/maintenances"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    isActive("/maintenances") ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  All
                </Link>
                <Link
                  href="/maintenances/by-vehicle"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    isActive("/maintenances/by-vehicle") ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  By Vehicle
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
