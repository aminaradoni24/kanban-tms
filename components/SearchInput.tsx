"use client"

import { useEffect } from "react"

interface Props {
  route: string
  placeholder?: string
  iconSrc?: string
  iconPosition?: "left" | "right"
  otherClasses?: string
  clearSignal?: boolean
  value?: string
  onChange?: (value: string) => void
}

const SearchInput = ({
  placeholder = "Search...",
  otherClasses = "",
  clearSignal = false,
  value = "",
  onChange,
}: Props) => {
  useEffect(() => {
    if (clearSignal && onChange) {
      onChange("")
    }
  }, [clearSignal, onChange])

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 my-2 ${otherClasses}`}
    >
      <input
        type='text'
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className='flex-1 bg-transparent outline-none text-gray-700  '
      />
    </div>
  )
}

export default SearchInput
