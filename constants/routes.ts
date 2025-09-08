const ROUTES = {
  HOME: "/",
  BACKLOGS: "/backlogs",
  TASKS: "/tasks",
  TASK: (id: string) => `/tasks/${id}`,
}

export default ROUTES
