"use client"

import ROUTES from "@/constants/routes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"

const Navigation = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: ROUTES.HOME, label: "Home" },
    { href: ROUTES.BACKLOGS, label: "Backlogs" },
    { href: ROUTES.TASKS, label: "Task List" },
  ]

  return (
    <>
      <button
        className='fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-blue-500 text-white'
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <section
        className={`fixed top-0 left-0 h-screen w-64 bg-[#e9f2ff] border-r border-gray-300 p-6 pt-20 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className='flex flex-1 flex-col gap-6'>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-start gap-4 p-4 rounded-lg ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-dark300_light900 hover:bg-gray-200"
                }`}
              >
                <p className='base-medium'>{link.label}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Navigation
