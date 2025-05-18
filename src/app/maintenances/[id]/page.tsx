"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  PlusCircle,
  Lock,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { LoginButton } from "@/components/login-button";
import { useAuth } from "@/context/auth-context";
import { useEffect, useMemo, useState } from "react";
import { deleteJob, updateJob, createJob, getVehicleJobs } from "@/lib/api";
import { formatDate, parseDate } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";

import {
  type Job,
  type JobCreateRequest,
  type JobUpdateRequest,
  useJobForm,
} from "@/hooks/useJobForm";
import { useParams } from "next/navigation";
import { Header } from "@/components/shared/header/header";

// Format currency values
const formatCurrency = (amount: number | null) => {
  if (amount === null) return "-";
  return `$${amount.toFixed(0)}`;
};

export default function TableViewContent() {
  const { user, isLoading } = useAuth();
  const params = useParams();
  const vehicleId = params.id as string;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);

  // Sort jobs by date in ascending order
  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }, [jobs]);

  // Handle form submission (create or update)
  const handleFormSubmit = async (
    data: JobCreateRequest | JobUpdateRequest,
    isEditing: boolean
  ) => {
    try {
      if (isEditing && "id" in data) {
        await updateJob(data.id, data);
      } else {
        await createJob(data);
      }
      // Refresh jobs list
      await loadJobs();
      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Initialize the job form hook
  const {
    formData,
    selectedDate,
    editingJobId,
    isSubmitting,
    addPart,
    removePart,
    updatePart,
    handleDateSelect,
    updateField,
    resetForm,
    loadJobForEdit,
    handleSubmit,
  } = useJobForm({ onSubmit: handleFormSubmit });

  const loadJobs = async () => {
    if (!user || !vehicleId) return;
    const jobsData = await getVehicleJobs(vehicleId || "");
    if (jobsData) setJobs(jobsData);
  };

  useEffect(() => {
    if (!user) return;
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, vehicleId]);

  // Open edit modal for a job
  const handleEditJob = (job: Job) => {
    loadJobForEdit(job);
    setOpen(true);
  };

  // Open delete confirmation for a job
  const handleDeleteJob = (jobId: number | undefined) => {
    if (jobId) {
      setJobToDelete(jobId);
      setDeleteConfirmOpen(true);
    }
  };

  // Confirm deletion of a job
  const confirmDeleteJob = async () => {
    if (jobToDelete !== null) {
      try {
        await deleteJob(jobToDelete);
        // Refresh jobs list
        await loadJobs();
        setJobToDelete(null);
        setDeleteConfirmOpen(false);
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  // Handle dialog close
  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    setOpen(isOpen);
  };

  const cancelForm = () => {
    resetForm();
    setOpen(false);
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 p-4 rounded-full bg-slate-100">
          <Lock className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        <p className="text-slate-500 mb-6 max-w-md">
          Inicia sesión con tu cuenta de Google para ver y gestionar tus
          mantenimientos.
        </p>
        <LoginButton />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <CardHeader className="bg-slate-50 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Registro de Trabajos</CardTitle>
          <CardDescription>
            Listado de piezas, trabajos realizados y costos asociados
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" /> Nuevo Trabajo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <form onSubmit={(e) => handleSubmit(e, vehicleId || "")}>
                <DialogHeader>
                  <DialogTitle>
                    {editingJobId ? "Editar Trabajo" : "Agregar Nuevo Trabajo"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingJobId
                      ? "Modifique los detalles del trabajo y sus piezas."
                      : "Complete los detalles del trabajo y agregue las piezas necesarias."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del Trabajo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Ej: Reparación de motor"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha</Label>
                      <DatePicker
                        date={selectedDate}
                        onSelect={handleDateSelect}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <Label>Piezas y Repuestos</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPart}
                        className="cursor-pointer"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Agregar Pieza
                      </Button>
                    </div>

                    {formData.parts.map((part, index) => (
                      <div
                        key={index}
                        className="space-y-4 p-4 border rounded-md bg-slate-50"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Pieza #{index + 1}</h4>
                          {formData.parts.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePart(index)}
                              className="h-8 w-8 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${index}`}>
                              Nombre de la Pieza
                            </Label>
                            <Input
                              id={`name-${index}`}
                              value={part.name}
                              onChange={(e) =>
                                updatePart(index, "name", e.target.value)
                              }
                              placeholder="Ej: Motor A-123"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`type-${index}`}>
                              Tipo de Trabajo
                            </Label>
                            <Select
                              value={part.type}
                              onValueChange={(value) =>
                                updatePart(index, "type", value)
                              }
                              required
                            >
                              <SelectTrigger id={`type-${index}`}>
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Reparación">
                                  Reparación
                                </SelectItem>
                                <SelectItem value="Mantenimiento">
                                  Mantenimiento
                                </SelectItem>
                                <SelectItem value="Reemplazo">
                                  Reemplazo
                                </SelectItem>
                                <SelectItem value="Revisión">
                                  Revisión
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`cost-${index}`}>Costo</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                $
                              </span>
                              <Input
                                id={`cost-${index}`}
                                type="text"
                                value={part.cost === 0 ? "" : part.cost}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "" || /^\d*$/.test(value)) {
                                    updatePart(
                                      index,
                                      "cost",
                                      value === "" ? "0" : value
                                    );
                                  }
                                }}
                                className="pl-7"
                                placeholder="10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`observations-${index}`}>
                              Observaciones
                            </Label>
                            <Input
                              id={`observations-${index}`}
                              value={part.observations}
                              onChange={(e) =>
                                updatePart(
                                  index,
                                  "observations",
                                  e.target.value
                                )
                              }
                              placeholder="Detalles adicionales"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="labor_cost">Costo de Mano de Obra</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          $
                        </span>
                        <Input
                          id="labor_cost"
                          type="text"
                          value={
                            formData.labor_cost === 0 ? "" : formData.labor_cost
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*$/.test(value)) {
                              updateField(
                                "labor_cost",
                                value === "" ? 0 : Number(value)
                              );
                            }
                          }}
                          className="pl-7"
                          placeholder="10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="generalObservations">
                        Observaciones Generales
                      </Label>
                      <Input
                        id="generalObservations"
                        value={formData.generalObservations}
                        onChange={(e) =>
                          updateField("generalObservations", e.target.value)
                        }
                        placeholder="Observaciones sobre el trabajo completo"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={cancelForm}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Guardando..."
                      : editingJobId
                      ? "Actualizar"
                      : "Guardar"}{" "}
                    Trabajo
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {sortedJobs.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Pieza</TableHead>
                  <TableHead className="font-semibold">
                    Tipo de Trabajo
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Costo Unitario
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Costo de Trabajo
                  </TableHead>
                  <TableHead className="font-semibold">Observaciones</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedJobs.map((job) => (
                  <React.Fragment key={`job-${job.id}`}>
                    {/* Render parts rows */}
                    {job.parts.map((part) => (
                      <TableRow key={`part-${part.id}`} className="bg-white">
                        <TableCell>{formatDate(job.date)}</TableCell>
                        <TableCell className="font-medium">
                          {part.name}
                        </TableCell>
                        <TableCell>{part.type}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(part.cost))}
                        </TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-slate-600">
                          {part.observations}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}

                    {/* Render summary row */}
                    <TableRow className="bg-slate-100 border-t border-slate-300 font-medium">
                      <TableCell>{formatDate(job.date)}</TableCell>
                      <TableCell className="font-semibold">
                        <span className="flex items-center">
                          <Badge
                            variant="outline"
                            className="mr-2 bg-slate-200"
                          >
                            W{job.id!.toString().padStart(3, "0")}
                          </Badge>
                          Trabajo completo
                        </span>
                      </TableCell>
                      <TableCell>{job.name}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(Number(job.labor_cost))}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        Costo total:{" "}
                        {formatCurrency(
                          job.total_cost ? Number(job.total_cost) : 0
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditJob(job)}
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteJob(job.id)}
                            className="h-8 w-8 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Add separator between jobs */}
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-2 p-0 bg-slate-50"
                      ></TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                {sortedJobs.length > 0 && (
                  <TableRow className="bg-slate-200 border-t-2 border-slate-400 font-bold">
                    <TableCell colSpan={4} className="text-right">
                      Total de todos los trabajos:
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(
                        sortedJobs.reduce(
                          (sum, job) =>
                            sum + (job.total_cost ? Number(job.total_cost) : 0),
                          0
                        )
                      )}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8 border rounded-md bg-slate-50">
            <p className="text-slate-500">
              No hay trabajos registrados. Crea uno nuevo con el botón
              &quot;Nuevo Trabajo&quot;.
            </p>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar eliminación
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este trabajo? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteJob}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
