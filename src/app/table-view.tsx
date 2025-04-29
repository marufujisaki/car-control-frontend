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
  Card,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, PlusCircle, Lock } from "lucide-react";
import { LoginButton } from "./login-button";
import { AuthProvider, useAuth } from "./auth-context";

type Part = {
  id: number
  job_id: number
  name: string
  type: string
  cost: number
  observations: string
}

type Job = {
  id: number
  name: string
  date: string
  userId: string
  labor_cost: number
  total_cost: number
  parts: Part[]
}
// Sample data in the new format
const initialJobs: Job[] = [
  {
    id: 1,
    name: "Reparación motor",
    date: "24/03/2025",
    userId: "user1",
    labor_cost: 195,
    total_cost: 350,
    parts: [
      {
        id: 1,
        job_id: 1,
        name: "Motor A-123",
        type: "Reparación",
        cost: 120,
        observations: "Cambio de piezas internas",
      },
      {
        id: 2,
        job_id: 1,
        name: "Filtro de aceite",
        type: "Reemplazo",
        cost: 35,
        observations: "Reemplazo completo",
      },
    ],
  },
  {
    id: 2,
    name: "Sistema de frenos",
    date: "22/03/2025",
    userId: "user1",
    labor_cost: 180,
    total_cost: 420,
    parts: [
      {
        id: 3,
        job_id: 2,
        name: "Frenos C-789",
        type: "Reemplazo",
        cost: 150,
        observations: "Reemplazo de pastillas",
      },
      {
        id: 4,
        job_id: 2,
        name: "Discos de freno",
        type: "Reemplazo",
        cost: 90,
        observations: "Reemplazo parcial",
      },
    ],
  },
  {
    id: 3,
    name: "Sistema eléctrico",
    date: "20/03/2025",
    userId: "user2",
    labor_cost: 100,
    total_cost: 290,
    parts: [
      {
        id: 5,
        job_id: 3,
        name: "Alternador E-345",
        type: "Reparación",
        cost: 110,
        observations: "Cambio de componentes eléctricos",
      },
      {
        id: 6,
        job_id: 3,
        name: "Batería",
        type: "Revisión",
        cost: 80,
        observations: "Limpieza de terminales",
      },
    ],
  },
]


// Format currency values
const formatCurrency = (amount: number | null) => {
  if (amount === null) return "-"
  return `$${amount.toFixed(0)}`
}

// Initial form state for a new part
const emptyPart = {
  name: "",
  type: "",
  cost: "",
  observations: "",
}

function TableViewContent() {
  const { user, isLoading } = useAuth()
  const [jobs, setJobs] = React.useState<Job[]>(initialJobs)
  const [open, setOpen] = React.useState(false)
  const [workForm, setWorkForm] = React.useState({
    name: "",
    date: "",
    labor_cost: "",
    parts: [{ ...emptyPart }],
  })

  // Filter jobs by current user
  const filteredJobs = user
    ? jobs.filter((job) => {
        // For demo purposes, if the user ID starts with "google-", show user1's data
        const effectiveUserId = "user1"
        return job.userId === effectiveUserId
      })
    : []

  // Add a new part to the form
  const addPart = () => {
    setWorkForm({
      ...workForm,
      parts: [...workForm.parts, { ...emptyPart }],
    })
  }

  // Remove a part from the form
  const removePart = (index: number) => {
    const newParts = [...workForm.parts]
    newParts.splice(index, 1)
    setWorkForm({
      ...workForm,
      parts: newParts,
    })
  }

  // Update a part in the form
  const updatePart = (index: number, field: string, value: string) => {
    const newParts = [...workForm.parts]
    newParts[index] = {
      ...newParts[index],
      [field]: field === "cost" ? (value === "" ? "" : Number.parseFloat(value)) : value,
    }
    setWorkForm({
      ...workForm,
      parts: newParts,
    })
  }

  // Calculate total cost of parts
  const calculateTotalParts = () => {
    return workForm.parts.reduce((sum, part) => {
      const cost = Number.parseFloat(part.cost as string) || 0
      return sum + cost
    }, 0)
  }

  // Calculate total cost (parts + labor)
  const calculateTotalCost = () => {
    const partsCost = calculateTotalParts()
    const laborCost = Number.parseFloat(workForm.labor_cost as string) || 0
    return partsCost + laborCost
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Get the next available job ID
    const nextJobId = Math.max(...jobs.map((job) => job.id)) + 1

    // Get the next available part ID
    const nextPartId = Math.max(...jobs.flatMap((job) => job.parts.map((part) => part.id))) + 1

    // Calculate total cost
    const laborCost = Number.parseFloat(workForm.labor_cost as string)
    const totalCost = calculateTotalCost()

    // Create new job with parts
    const newJob: Job = {
      id: nextJobId,
      name: workForm.name,
      date: workForm.date,
      userId: user.id,
      labor_cost: laborCost,
      total_cost: totalCost,
      parts: workForm.parts.map((part, index) => ({
        id: nextPartId + index,
        job_id: nextJobId,
        name: part.name,
        type: part.type,
        cost: Number.parseFloat(part.cost as string),
        observations: part.observations,
      })),
    }

    // Add the new job to the jobs array
    setJobs([...jobs, newJob])

    // Reset the form and close the modal
    setWorkForm({
      name: "",
      date: "",
      labor_cost: "",
      parts: [{ ...emptyPart }],
    })
    setOpen(false)
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 p-4 rounded-full bg-slate-100">
          <Lock className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        <p className="text-slate-500 mb-6 max-w-md">
          Inicia sesión con tu cuenta de Google para ver y gestionar tus trabajos.
        </p>
        <LoginButton />
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <>
      <CardHeader className="bg-slate-50 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Registro de Trabajos</CardTitle>
          <CardDescription>Listado de piezas, trabajos realizados y costos asociados</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Trabajo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Trabajo</DialogTitle>
                  <DialogDescription>
                    Complete los detalles del trabajo y agregue las piezas necesarias.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del Trabajo</Label>
                      <Input
                        id="name"
                        value={workForm.name}
                        onChange={(e) => setWorkForm({ ...workForm, name: e.target.value })}
                        placeholder="Ej: Reparación de motor"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha</Label>
                      <Input
                        id="date"
                        type="text"
                        value={workForm.date}
                        onChange={(e) => setWorkForm({ ...workForm, date: e.target.value })}
                        placeholder="DD/MM/AAAA"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <Label>Piezas y Repuestos</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addPart}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Agregar Pieza
                      </Button>
                    </div>

                    {workForm.parts.map((part, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-md bg-slate-50">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Pieza #{index + 1}</h4>
                          {workForm.parts.length > 1 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removePart(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${index}`}>Nombre de la Pieza</Label>
                            <Input
                              id={`name-${index}`}
                              value={part.name}
                              onChange={(e) => updatePart(index, "name", e.target.value)}
                              placeholder="Ej: Motor A-123"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`type-${index}`}>Tipo de Trabajo</Label>
                            <Select
                              value={part.type}
                              onValueChange={(value) => updatePart(index, "type", value)}
                              required
                            >
                              <SelectTrigger id={`type-${index}`}>
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Reparación">Reparación</SelectItem>
                                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                                <SelectItem value="Reemplazo">Reemplazo</SelectItem>
                                <SelectItem value="Revisión">Revisión</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`cost-${index}`}>Costo</Label>
                            <Input
                              id={`cost-${index}`}
                              type="number"
                              value={part.cost}
                              onChange={(e) => updatePart(index, "cost", e.target.value)}
                              placeholder="$"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`observations-${index}`}>Observaciones</Label>
                            <Input
                              id={`observations-${index}`}
                              value={part.observations}
                              onChange={(e) => updatePart(index, "observations", e.target.value)}
                              placeholder="Detalles adicionales"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="labor_cost">Costo de Mano de Obra</Label>
                    <Input
                      id="labor_cost"
                      type="number"
                      value={workForm.labor_cost}
                      onChange={(e) => setWorkForm({ ...workForm, labor_cost: e.target.value })}
                      placeholder="$"
                      required
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Costo de piezas: {formatCurrency(calculateTotalParts())}</span>
                      <span>Costo total: {formatCurrency(calculateTotalCost())}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Trabajo</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <LoginButton />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {filteredJobs.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Pieza</TableHead>
                  <TableHead className="font-semibold">Tipo de Trabajo</TableHead>
                  <TableHead className="font-semibold text-right">Costo Unitario</TableHead>
                  <TableHead className="font-semibold text-right">Costo de Trabajo</TableHead>
                  <TableHead className="font-semibold">Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <React.Fragment key={`job-${job.id}`}>
                    {/* Render parts rows */}
                    {job.parts.map((part) => (
                      <TableRow key={`part-${part.id}`} className="bg-white">
                        <TableCell>{job.date}</TableCell>
                        <TableCell className="font-medium">{part.name}</TableCell>
                        <TableCell>{part.type}</TableCell>
                        <TableCell className="text-right">{formatCurrency(part.cost)}</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-slate-600">{part.observations}</TableCell>
                      </TableRow>
                    ))}

                    {/* Render summary row */}
                    <TableRow className="bg-slate-100 border-t border-slate-300 font-medium">
                      <TableCell>{job.date}</TableCell>
                      <TableCell className="font-semibold">
                        <span className="flex items-center">
                          <Badge variant="outline" className="mr-2 bg-slate-200">
                            W{job.id.toString().padStart(3, "0")}
                          </Badge>
                          Trabajo completo
                        </span>
                      </TableCell>
                      <TableCell>{job.name}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(job.labor_cost)}</TableCell>
                      <TableCell className="text-slate-600">Costo total: {formatCurrency(job.total_cost)}</TableCell>
                    </TableRow>

                    {/* Add separator between jobs */}
                    <TableRow>
                      <TableCell colSpan={6} className="h-2 p-0 bg-slate-50"></TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8 border rounded-md bg-slate-50">
            <p className="text-slate-500">No hay trabajos registrados. Crea uno nuevo con el botón "Nuevo Trabajo".</p>
          </div>
        )}
      </CardContent>
    </>
  )
}

export default function TableView() {
  return (
    <AuthProvider>
      <Card className="w-full border shadow">
        <TableViewContent />
      </Card>
    </AuthProvider>
  )
}

