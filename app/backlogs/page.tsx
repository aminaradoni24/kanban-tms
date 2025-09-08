"use client"

import React, { useEffect, useState, useCallback, Suspense } from "react"
import { Task } from "@/types/global"
import TasksFilter from "@/components/TasksFilter"
import SearchInput from "@/components/SearchInput"
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url"
import { INITIAL_TASKS } from "@/data/initialTasks"
import { BacklogList } from "@/components/BacklogList"
import { AddTaskForm } from "@/components/AddTaskForm"

const BackLogs = () => {
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [assigneeFilter, setAssigneeFilter] = useState("")
  const [tagFilter, setTagFilter] = useState("")

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (!savedTasks) {
      localStorage.setItem("tasks", JSON.stringify(INITIAL_TASKS))
    }
    const tasks: Task[] = savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS
    setBacklogTasks(tasks.filter((t) => t.inBacklog))

    const params = new URLSearchParams(window.location.search)
    setAssigneeFilter(params.get("assignee") || "")
    setTagFilter(params.get("tag") || "")
    setSearchQuery(params.get("query") || "")
  }, [])

  const addTask = useCallback(
    (task: Task) => {
      const savedTasks = localStorage.getItem("tasks")
      const tasks: Task[] = savedTasks ? JSON.parse(savedTasks) : []
      localStorage.setItem("tasks", JSON.stringify([...tasks, task]))
      setBacklogTasks((prev) => [...prev, task])
      setIsModalOpen(false)
    },
    [setBacklogTasks]
  )

  const moveToTasks = useCallback(
    (task: Task) => {
      const updatedTask: Task = { ...task, inBacklog: false }
      const savedTasks = localStorage.getItem("tasks")
      const tasks: Task[] = savedTasks ? JSON.parse(savedTasks) : []
      const otherTasks = tasks.filter((t) => t.id !== task.id)
      localStorage.setItem(
        "tasks",
        JSON.stringify([...otherTasks, updatedTask])
      )
      setBacklogTasks((prev) => prev.filter((t) => t.id !== task.id))
    },
    [setBacklogTasks]
  )

  const handleFilterUpdate = useCallback((key: string, value: string) => {
    const newUrl = formUrlQuery({
      params: window.location.search,
      key,
      value,
    })
    window.history.replaceState({}, "", newUrl)

    if (key === "assignee") setAssigneeFilter(value)
    if (key === "tag") setTagFilter(value)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    const newUrl = formUrlQuery({
      params: window.location.search,
      key: "query",
      value,
    })
    window.history.replaceState({}, "", newUrl)
  }, [])

  const clearFilters = useCallback(() => {
    const newUrl = removeKeysFromUrlQuery({
      params: window.location.search,
      keysToRemove: ["assignee", "tag", "query"],
    })
    window.history.replaceState({}, "", newUrl)

    setAssigneeFilter("")
    setTagFilter("")
    setSearchQuery("")
  }, [])

  const filteredTasks = backlogTasks.filter((task) => {
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

  return (
    <section className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>Backlogs</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className='mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
      >
        + Add Task
      </button>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-start justify-center z-50 p-8 overflow-y-auto backdrop-blur-sm'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>

            <h2 className='text-xl font-semibold mb-4'>Add New Task</h2>
            <AddTaskForm onAdd={addTask} />
          </div>
        </div>
      )}

      <SearchInput
        route='/backlogs'
        placeholder='Search backlogs...'
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <Suspense fallback={<div>Loading filters...</div>}>
        <TasksFilter
          tasks={backlogTasks}
          selectedAssignee={assigneeFilter}
          selectedTag={tagFilter}
          onFilterUpdate={handleFilterUpdate}
          onClearFilters={clearFilters}
        />
      </Suspense>

      <BacklogList tasks={filteredTasks} onMove={moveToTasks} />
    </section>
  )
}

export default BackLogs
