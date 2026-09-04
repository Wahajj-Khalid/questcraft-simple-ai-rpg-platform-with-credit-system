'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

type Option = {
  value: string
  label: string
}

type CustomSelectProps = {
  name: string
  options: Option[]
  defaultValue?: string
}

export default function CustomSelect({ name, options, defaultValue }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Option>(
    options.find((o) => o.value === defaultValue) || options[0]
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden input for Form submission */}
      <input type="hidden" name={name} value={selected.value} />

      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-card border border-border hover:border-primary/60 rounded-xl px-4 py-2.5 text-xs font-medium text-foreground flex items-center justify-between shadow-sm transition-all cursor-pointer"
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {/* Floating Menu with Gap */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl p-1.5 z-50 space-y-1 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === selected.value
            return (
              <div
                key={option.value}
                onClick={() => {
                  setSelected(option)
                  setIsOpen(false)
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-primary/15 text-primary font-bold'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}