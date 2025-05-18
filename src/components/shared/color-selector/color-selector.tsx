"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface ColorOption {
  value: string
  label: string
  className: string
}

interface ColorSelectorProps {
  value: string
  onChange: (value: string) => void
  options: ColorOption[]
}

export function ColorSelector({ value, onChange, options }: ColorSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
            value === option.value ? "border-black" : "border-transparent hover:border-gray-300",
            option.className
          )}
          onClick={() => onChange(option.value)}
          aria-label={option.label}
        >
          {value === option.value && <Check className="h-5 w-5 text-white drop-shadow-md" />}
        </button>
      ))}
    </div>
  )
}
