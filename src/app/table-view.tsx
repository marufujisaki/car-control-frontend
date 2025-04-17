"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, PlusCircle, Lock } from "lucide-react"
import { LoginButton } from "./login-button"
import { AuthProvider, useAuth } from "./auth-context"

// Sample data for the table with WorkId grouping and userId
const initialData = [
  // Work ID: W001 - User 1
  {
    id: 1,
    workId: "W001",
    userId: "user1",
    fecha: "24/03/2025",
    pieza: "Motor A-123",
    tipoTrabajo: "Reparación",
    estadoPieza: "Bueno",
    costoUnitario: 120,
    costoTrabajo: null,
    observaciones: "Cambio de piezas internas",
    isWorkSummary: false,
  },
  {
    id: 2,
    workId: "W001",
    userId: "user1",
    fecha: "24/03/2025",
    pieza: "Filtro de aceite",
    tipoTrabajo: "Reemplazo",
    estadoPieza: "Malo",
    costoUnitario: 35,
    costoTrabajo: null,
    observaciones: "Reemplazo completo",
    isWorkSummary: false,
  },
  {
    id: 3,
    workId: "W001",
    userId: "user1",
    fecha: "24/03/2025",
    pieza: "Trabajo completo",
    tipoTrabajo: "Reparación motor",
    estadoPieza: "-",
    costoUnitario: null,
    costoTrabajo: 350,
    observaciones: "Trabajo finalizado",
    isWorkSummary: true,
  },

  // Work ID: W002 - User 1
  {
    id: 4,
    workId: "W002",
    userId: "user1",
    fecha: "22/03/2025",
    pieza: "Frenos C-789",
    tipoTrabajo: "Reemplazo",
    estadoPieza: "Malo",
    costoUnitario: 150,
    costoTrabajo: null,
    observaciones: "Reemplazo de pastillas",
    isWorkSummary: false,
  },
  {
    id: 5,
    workId: "W002",
    userId: "user1",
    fecha: "22/03/2025",
    pieza: "Discos de freno",
    tipoTrabajo: "Reemplazo",
    estadoPieza: "Regular",
    costoUnitario: 90,
    costoTrabajo: null,
    observaciones: "Reemplazo parcial",
    isWorkSummary: false,
  },
  {
    id: 6,
    workId: "W002",
    userId: "user1",
    fecha: "22/03/2025",
    pieza: "Trabajo completo",
    tipoTrabajo: "Sistema de frenos",
    estadoPieza: "-",
    costoUnitario: null,
    costoTrabajo: 420,
    observaciones: "Trabajo finalizado",
    isWorkSummary: true,
  },

  // Work ID: W003 - User 2 (different user)
  {
    id: 7,
    workId: "W003",
    userId: "user2",
    fecha: "20/03/2025",
    pieza: "Alternador E-345",
    tipoTrabajo: "Reparación",
    estadoPieza: "Regular",
    costoUnitario: 110,
    costoTrabajo: null,
    observaciones: "Cambio de componentes eléctricos",
    isWorkSummary: false,
  },
  {
    id: 8,
    workId: "W003",
    userId: "user2",
    fecha: "20/03/2025",
    pieza: "Batería",
    tipoTrabajo: "Revisión",
    estadoPieza: "Bueno",
    costoUnitario: 80,
    costoTrabajo: null,
    observaciones: "Limpieza de terminales",
    isWorkSummary: false,
  },
  {
    id: 9,
    workId: "W003",
    userId: "user2",
    fecha: "20/03/2025",
    pieza: "Trabajo completo",
    tipoTrabajo: "Sistema eléctrico",
    estadoPieza: "-",
    costoUnitario: null,
    costoTrabajo: 290,
    observaciones: "Trabajo finalizado",
    isWorkSummary: true,
  },
]

// Format currency values
const formatCurrency = (amount: number | null) => {
  if (amount === null) return "-"
  return `$${amount.toFixed(0)}`
}

// Get badge color based on estado
const getEstadoBadge = (estado: string) => {
  if (estado === "-") return <span>-</span>

  switch (estado.toLowerCase()) {
    case "bueno":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {estado}
        </Badge>
      )
    case "regular":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {estado}
        </Badge>
      )
    case "malo":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {estado}
        </Badge>
      )
    default:
      return <Badge variant="outline">{estado}</Badge>
  }
}

// Group data by workId
const groupByWorkId = (data: any[]) => {
  const grouped: Record<string, any[]> = {}

  data.forEach((item) => {
    if (!grouped[item.workId]) {
      grouped[item.workId] = []
    }
    grouped[item.workId].push(item)
  })

  return Object.values(grouped)
}

// Generate a new work ID
const generateWorkId = (existingIds: string[]) => {
  const lastId = existingIds.reduce((max, id) => {
    const num = Number.parseInt(id.replace("W", ""))
    return num > max ? num : max
  }, 0)

  return `W${String(lastId + 1).padStart(3, "0")}`
}

// Initial form state for a new part
const emptyPart = {
  pieza: "",
  tipoTrabajo: "",
  estadoPieza: "",
  costoUnitario: "",
  observaciones: "",
}

function TableViewContent() {
  const { user, isLoading } = useAuth()
  const [data, setData] = React.useState(initialData)
  const [open, setOpen] = React.useState(false)
  const [workForm, setWorkForm] = React.useState({
    nombre: "",
    fecha: "",
    costoTrabajo: "",
    observaciones: "",
    parts: [{ ...emptyPart }],
  })

  // Filter data by current user
  const filteredData = user
    ? data.filter((item) => {
        // For demo purposes, if the user ID starts with "google-", show user1's data
        const effectiveUserId = user.id.startsWith("google-") ? "user1" : user.id
        return item.userId === effectiveUserId
      })
    : []

  const groupedData = groupByWorkId(filteredData)
  const existingWorkIds = data.map((item) => item.workId).filter((v, i, a) => a.indexOf(v) === i)

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
      [field]: field === "costoUnitario" ? (value === "" ? "" : Number.parseFloat(value)) : value,
    }
    setWorkForm({
      ...workForm,
      parts: newParts,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Generate a new work ID
    const newWorkId = generateWorkId(existingWorkIds)

    // Get the next available ID
    const nextId = Math.max(...data.map((item) => item.id)) + 1

    // Create new items for each part
    const newItems = workForm.parts.map((part, index) => ({
      id: nextId + index,
      workId: newWorkId,
      userId: user.id,
      fecha: workForm.fecha,
      pieza: part.pieza,
      tipoTrabajo: part.tipoTrabajo,
      estadoPieza: part.estadoPieza,
      costoUnitario: Number.parseFloat(part.costoUnitario as string),
      costoTrabajo: null,
      observaciones: part.observaciones,
      isWorkSummary: false,
    }))

    // Create the summary item
    const summaryItem = {
      id: nextId + workForm.parts.length,
      workId: newWorkId,
      userId: user.id,
      fecha: workForm.fecha,
      pieza: "Trabajo completo",
      tipoTrabajo: workForm.nombre,
      estadoPieza: "-",
      costoUnitario: null,
      costoTrabajo: Number.parseFloat(workForm.costoTrabajo as string),
      observaciones: workForm.observaciones,
      isWorkSummary: true,
    }

    // Add all new items to the data
    setData([...data, ...newItems, summaryItem])

    // Reset the form and close the modal
    setWorkForm({
      nombre: "",
      fecha: "",
      costoTrabajo: "",
      observaciones: "",
      parts: [{ ...emptyPart }],
    })
    setOpen(false)
  }

  // Calculate total cost of parts
  const calculateTotalParts = () => {
    return workForm.parts.reduce((sum, part) => {
      const cost = Number.parseFloat(part.costoUnitario as string) || 0
      return sum + cost
    }, 0)
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
                      <Label htmlFor="nombre">Nombre del Trabajo</Label>
                      <Input
                        id="nombre"
                        value={workForm.nombre}
                        onChange={(e) => setWorkForm({ ...workForm, nombre: e.target.value })}
                        placeholder="Ej: Reparación de motor"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="text"
                        value={workForm.fecha}
                        onChange={(e) => setWorkForm({ ...workForm, fecha: e.target.value })}
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
                            <Label htmlFor={`pieza-${index}`}>Nombre de la Pieza</Label>
                            <Input
                              id={`pieza-${index}`}
                              value={part.pieza}
                              onChange={(e) => updatePart(index, "pieza", e.target.value)}
                              placeholder="Ej: Motor A-123"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`tipo-${index}`}>Tipo de Trabajo</Label>
                            <Select
                              value={part.tipoTrabajo}
                              onValueChange={(value) => updatePart(index, "tipoTrabajo", value)}
                              required
                            >
                              <SelectTrigger id={`tipo-${index}`}>
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
                            <Label htmlFor={`estado-${index}`}>Estado de la Pieza</Label>
                            <Select
                              value={part.estadoPieza}
                              onValueChange={(value) => updatePart(index, "estadoPieza", value)}
                              required
                            >
                              <SelectTrigger id={`estado-${index}`}>
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bueno">Bueno</SelectItem>
                                <SelectItem value="Regular">Regular</SelectItem>
                                <SelectItem value="Malo">Malo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`costo-${index}`}>Costo Unitario</Label>
                            <Input
                              id={`costo-${index}`}
                              type="number"
                              value={part.costoUnitario}
                              onChange={(e) => updatePart(index, "costoUnitario", e.target.value)}
                              placeholder="$"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`obs-${index}`}>Observaciones</Label>
                          <Textarea
                            id={`obs-${index}`}
                            value={part.observaciones}
                            onChange={(e) => updatePart(index, "observaciones", e.target.value)}
                            placeholder="Detalles adicionales"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="costoTrabajo">Costo Total del Trabajo</Label>
                      <Input
                        id="costoTrabajo"
                        type="number"
                        value={workForm.costoTrabajo}
                        onChange={(e) => setWorkForm({ ...workForm, costoTrabajo: e.target.value })}
                        placeholder="$"
                        required
                      />
                      <p className="text-xs text-slate-500">Suma de costos unitarios: ${calculateTotalParts()}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="obsGeneral">Observaciones Generales</Label>
                      <Textarea
                        id="obsGeneral"
                        value={workForm.observaciones}
                        onChange={(e) => setWorkForm({ ...workForm, observaciones: e.target.value })}
                        placeholder="Observaciones sobre el trabajo completo"
                        rows={3}
                      />
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
        {groupedData.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Pieza</TableHead>
                  <TableHead className="font-semibold">Tipo de Trabajo</TableHead>
                  <TableHead className="font-semibold">Estado de Pieza</TableHead>
                  <TableHead className="font-semibold text-right">Costo Unitario</TableHead>
                  <TableHead className="font-semibold text-right">Costo de Trabajo</TableHead>
                  <TableHead className="font-semibold">Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedData.map((group, groupIndex) => (
                  <React.Fragment key={`group-${groupIndex}`}>
                    {group.map((item, itemIndex) => (
                      <TableRow
                        key={item.id}
                        className={
                          item.isWorkSummary ? "bg-slate-100 border-t border-slate-300 font-medium" : "bg-white"
                        }
                      >
                        <TableCell>{item.fecha}</TableCell>
                        <TableCell className={item.isWorkSummary ? "font-semibold" : "font-medium"}>
                          {item.isWorkSummary ? (
                            <span className="flex items-center">
                              <Badge variant="outline" className="mr-2 bg-slate-200">
                                {item.workId}
                              </Badge>
                              {item.pieza}
                            </span>
                          ) : (
                            item.pieza
                          )}
                        </TableCell>
                        <TableCell>{item.tipoTrabajo}</TableCell>
                        <TableCell>{getEstadoBadge(item.estadoPieza)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.costoUnitario)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.isWorkSummary ? formatCurrency(item.costoTrabajo) : "-"}
                        </TableCell>
                        <TableCell className="text-slate-600">{item.observaciones}</TableCell>
                      </TableRow>
                    ))}
                    {groupIndex < groupedData.length - 1 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-2 p-0 bg-slate-50"></TableCell>
                      </TableRow>
                    )}
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
