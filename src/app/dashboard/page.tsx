"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/shared/header/header";
import { VehicleCard } from "@/components/shared/vehicle-card/vehicle-card";
import { LoginButton } from "@/components/login-button";
import { AddVehicleForm } from "@/components/add-vehicle-form";
import { deleteVehicle, getVehicles } from "@/lib/api";

// Define the Vehicle type
interface Vehicle {
  id: string;
  uuid: string,
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  lastUpdate: string;
  category: "blue" | "pink" | "purple" | "green" | "orange";
}


export default function Dashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadVehicles = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await getVehicles(user.id);
      setVehicles(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadVehicles();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDeleteVehicle = (id: string) => {
    deleteVehicle(id);
  };


  if (!user) {
    return (
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          <p className="mb-4 text-center text-lg">
            Please log in to view your vehicles
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <p className="mt-2 text-slate-500">Loading vehicles...</p>
          </div>
        ) : vehicles.length > 0 ? (
          <>
            <h1 className="text-2xl font-bold mb-8 text-gray-950">
              My Vehicles
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id}
                  uuid={vehicle.uuid}
                  make={vehicle.make}
                  model={vehicle.model}
                  year={vehicle.year}
                  color={vehicle.color}
                  licensePlate={vehicle.license_plate}
                  lastUpdate={vehicle.lastUpdate}
                  variant={vehicle.category}
                  onEdit={loadVehicles}
                  onDelete={handleDeleteVehicle}
                />
              ))}
            </div>{" "}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="mb-4 text-center text-lg">No vehicles found</p>
            <AddVehicleForm />
          </div>
        )}
      </main>

      {vehicles.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <AddVehicleForm />
        </div>
      )}
    </div>
  );
}
