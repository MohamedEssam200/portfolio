"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed"
  start_date: string
  end_date: string
  progress: number
  color: string
  taskCount: number
}

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  project_id: string
  assignee_id: string
  due_date: string
  estimated_hours: number
  actual_hours: number
  created_at: string
  updated_at: string
}

export function useTaskFlow() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/taskflow/projects")
      const data = await response.json()

      if (response.ok) {
        setProjects(data.projects || [])
      } else {
        setError(data.error || "Failed to fetch projects")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  const fetchTasks = async (projectId?: string) => {
    try {
      const url = projectId ? `/api/taskflow/tasks?projectId=${projectId}` : "/api/taskflow/tasks"

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setTasks(data.tasks || [])
      } else {
        setError(data.error || "Failed to fetch tasks")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  const createProject = async (projectData: {
    name: string
    description: string
    startDate: string
    endDate: string
    color?: string
  }) => {
    try {
      const response = await fetch("/api/taskflow/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchProjects()
        return data.project
      } else {
        throw new Error(data.error || "Failed to create project")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
      throw err
    }
  }

  const createTask = async (taskData: {
    title: string
    description: string
    projectId: string
    assigneeId: string
    priority: string
    dueDate: string
    estimatedHours: number
    tags: string[]
  }) => {
    try {
      const response = await fetch("/api/taskflow/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchTasks()
        return data.task
      } else {
        throw new Error(data.error || "Failed to create task")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
      throw err
    }
  }

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch(`/api/taskflow/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchTasks()
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to update task")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task")
      throw err
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchProjects(), fetchTasks()])
      setLoading(false)
    }

    loadData()
  }, [])

  return {
    projects,
    tasks,
    loading,
    error,
    createProject,
    createTask,
    updateTaskStatus,
    refetchProjects: fetchProjects,
    refetchTasks: fetchTasks,
  }
}
