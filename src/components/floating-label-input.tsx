'use client'

import { InputHTMLAttributes, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FloatingLabelInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export function FloatingLabelInput({
  label,
  id,
  className,
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState('')

  return (
    <div className="relative">
      <Input
        id={id}
        className={`w-full rounded-md bg-white px-4 pb-2 pt-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-background dark:text-gray-400 ${className}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <Label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 ${
          isFocused || value
            ? 'top-1 text-[9px] text-blue-500'
            : 'top-1/2 -translate-y-1/2 text-gray-500'
        }`}
      >
        {label}
      </Label>
    </div>
  )
}
