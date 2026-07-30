'use client'

import { Eye, EyeOff } from 'lucide-react'
import { InputHTMLAttributes, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export function FloatingLabelInput({
  label,
  id,
  className,
  type,
  ...inputProps
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="relative">
      <Input
        id={id}
        type={isPassword && showPassword ? 'text' : type}
        className={`h-14 w-full bg-background px-4 pb-2 pt-6 text-foreground ${isPassword ? 'pe-11' : ''} ${className ?? ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...inputProps}
      />
      {isPassword && (
        <button
          type="button"
          className="absolute end-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      )}
      <Label
        htmlFor={id}
        className={`pointer-events-none absolute start-4 transition-all duration-200 ${
          isFocused || value
            ? 'top-2 text-xs text-primary'
            : 'top-1/2 -translate-y-1/2 text-muted-foreground'
        }`}
      >
        {label}
      </Label>
    </div>
  )
}
