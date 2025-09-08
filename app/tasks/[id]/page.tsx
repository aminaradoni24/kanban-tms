"use client"

import React, { useEffect, useState } from "react"
import { Task, RouteParams } from "@/types/global"
import { BackButton } from "@/components/BackButton"

const TaskDetails = ({ params }: RouteParams) => {
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams

  const [task, setTask] = useState<Task | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Task["status"]>("scheduled")
  const [assignee, setAssignee] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [inBacklog, setInBacklog] = useState(true)

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      const tasks: Task[] = JSON.parse(savedTasks)
      const foundTask = tasks.find((t) => t.id === id)
      if (foundTask) {
        setTask(foundTask)
        setTitle(foundTask.title)
        setDescription(foundTask.description)
        setStatus(foundTask.status)
        setAssignee(foundTask.assignee)
        setTags(foundTask.tags)
        setInBacklog(!!foundTask.inBacklog)
      }
    }
  }, [id])

  if (!task)
    return (
      <div className='p-8 text-gray-600 text-center text-lg'>
        Task not found.
      </div>
    )

  const handleSave = () => {
    const updatedTask: Task = {
      ...task,
      title,
      description,
      status,
      assignee,
      tags,
      inBacklog,
    }

    const savedTasks = localStorage.getItem("tasks")
    const tasks: Task[] = savedTasks ? JSON.parse(savedTasks) : []
    const otherTasks = tasks.filter((t) => t.id !== id)
    localStorage.setItem("tasks", JSON.stringify([...otherTasks, updatedTask]))
    setTask(updatedTask)
    alert("Task updated successfully!")
  }

  const handleAddTag = () => {
    const newTag = tagInput.trim()
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
    }
    setTagInput("")
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <>
      <BackButton />
      <section className='p-8 flex justify-center'>
        <div className='w-full max-w-2xl bg-white  border border-gray-200  rounded-2xl shadow-xl p-8 flex flex-col gap-6'>
          <h1 className='text-3xl font-bold text-center text-gray-900  mb-4'>
            Edit Task
          </h1>

          <div>
            <label className='font-semibold text-gray-700 '>Title</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1 w-full p-2 rounded-lg border border-gray-300  bg-gray-50  text-gray-900 '
            />
          </div>

          <div>
            <label className='font-semibold text-gray-700 '>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='mt-1 w-full p-2 rounded-lg border border-gray-300  bg-gray-50  text-gray-900 '
              rows={4}
            />
          </div>

          <div>
            <label className='font-semibold text-gray-700 '>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              className='mt-1 w-full p-2 rounded-lg border border-gray-300  bg-gray-50  text-gray-900 '
            >
              <option value='scheduled'>Scheduled</option>
              <option value='in-progress'>In Progress</option>
              <option value='done'>Done</option>
            </select>
          </div>

          <div>
            <label className='font-semibold text-gray-700 '>Assignee</label>
            <input
              type='text'
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className='mt-1 w-full p-2 rounded-lg border border-gray-300 bg-gray-50  text-gray-900'
            />
          </div>

          <div>
            <label className='font-semibold text-gray-700 '>Tags</label>
            <div className='flex gap-2 flex-wrap mt-1 mb-2'>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className='flex items-center gap-1 px-2 py-1 bg-gray-200  text-gray-800 rounded-full text-sm'
                >
                  {tag}
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag)}
                    className='text-xs font-bold hover:text-red-500'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type='text'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder='Type tag and press Enter'
              className='mt-1 w-full p-2 rounded-lg border border-gray-300  bg-gray-50  text-gray-900 '
            />
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={inBacklog}
              onChange={(e) => setInBacklog(e.target.checked)}
              className='w-4 h-4'
              disabled={status === "done"}
            />
            <label className='font-semibold text-gray-700 '>In Backlog</label>
          </div>

          <button
            onClick={handleSave}
            className='mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition'
          >
            Save Changes
          </button>
        </div>
      </section>
    </>
  )
}

export default TaskDetails
