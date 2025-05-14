import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Invalid Date"
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}


export function parseDate(dateString: string): Date {
  try {
    // Handle different date formats
    if (dateString.includes("/")) {
      // Format: DD/MM/YYYY
      const [day, month, year] = dateString.split("/")
      return new Date(`${year}-${month}-${day}`)
    } else if (dateString.includes("-")) {
      // Format: YYYY-MM-DD
      return new Date(dateString)
    } else {
      // Try to parse as is
      return new Date(dateString)
    }
  } catch (error) {
    console.error("Error parsing date:", error)
    return new Date(0) // Return epoch date as fallback
  }
}