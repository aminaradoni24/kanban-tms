"use client"

import Image from "next/image"
import LoadingSvg from "@/public/loading.svg"

interface LoadingProps {
  text?: string
}

export const Loading = ({ text = "Loading..." }: LoadingProps) => (
  <div className='flex flex-col items-center justify-center py-16'>
    <Image src={LoadingSvg} alt='Loading' width={150} height={150} />
    <p className='mt-4 text-gray-500 '>{text}</p>
  </div>
)
