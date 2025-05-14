"use client"

import type React from "react"

import { useState } from "react"

// Define types for the form
export type JobFormPart = {
  id?: number
  job_id?: number
  name: string
  type: string
  cost: number
  observations: string
}

export type JobFormData = {
  name: string
  date: string
  labor_cost: number
  generalObservations: string
  parts: JobFormPart[]
}

// Define types for API requests
export type JobCreateRequest = {
  name: string
  date: string
  userId: string
  laborCost: number
  generalObservations: string
  parts: Omit<JobFormPart, "id" | "job_id">[]
}

export type JobUpdateRequest = {
  id: number
  name: string
  date: string
  userId: string
  laborCost: number
  generalObservations: string
  parts: (Omit<JobFormPart, "job_id"> & { id?: number })[]
}

// Define types for API responses
export type Job = {
  id?: number
  name: string
  date: string
  user_id: string
  labor_cost: number
  total_cost?: number
  general_observations: string
  parts: JobFormPart[]
}

// Initial form state for a new part
const emptyPart: JobFormPart = {
  name: "",
  type: "",
  cost: 0.0,
  observations: "",
}

// Initial form state
const initialFormState: JobFormData = {
  name: "",
  date: "",
  labor_cost: 0.0,
  generalObservations: "",
  parts: [{ ...emptyPart }],
}

interface UseJobFormProps {
  onSubmit: (data: JobCreateRequest | JobUpdateRequest, isEditing: boolean) => Promise<void>
}

export function useJobForm({ onSubmit }: UseJobFormProps) {
  const [formData, setFormData] = useState<JobFormData>(initialFormState)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [editingJobId, setEditingJobId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add a new part to the form
  const addPart = () => {
    setFormData({
      ...formData,
      parts: [...formData.parts, { ...emptyPart }],
    })
  }

  // Remove a part from the form
  const removePart = (index: number) => {
    const newParts = [...formData.parts]
    newParts.splice(index, 1)
    setFormData({
      ...formData,
      parts: newParts,
    })
  }

  // Update a part in the form
  const updatePart = (index: number, field: string, value: string) => {
    const newParts = [...formData.parts]
    newParts[index] = {
      ...newParts[index],
      [field]: field === "cost" ? (value === "" ? 0 : Number.parseFloat(value)) : value,
    }
    setFormData({
      ...formData,
      parts: newParts,
    })
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      // Format date as yyyy-MM-dd
      const formattedDate = date.toISOString().split("T")[0]
      setFormData({ ...formData, date: formattedDate })
    } else {
      setFormData({ ...formData, date: "" })
    }
  }

  // Update form field
  const updateField = (field: keyof JobFormData, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Reset form
  const resetForm = () => {
    setFormData(initialFormState)
    setSelectedDate(undefined)
    setEditingJobId(null)
  }

  // Load job data for editing
  const loadJobForEdit = (job: Job) => {
    // Convert job data to form format
    const formData: JobFormData = {
      name: job.name,
      date: job.date,
      labor_cost: job.labor_cost,
      generalObservations: job.general_observations,
      parts: job.parts.map((part) => ({
        id: part.id,
        job_id: part.job_id,
        name: part.name,
        type: part.type,
        cost: part.cost,
        observations: part.observations,
      })),
    }

    setFormData(formData)

    // Parse the date string to a Date object
    if (job.date) {
      try {
        // Handle different date formats
        let dateObj
        if (job.date.includes("/")) {
          // Format: DD/MM/YYYY
          const [day, month, year] = job.date.split("/")
          dateObj = new Date(`${year}-${month}-${day}`)
        } else if (job.date.includes("-")) {
          // Format: YYYY-MM-DD
          dateObj = new Date(job.date)
        } else {
          // Try to parse as is
          dateObj = new Date(job.date)
        }

        // Check if date is valid
        if (!isNaN(dateObj.getTime())) {
          setSelectedDate(dateObj)
        } else {
          console.error("Invalid date:", job.date)
          setSelectedDate(undefined)
        }
      } catch (e) {
        console.error("Error parsing date:", e)
        setSelectedDate(undefined)
      }
    } else {
      setSelectedDate(undefined)
    }

    setEditingJobId(job.id || null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, userId: string) => {
    e.preventDefault()

    // Validate date
    if (!formData.date) {
      alert("Por favor seleccione una fecha")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare request data based on whether we're editing or creating
      if (editingJobId) {
        // Update existing job
        const updateRequest: JobUpdateRequest = {
          id: editingJobId,
          name: formData.name,
          date: formData.date,
          userId: userId,
          laborCost: formData.labor_cost,
          generalObservations: formData.generalObservations,
          parts: formData.parts.map((part) => ({
            id: part.id,
            name: part.name,
            type: part.type,
            cost: part.cost,
            observations: part.observations,
          })),
        }
        await onSubmit(updateRequest, true)
      } else {
        // Create new job
        const createRequest: JobCreateRequest = {
          name: formData.name,
          date: formData.date,
          userId: userId,
          laborCost: formData.labor_cost,
          generalObservations: formData.generalObservations,
          parts: formData.parts.map((part) => ({
            name: part.name,
            type: part.type,
            cost: part.cost,
            observations: part.observations,
          })),
        }
        await onSubmit(createRequest, false)
      }

      // Reset form after successful submission
      resetForm()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
