import Image from "next/image"
import boardImg from "@/public/board.svg"

export default function Home() {
  return (
    <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center p-8'>
      <div className='flex-1'>
        <h1 className='text-3xl font-bold mb-4'>
          Welcome to Becoming You Labs Kanban Board!
        </h1>
        <p className='text-gray-700  mb-4'>
          Organize your tasks efficiently with Becoming You Labs Kanban board.
          Track your work in different stages: Backlog, Scheduled, In Progress,
          and Done.
        </p>
        <p className='text-gray-600 '>
          Use the navigation links to access your Backlogs or Task List and
          start managing your workflow.
        </p>
      </div>

      <div className='flex-1 flex justify-center items-center'>
        <Image
          src={boardImg}
          alt='Kanban Board Illustration'
          width={320}
          height={320}
          className='object-contain'
        />
      </div>
    </section>
  )
}
