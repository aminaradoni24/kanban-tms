"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { removeKeysFromUrlQuery } from "@/lib/url"
import React from "react"

interface ClearFiltersButtonProps {
  keysToClear?: string[]
  onClear?: () => void
}

const ClearFiltersButton = ({
  keysToClear = ["assignee", "tag", "query"],
  onClear,
}: ClearFiltersButtonProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClear = () => {
    const newUrl = removeKeysFromUrlQuery({
      params: searchParams.toString(),
      keysToRemove: keysToClear,
    })
    router.push(newUrl, { scroll: false })

    onClear?.()
  }

  return (
    <button
      onClick={handleClear}
      className='px-4 py-2 bg-red-500 text-white text-sm rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition'
    >
      Clear Filters
    </button>
  )
}

export default ClearFiltersButton
