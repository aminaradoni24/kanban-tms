interface RouteParams {
  params: Promise<Record<string, string>>
}

export interface Task {
  id: string
  title: string
  description: string
  status: "scheduled" | "in-progress" | "done"
  assignee: string
  tags: string[]
  createdAt: Date
  inBacklog?: boolean
}
