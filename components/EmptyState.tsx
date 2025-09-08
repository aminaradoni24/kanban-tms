"use client"

import Image from "next/image"
import EmptySvg from "@/public/empty.svg"

interface EmptyStateProps {
  text?: string
}

export const EmptyState = ({ text = "No items found." }: EmptyStateProps) => (
  <div className='flex flex-col items-center justify-center py-16'>
    <Image src={EmptySvg} alt='Empty' width={150} height={150} />
    <p className='mt-4 text-gray-500 '>{text}</p>
  </div>
)
