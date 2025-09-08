"use client"

import { Task } from "@/types/global"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import TasksFilter from "@/components/TasksFilter"
import SearchInput from "@/components/SearchInput"
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url"
import { INITIAL_TASKS } from "@/data/initialTasks"
import { BackButton } from "@/components/BackButton"
import ROUTES from "@/constants/routes"
import { FiEdit } from "react-icons/fi"

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [assigneeFilter, setAssigneeFilter] = useState("")
  const [tagFilter, setTagFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const statuses: Task["status"][] = ["scheduled", "in-progress", "done"]

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "scheduled":
        return "#047cbc"
      case "in-progress":
        return "#bbba94"
      case "done":
        return "#4ca55c"
      default:
        return "white"
    }
  }

  const getTextColor = (status: Task["status"]) =>
    status === "in-progress" ? "#000" : "#fff"

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (!savedTasks) {
      localStorage.setItem("tasks", JSON.stringify(INITIAL_TASKS))
    }
    const allTasks: Task[] = savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS
    setTasks(allTasks.filter((t) => !t.inBacklog))

    const params = new URLSearchParams(window.location.search)
    setAssigneeFilter(params.get("assignee") || "")
    setTagFilter(params.get("tag") || "")
    setSearchQuery(params.get("query") || "")
  }, [])

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    e.dataTransfer.setData("text/plain", taskId)
  }

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: Task["status"]
  ) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")

    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === taskId)
      if (index === -1) return prev
      const updatedTask = { ...prev[index], status: newStatus }

      const savedTasks = localStorage.getItem("tasks")
      const allTasks: Task[] = savedTasks ? JSON.parse(savedTasks) : []
      const otherAll = allTasks.filter((t) => t.id !== taskId)
      localStorage.setItem("tasks", JSON.stringify([...otherAll, updatedTask]))

      const updatedTasks = [...prev]
      updatedTasks[index] = updatedTask
      return updatedTasks
    })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault()

  const moveToBacklog = (taskId: string) => {
    setTasks((prev) => {
      const updatedTasks = prev.filter((t) => t.id !== taskId)
      const savedTasks = localStorage.getItem("tasks")
      const allTasks: Task[] = savedTasks ? JSON.parse(savedTasks) : []
      const task = allTasks.find((t) => t.id === taskId)
      if (!task || task.status === "done") return prev

      const updatedTask = { ...task, inBacklog: true }
      const otherAll = allTasks.filter((t) => t.id !== taskId)
      localStorage.setItem("tasks", JSON.stringify([...otherAll, updatedTask]))

      return updatedTasks
    })
  }

  const toggleExpand = (taskId: string) =>
    setExpandedIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    )

  const filteredTasks = tasks.filter((task) => {
    const assigneeMatch = assigneeFilter
      ? task.assignee === assigneeFilter
      : true
    const tagMatch = tagFilter ? task.tags.includes(tagFilter) : true
    const queryMatch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return assigneeMatch && tagMatch && queryMatch
  })

  const handleFilterUpdate = (key: string, value: string) => {
    const newUrl = formUrlQuery({ params: window.location.search, key, value })
    window.history.replaceState({}, "", newUrl)

    if (key === "assignee") setAssigneeFilter(value)
    if (key === "tag") setTagFilter(value)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    const newUrl = formUrlQuery({
      params: window.location.search,
      key: "query",
      value,
    })
    window.history.replaceState({}, "", newUrl)
  }

  const clearFilters = () => {
    const newUrl = removeKeysFromUrlQuery({
      params: window.location.search,
      keysToRemove: ["assignee", "tag", "query"],
    })
    window.history.replaceState({}, "", newUrl)

    setAssigneeFilter("")
    setTagFilter("")
    setSearchQuery("")
  }

  return (
    <>
      <BackButton />
      <section className='p-8'>
        <h1 className='text-3xl font-bold mb-6'>Task List</h1>

        <SearchInput
          route='/tasks'
          placeholder='Search tasks...'
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <TasksFilter
          tasks={tasks}
          selectedAssignee={assigneeFilter}
          selectedTag={tagFilter}
          onFilterUpdate={handleFilterUpdate}
          onClearFilters={clearFilters}
        />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {statuses.map((status) => (
            <div
              key={status}
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={handleDragOver}
              className='bg-gray-100 p-4 rounded-lg min-h-[200px]'
            >
              <h2 className='font-semibold mb-2 capitalize'>
                {status.replace("-", " ")}
              </h2>

              {filteredTasks
                .filter((task) => task.status === status)
                .map((task) => {
                  const isExpanded = expandedIds.includes(task.id)
                  const shouldTruncate = task.description.length > 50
                  const displayDescription = isExpanded
                    ? task.description
                    : shouldTruncate
                    ? task.description.slice(0, 50) + "..."
                    : task.description

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className='mb-2 p-3 rounded-lg cursor-move flex flex-col gap-2'
                      style={{
                        backgroundColor: getStatusColor(task.status),
                        color: getTextColor(task.status),
                      }}
                    >
                      <div className='flex justify-between items-center'>
                        <p className='font-medium'>{task.title}</p>
                        <Link
                          href={ROUTES.TASK(task.id)}
                          className='text-white hover:text-gray-200'
                        >
                          <FiEdit className='text-md' />
                        </Link>
                      </div>

                      {/* Description */}
                      <p className='text-sm'>
                        {displayDescription}
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className='hover:underline ml-1 text-sm'
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </p>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-1'>
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

                      {task.status !== "done" && (
                        <button
                          onClick={() => moveToBacklog(task.id)}
                          className='mt-2 px-2 py-1 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition'
                        >
                          Move to Backlog
                        </button>
                      )}
                    </div>
                  )
                })}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Tasks
