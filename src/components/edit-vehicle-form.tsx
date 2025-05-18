"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateVehicle } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ColorSelector } from "./shared/color-selector/color-selector";

const colorOptions = [
  { value: "blue", label: "Blue", className: "bg-blue-500" },
  { value: "purple", label: "Purple", className: "bg-purple-500" },
  { value: "pink", label: "Pink", className: "bg-pink-500" },
  { value: "green", label: "Green", className: "bg-green-500" },
  { value: "orange", label: "Orange", className: "bg-orange-500" },
];

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  category?: string;
  userId?: string;
}

interface EditVehicleFormProps {
  vehicle: Vehicle;
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void;
}

export function EditVehicleForm({
  vehicle,
  open, onOpenChange, 
  onSuccess,
}: EditVehicleFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Vehicle>({
    id: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    color: "",
    category: "blue",
  });

  // Initialize form data when vehicle changes
  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...vehicle,
        category: vehicle.category || "blue",
      });
    }
  }, [vehicle]);

   // Cleanup function when dialog closes
   useEffect(() => {
    if (!open) {
      // Ensure body has pointer events enabled
      document.body.style.pointerEvents = ""

      // Remove any lingering overlay elements
      const overlays = document.querySelectorAll('[role="dialog"]')
      overlays.forEach((overlay) => {
        if (!overlay.contains(document.activeElement)) {
          // Only remove if it's not the currently focused dialog
          overlay.setAttribute("aria-hidden", "true")
        }
      })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year"
          ? value === ""
            ? ""
            : Number.parseInt(value, 10)
          : value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Validate form
      if (!formData.make || !formData.model || !formData.licensePlate) {
        alert("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Update vehicle
      await updateVehicle(formData.id, {
        ...formData,
        userId: user.id,
      });

      // Close modal and refresh
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    onOpenChange(false)
    // Force cleanup of any lingering effects
    setTimeout(() => {
      document.body.style.pointerEvents = ""
    }, 10)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onEscapeKeyDown={handleDialogClose}
        onInteractOutside={handleDialogClose}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the details of your vehicle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make" className="text-right">
                  Manufacturer <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="e.g. Toyota"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-right">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Corolla"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year" className="text-right">
                  Year
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate" className="text-right">
                  License Plate <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="e.g. ABC123"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Red"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right">Category Color</Label>
              <ColorSelector
                value={formData.category || "blue"}
                onChange={handleCategoryChange}
                options={colorOptions}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Vehicle"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
