"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Task } from "@/types/global"
import { FaChevronDown } from "react-icons/fa"
import { formUrlQuery } from "@/lib/url"

interface TasksFilterProps {
  tasks: Task[]
  selectedAssignee?: string
  selectedTag?: string
  onFilterUpdate?: (key: string, value: string) => void
  onClearFilters?: () => void
}

const TasksFilter = ({
  tasks,
  selectedAssignee = "",
  selectedTag = "",
  onFilterUpdate,
  onClearFilters,
}: TasksFilterProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const assignees = Array.from(
    new Set(tasks.map((task) => task.assignee).filter(Boolean))
  )

  const tags = Array.from(new Set(tasks.flatMap((task) => task.tags)))

  const handleUpdateParams = (key: string, value: string) => {
    if (onFilterUpdate) {
      onFilterUpdate(key, value)
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key,
        value,
      })
      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <div className='flex gap-4 flex-wrap mb-6 items-center'>
      {/* Assignee Filter */}
      <div className='relative'>
        <select
          className='appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm bg-white  text-gray-700  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
          onChange={(e) => handleUpdateParams("assignee", e.target.value)}
          value={selectedAssignee}
        >
          <option value=''>Filter by Assignee</option>
          {assignees.length > 0 ? (
            assignees.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))
          ) : (
            <option value='none'>No assignees</option>
          )}
        </select>
        <FaChevronDown className='pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ' />
      </div>

      <div className='relative'>
        <select
          className='appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm bg-white  text-gray-700  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
          onChange={(e) => handleUpdateParams("tag", e.target.value)}
          value={selectedTag}
        >
          <option value=''>Filter by Tag</option>
          {tags.length > 0 ? (
            tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))
          ) : (
            <option value='none'>No tags</option>
          )}
        </select>
        <FaChevronDown className='pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ' />
      </div>

      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className='px-4 py-2 bg-red-500 text-white text-sm rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition'
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

export default TasksFilter
