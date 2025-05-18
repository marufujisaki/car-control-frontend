"use client";

import type React from "react";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { MoreVertical, Trash2, Loader2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteVehicle } from "@/lib/api";
import { EditVehicleForm } from "@/components/edit-vehicle-form";

interface VehicleCardProps {
  id: string;
  uuid: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  lastUpdate: string;
  variant?: "blue" | "pink" | "purple" | "green" | "orange";
  onEdit?: () => void;
  onDelete?: (id: string) => void;
}

export function VehicleCard({
  id,
  uuid,
  make,
  model,
  year,
  color,
  licensePlate,
  lastUpdate,
  variant = "blue",
  onEdit,
  onDelete,
}: VehicleCardProps) {
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const variantStyles = {
    blue: "bg-blue-500 from-blue-400 to-blue-600",
    pink: "bg-pink-500 from-pink-400 to-pink-600",
    purple: "bg-purple-500 from-purple-400 to-purple-600",
    green: "bg-green-500 from-green-400 to-green-600",
    orange: "bg-orange-500 from-orange-400 to-orange-600",
  };

  // Create vehicle object for the edit form
  const vehicleData = {
    id,
    uuid,
    make,
    model,
    year,
    color,
    licensePlate,
    category: variant,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false); // Close the dropdown
    setShowEditForm(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false); // Close the dropdown
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVehicle(id);
      if (onDelete) {
        onDelete(id);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditFormClose = (open: boolean) => {
    setShowEditForm(open);
    // Force a small delay to ensure DOM is updated properly
    if (!open) {
      setTimeout(() => {
        // Ensure any lingering focus traps or overlays are removed
        document.body.style.pointerEvents = "";
      }, 10);
    }
  };

  return (
    <>
      <Link href={`/maintenances/${uuid}`} className="block h-full">
        <div
          className={cn(
            "relative h-full overflow-hidden rounded-lg p-5 text-white shadow-md bg-gradient-to-br",
            variantStyles[variant]
          )}
        >
          {/* Three-dot menu */}
          <div
            className="absolute right-2 top-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  ref={menuTriggerRef}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Background pattern */}
          <Image
            src="/pattern.svg"
            className="absolute -right-6 -top-16"
            height={181}
            width={211}
            alt="pattern"
          />

          <div className="relative z-0">
            <h3 className="text-xl font-bold">{make}</h3>
            <h4 className="text-lg font-medium">{model}</h4>

            <div className="mt-2 text-sm opacity-90">
              <p>
                {year} {color}
              </p>
              <p>{licensePlate}</p>
            </div>

            <div className="mt-2 text-xs opacity-80">
              <p>Last update: {lastUpdate || "Not yet"}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Edit form dialog */}
      <EditVehicleForm
        vehicle={vehicleData}
        open={showEditForm}
        onOpenChange={handleEditFormClose}
        onSuccess={onEdit}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {make} {model}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
