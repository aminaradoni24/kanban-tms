"use client"

import { useState } from "react"
import { Task } from "@/types/global"
import { v4 as uuidv4 } from "uuid"

interface AddTaskFormProps {
  onAdd: (task: Task) => void
}

export const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignee, setAssignee] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState("")

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAdd = () => {
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setError("")

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      assignee,
      status: "scheduled",
      tags,
      createdAt: new Date(),
      inBacklog: true,
    }

    onAdd(newTask)
    setTitle("")
    setDescription("")
    setAssignee("")
    setTags([])
    setTagInput("")
  }

  return (
    <div className='mb-6 p-4 border rounded-lg bg-white border-gray-300 shadow-sm'>
      <h2 className='font-semibold mb-2'>Add New Task</h2>

      <input
        type='text'
        placeholder='Title (required)'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`w-full p-2 mb-1 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        required
      />
      {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

      <textarea
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='w-full p-2 mb-2 border border-gray-300 rounded'
      />

      <input
        type='text'
        placeholder='Assignee'
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className='w-full p-2 mb-2 border border-gray-300 rounded'
      />

      <input
        type='text'
        placeholder='Add tag and press Enter'
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleAddTag}
        className='w-full p-2 mb-2 border border-gray-300 rounded'
      />

      <div className='flex flex-wrap gap-2 mb-2'>
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className='flex items-center gap-1 px-2 py-1 bg-gray-200  text-gray-800  rounded-full text-sm'
          >
            <span>{tag}</span>
            <button
              type='button'
              onClick={() => handleRemoveTag(tag)}
              className='text-xs font-bold hover:text-red-500'
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
      >
        Add to Backlog
      </button>
    </div>
  )
}
