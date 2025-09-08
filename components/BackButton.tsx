"use client"

import { useRouter } from "next/navigation"

interface BackButtonProps {
  label?: string
  className?: string
}

export const BackButton = ({
  label = "Back",
  className = "",
}: BackButtonProps) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300  transition font-medium ${className}`}
    >
      <span className='text-lg'>←</span>
      <span>{label}</span>
    </button>
  )
}
