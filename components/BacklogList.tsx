"use client"

import { useState } from "react"
import { Task } from "@/types/global"
import Link from "next/link"
import { Loading } from "./Loading"
import { ErrorState } from "./ErrorState"
import { EmptyState } from "./EmptyState"
import { FiEdit } from "react-icons/fi"
import ROUTES from "@/constants/routes"

interface BacklogListProps {
  tasks: Task[]
  onMove: (task: Task) => void
  isLoading?: boolean
  isError?: boolean
}

export const BacklogList = ({
  tasks,
  onMove,
  isLoading = false,
  isError = false,
}: BacklogListProps) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  if (isLoading) return <Loading />
  if (isError) return <ErrorState text='Failed to load backlogs.' />
  if (!tasks || tasks.length === 0)
    return <EmptyState text='No tasks in backlog.' />

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {tasks.map((task) => {
        const sentences = task.description.split(". ").filter(Boolean)
        const isExpanded = expandedIds.includes(task.id)
        const shortDescription =
          sentences.length > 2
            ? sentences.slice(0, 2).join(". ") + "."
            : task.description

        return (
          <div
            key={task.id}
            className='p-4 border border-gray-300  rounded-lg shadow-sm bg-white  flex flex-col justify-between'
          >
            <div className='flex justify-between items-center mb-2'>
              <p className='text-gray-800  font-semibold'>{task.title}</p>
              <Link
                href={ROUTES.TASK(task.id)}
                className='text-gray-800  hover:text-blue-500'
              >
                <FiEdit />
              </Link>
            </div>

            <p className='text-gray-600  text-sm mb-2'>
              {isExpanded ? task.description : shortDescription}
              {sentences.length > 2 && (
                <button
                  onClick={() => toggleExpand(task.id)}
                  className='ml-1 text-blue-500 hover:underline text-sm'
                >
                  {isExpanded ? "Read less" : "Read more"}
                </button>
              )}
            </p>

            <p className='text-gray-700  text-sm mt-1'>
              <span className='font-semibold'>Assignee:</span>{" "}
              {task.assignee || "Unassigned"}
            </p>

            {task.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-1'>
                {task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className='px-2 py-1 bg-gray-200  text-gray-800  rounded-full text-xs'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className='flex gap-2 mt-3'>
              <button
                onClick={() => onMove(task)}
                className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition'
              >
                Move
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
