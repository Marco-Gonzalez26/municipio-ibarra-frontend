'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface NumberInputProps {
  id?: string
  value: number
  onChange: (value: number) => void
  allowDecimals?: boolean
  className?: string
  placeholder?: string
}

function sanitize(raw: string, allowDecimals: boolean) {
  const withDot = raw.replace(/,/g, '.')
  const onlyValidChars = withDot.replace(/[^0-9.]/g, '')

  if (!allowDecimals) return onlyValidChars.replace(/\./g, '')

  const firstDot = onlyValidChars.indexOf('.')
  if (firstDot === -1) return onlyValidChars

  return (
    onlyValidChars.slice(0, firstDot + 1) +
    onlyValidChars.slice(firstDot + 1).replace(/\./g, '')
  )
}

export function NumberInput({
  id,
  value,
  onChange,
  allowDecimals = true,
  className,
  placeholder = '0',
}: NumberInputProps) {
  const [text, setText] = useState(() => (value ? String(value) : ''))
  const isFocused = useRef(false)

  useEffect(() => {
    if (!isFocused.current) {
      setText(value ? String(value) : '')
    }
  }, [value])

  return (
    <Input
      id={id}
      type="text"
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      placeholder={placeholder}
      value={text}
      className={cn(className)}
      onFocus={() => {
        isFocused.current = true
      }}
      onChange={(event) => {
        const cleaned = sanitize(event.target.value, allowDecimals)
        setText(cleaned)
        const parsed = Number(cleaned)
        onChange(Number.isFinite(parsed) ? parsed : 0)
      }}
      onBlur={() => {
        isFocused.current = false
        const parsed = Number(text)
        const normalized = Number.isFinite(parsed) ? parsed : 0
        setText(normalized ? String(normalized) : '')
        if (normalized !== value) onChange(normalized)
      }}
    />
  )
}
