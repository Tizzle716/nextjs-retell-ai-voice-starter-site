// components/ui/multi-select.tsx
"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Badge } from "./badge"
import { X } from "lucide-react"

export interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: Array<{
    label: string
    value: string
  }>
  placeholder?: string
}

export function MultiSelect({ value, onChange, options, placeholder }: MultiSelectProps) {
  return (
    <Command className="overflow-visible bg-transparent">
      <div className="flex flex-wrap gap-1">
        {value.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => onChange(value.filter((i) => i !== item))}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Command.Input placeholder={placeholder} className="border-none outline-none focus:ring-0" />
      <Command.List>
        {options.map((option) => (
          <Command.Item
            key={option.value}
            onSelect={() => {
              onChange(value.includes(option.value) 
                ? value.filter((item) => item !== option.value)
                : [...value, option.value]
              )
            }}
          >
            {option.label}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  )
}
