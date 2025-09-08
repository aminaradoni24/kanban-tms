"use client"

import Image from "next/image"
import ErrorSvg from "@/public/error.svg"

interface ErrorStateProps {
  text?: string
}

export const ErrorState = ({
  text = "Something went wrong.",
}: ErrorStateProps) => (
  <div className='flex flex-col items-center justify-center py-16'>
    <Image src={ErrorSvg} alt='Error' width={150} height={150} />
    <p className='mt-4 text-gray-500 '>{text}</p>
  </div>
)
